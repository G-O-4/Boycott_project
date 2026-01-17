import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/client.js';
import { createError } from '../../middleware/errorHandler.js';
import { AuthRequest } from '../../middleware/auth.js';

export const getAllCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '20', verdict, status, search } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (verdict) where.verdictLabel = verdict;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { nameEn: { contains: search as string, mode: 'insensitive' } },
        { nameAr: { contains: search as string } },
        { aliases: { has: search as string } },
      ];
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          parent: {
            select: {
              id: true,
              nameEn: true,
              nameAr: true,
            },
          },
          _count: {
            select: {
              brands: true,
              subsidiaries: true,
            },
          },
        },
        orderBy: { nameEn: 'asc' },
      }),
      prisma.company.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        companies,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        parent: true,
        subsidiaries: {
          include: {
            brands: {
              select: {
                id: true,
                nameEn: true,
                nameAr: true,
              },
            },
          },
        },
        brands: {
          include: {
            products: {
              select: {
                id: true,
                nameEn: true,
                nameAr: true,
                verdictLabel: true,
              },
              take: 10,
            },
          },
        },
        claims: {
          include: {
            claim: {
              include: {
                evidenceSources: true,
              },
            },
          },
        },
        changelog: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!company) {
      throw createError('Company not found', 404);
    }

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// Build ownership chain recursively
const buildOwnershipChain = async (companyId: string, visited: Set<string> = new Set()): Promise<any> => {
  if (visited.has(companyId)) return null;
  visited.add(companyId);

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      nameEn: true,
      nameAr: true,
      logoUrl: true,
      verdictLabel: true,
      status: true,
      parentId: true,
      brands: {
        select: {
          id: true,
          nameEn: true,
          nameAr: true,
          logoUrl: true,
        },
      },
    },
  });

  if (!company) return null;

  let parent = null;
  if (company.parentId) {
    parent = await buildOwnershipChain(company.parentId, visited);
  }

  return {
    ...company,
    parent,
  };
};

// Get sibling brands (other brands owned by same parent)
const getSiblingBrands = async (companyId: string): Promise<any[]> => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { parent: true },
  });

  if (!company?.parentId) return [];

  const siblings = await prisma.brand.findMany({
    where: {
      company: {
        parentId: company.parentId,
        NOT: { id: companyId },
      },
    },
    select: {
      id: true,
      nameEn: true,
      nameAr: true,
      logoUrl: true,
      company: {
        select: {
          id: true,
          nameEn: true,
          nameAr: true,
        },
      },
    },
    take: 20,
  });

  return siblings;
};

export const getCompanyOwnership = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const [ownershipChain, alsoOwns] = await Promise.all([
      buildOwnershipChain(id),
      getSiblingBrands(id),
    ]);

    if (!ownershipChain) {
      throw createError('Company not found', 404);
    }

    res.json({
      success: true,
      data: {
        chain: ownershipChain,
        alsoOwns,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const brands = await prisma.brand.findMany({
      where: { companyId: id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.json({
      success: true,
      data: brands,
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          brand: { companyId: id },
        },
        skip,
        take: limitNum,
        include: {
          brand: true,
          category: true,
        },
      }),
      prisma.product.count({
        where: { brand: { companyId: id } },
      }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    const company = await prisma.company.create({
      data: {
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        aliases: data.aliases || [],
        country: data.country,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        description: data.description,
        descriptionAr: data.descriptionAr,
        parentId: data.parentId,
        verdictLabel: data.verdictLabel || 'UNKNOWN',
        status: data.status || 'UNDER_REVIEW',
        confidence: data.confidence || 'LOW',
      },
    });

    await prisma.companyChangelog.create({
      data: {
        companyId: company.id,
        field: 'created',
        newValue: JSON.stringify(data),
        changedBy: req.user?.id,
        reason: 'Initial creation',
      },
    });

    res.status(201).json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.company.findUnique({ where: { id } });
    if (!existing) {
      throw createError('Company not found', 404);
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        ...(data.nameEn && { nameEn: data.nameEn }),
        ...(data.nameAr && { nameAr: data.nameAr }),
        ...(data.aliases && { aliases: data.aliases }),
        ...(data.country && { country: data.country }),
        ...(data.logoUrl && { logoUrl: data.logoUrl }),
        ...(data.websiteUrl && { websiteUrl: data.websiteUrl }),
        ...(data.description && { description: data.description }),
        ...(data.descriptionAr && { descriptionAr: data.descriptionAr }),
        ...(data.parentId !== undefined && { parentId: data.parentId }),
        ...(data.verdictLabel && { verdictLabel: data.verdictLabel }),
        ...(data.status && { status: data.status }),
        ...(data.confidence && { confidence: data.confidence }),
      },
    });

    await prisma.companyChangelog.create({
      data: {
        companyId: company.id,
        field: 'updated',
        oldValue: JSON.stringify(existing),
        newValue: JSON.stringify(data),
        changedBy: req.user?.id,
        reason: data.reason || 'Update',
      },
    });

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

