import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/client.js';
import { createError } from '../../middleware/errorHandler.js';
import { AuthRequest } from '../../middleware/auth.js';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      page = '1', 
      limit = '20', 
      category, 
      verdict, 
      status,
      brandId 
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (category) where.categoryId = category;
    if (verdict) where.verdictLabel = verdict;
    if (status) where.status = status;
    if (brandId) where.brandId = brandId;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          brand: {
            include: {
              company: {
                select: {
                  id: true,
                  nameEn: true,
                  nameAr: true,
                  verdictLabel: true,
                },
              },
            },
          },
          category: true,
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.product.count({ where }),
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

export const getProductByBarcode = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { barcode } = req.params;

    const product = await prisma.product.findUnique({
      where: { barcode },
      include: {
        brand: {
          include: {
            company: {
              include: {
                parent: {
                  select: {
                    id: true,
                    nameEn: true,
                    nameAr: true,
                    verdictLabel: true,
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
              },
            },
          },
        },
        category: true,
        claims: {
          include: {
            claim: {
              include: {
                evidenceSources: true,
              },
            },
          },
        },
        alternatives: {
          take: 5,
          include: {
            alternative: {
              include: {
                brand: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw createError('Product not found', 404);
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: {
          include: {
            company: {
              include: {
                parent: true,
                subsidiaries: {
                  select: {
                    id: true,
                    nameEn: true,
                    nameAr: true,
                  },
                },
                brands: {
                  select: {
                    id: true,
                    nameEn: true,
                    nameAr: true,
                  },
                },
              },
            },
          },
        },
        category: true,
        claims: {
          include: {
            claim: {
              include: {
                evidenceSources: true,
              },
            },
          },
        },
        alternatives: {
          include: {
            alternative: {
              include: {
                brand: true,
                category: true,
              },
            },
            storeAvailability: {
              include: {
                store: true,
              },
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
          },
        },
        changelog: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product) {
      throw createError('Product not found', 404);
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    const product = await prisma.product.create({
      data: {
        barcode: data.barcode,
        nameEn: data.nameEn,
        nameAr: data.nameAr,
        aliases: data.aliases || [],
        description: data.description,
        descriptionAr: data.descriptionAr,
        imageUrl: data.imageUrl,
        images: data.images || [],
        brandId: data.brandId,
        categoryId: data.categoryId,
        verdictLabel: data.verdictLabel || 'UNKNOWN',
        status: data.status || 'UNDER_REVIEW',
        confidence: data.confidence || 'LOW',
      },
      include: {
        brand: true,
        category: true,
      },
    });

    // Log changelog
    await prisma.productChangelog.create({
      data: {
        productId: product.id,
        field: 'created',
        newValue: JSON.stringify(data),
        changedBy: req.user?.id,
        reason: 'Initial creation',
      },
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw createError('Product not found', 404);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.barcode && { barcode: data.barcode }),
        ...(data.nameEn && { nameEn: data.nameEn }),
        ...(data.nameAr && { nameAr: data.nameAr }),
        ...(data.aliases && { aliases: data.aliases }),
        ...(data.description && { description: data.description }),
        ...(data.descriptionAr && { descriptionAr: data.descriptionAr }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        ...(data.images && { images: data.images }),
        ...(data.brandId && { brandId: data.brandId }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.verdictLabel && { verdictLabel: data.verdictLabel }),
        ...(data.status && { status: data.status }),
        ...(data.confidence && { confidence: data.confidence }),
        lastReviewedAt: new Date(),
      },
      include: {
        brand: true,
        category: true,
      },
    });

    // Log changelog
    await prisma.productChangelog.create({
      data: {
        productId: product.id,
        field: 'updated',
        oldValue: JSON.stringify(existing),
        newValue: JSON.stringify(data),
        changedBy: req.user?.id,
        reason: data.reason || 'Update',
      },
    });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductAlternatives = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { city } = req.query;

    const alternatives = await prisma.alternative.findMany({
      where: { productId: id },
      include: {
        alternative: {
          include: {
            brand: true,
            category: true,
          },
        },
        storeAvailability: {
          where: city ? {
            store: { city: city as string },
          } : undefined,
          include: {
            store: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    res.json({
      success: true,
      data: alternatives,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductClaims = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const claims = await prisma.productClaim.findMany({
      where: { productId: id },
      include: {
        claim: {
          include: {
            evidenceSources: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: claims.map((pc) => pc.claim),
    });
  } catch (error) {
    next(error);
  }
};

export const recordScan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { sessionId } = req.body;

    await prisma.scanHistory.create({
      data: {
        productId: id,
        userId: req.user?.id,
        sessionId: !req.user ? sessionId : undefined,
      },
    });

    res.json({
      success: true,
      message: 'Scan recorded',
    });
  } catch (error) {
    next(error);
  }
};

export const getTrendingProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = '10' } = req.query;
    const limitNum = Math.min(parseInt(limit as string), 50);

    // Get products with most scans in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const trendingData = await prisma.scanHistory.groupBy({
      by: ['productId'],
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: limitNum,
    });

    // Get product details for trending products
    const productIds = trendingData.map((t) => t.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        brand: {
          include: {
            company: {
              select: {
                id: true,
                nameEn: true,
                nameAr: true,
                verdictLabel: true,
              },
            },
          },
        },
        category: true,
      },
    });

    // Combine with scan counts and maintain order
    const trending = trendingData.map((t) => {
      const product = products.find((p) => p.id === t.productId);
      return {
        ...product,
        scanCount: t._count.productId,
      };
    }).filter(Boolean);

    res.json({
      success: true,
      data: trending,
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalProducts,
      avoidProducts,
      preferredProducts,
      totalAlternatives,
      totalCompanies,
      avoidCompanies,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { verdictLabel: 'AVOID' } }),
      prisma.product.count({ where: { verdictLabel: 'PREFERRED' } }),
      prisma.alternative.count(),
      prisma.company.count(),
      prisma.company.count({ where: { verdictLabel: 'AVOID' } }),
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        avoidProducts,
        preferredProducts,
        totalAlternatives,
        totalCompanies,
        avoidCompanies,
      },
    });
  } catch (error) {
    next(error);
  }
};

