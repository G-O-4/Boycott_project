import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../database/client.js';
import { createError } from '../../middleware/errorHandler.js';
import { AuthRequest } from '../../middleware/auth.js';

export const getAlternativesByProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { city } = req.query;

    const alternatives = await prisma.alternative.findMany({
      where: { productId },
      include: {
        alternative: {
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
        },
        storeAvailability: {
          where: city ? {
            store: { city: city as string },
            isAvailable: true,
          } : { isAvailable: true },
          include: {
            store: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: [
        { isExactAlternative: 'desc' },
      ],
    });

    // Group by exact and category alternatives
    const exact = alternatives.filter((a) => a.isExactAlternative);
    const category = alternatives.filter((a) => !a.isExactAlternative);

    res.json({
      success: true,
      data: {
        exact,
        category,
        total: alternatives.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAlternativesByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    const { city, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const skip = (pageNum - 1) * limitNum;

    // Get preferred products in this category
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          categoryId,
          verdictLabel: 'PREFERRED',
          status: 'VERIFIED',
        },
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
                },
              },
            },
          },
          alternativeFor: {
            include: {
              storeAvailability: {
                where: city ? {
                  store: { city: city as string },
                  isAvailable: true,
                } : { isAvailable: true },
                include: {
                  store: true,
                },
                orderBy: { createdAt: 'desc' },
                take: 3,
              },
            },
          },
        },
        orderBy: { nameEn: 'asc' },
      }),
      prisma.product.count({
        where: {
          categoryId,
          verdictLabel: 'PREFERRED',
          status: 'VERIFIED',
        },
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

export const getTopAlternatives = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city, limit = '10' } = req.query;
    const limitNum = Math.min(parseInt(limit as string), 50);

    // Get most confirmed alternatives
    const alternatives = await prisma.alternative.findMany({
      where: {
        storeAvailability: city ? {
          some: {
            store: { city: city as string },
            isAvailable: true,
          },
        } : {
          some: { isAvailable: true },
        },
      },
      include: {
        product: {
          include: {
            brand: true,
          },
        },
        alternative: {
          include: {
            brand: true,
            category: true,
          },
        },
        _count: {
          select: { storeAvailability: true },
        },
      },
      orderBy: {
        storeAvailability: {
          _count: 'desc',
        },
      },
      take: limitNum,
    });

    res.json({
      success: true,
      data: alternatives,
    });
  } catch (error) {
    next(error);
  }
};

export const createAlternative = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { productId, alternativeId, isExactAlternative, notes, notesAr } = req.body;

    // Verify both products exist
    const [product, altProduct] = await Promise.all([
      prisma.product.findUnique({ where: { id: productId } }),
      prisma.product.findUnique({ where: { id: alternativeId } }),
    ]);

    if (!product) {
      throw createError('Source product not found', 404);
    }
    if (!altProduct) {
      throw createError('Alternative product not found', 404);
    }

    // Check alternative product is PREFERRED
    if (altProduct.verdictLabel !== 'PREFERRED') {
      throw createError('Alternative product must have PREFERRED verdict', 400);
    }

    const alternative = await prisma.alternative.create({
      data: {
        productId,
        alternativeId,
        isExactAlternative: isExactAlternative || false,
        notes,
        notesAr,
      },
      include: {
        product: true,
        alternative: true,
      },
    });

    res.status(201).json({
      success: true,
      data: alternative,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAlternative = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.alternative.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Alternative deleted',
    });
  } catch (error) {
    next(error);
  }
};

