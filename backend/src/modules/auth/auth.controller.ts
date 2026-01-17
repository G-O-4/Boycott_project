import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../database/client.js';
import { createError } from '../../middleware/errorHandler.js';
import { AuthRequest } from '../../middleware/auth.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, displayName, displayNameAr, city, language } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw createError('Email already registered', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        displayNameAr,
        city,
        language: language || 'ar',
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        displayNameAr: true,
        city: true,
        language: true,
        role: true,
        reputationLevel: true,
        scoreTotal: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw createError('Invalid email or password', 401);
    }

    // Check if active
    if (!user.isActive) {
      throw createError('Account is deactivated', 403);
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          displayNameAr: user.displayNameAr,
          city: user.city,
          language: user.language,
          role: user.role,
          reputationLevel: user.reputationLevel,
          scoreTotal: user.scoreTotal,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        displayName: true,
        displayNameAr: true,
        avatar: true,
        city: true,
        language: true,
        role: true,
        reputationLevel: true,
        scoreTotal: true,
        createdAt: true,
        badges: {
          include: {
            badge: true,
          },
        },
        _count: {
          select: {
            submissions: true,
            storeConfirmations: true,
            scanHistory: true,
          },
        },
      },
    });

    if (!user) {
      throw createError('User not found', 404);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { displayName, displayNameAr, city, language, avatar } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        ...(displayName && { displayName }),
        ...(displayNameAr && { displayNameAr }),
        ...(city && { city }),
        ...(language && { language }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        displayNameAr: true,
        avatar: true,
        city: true,
        language: true,
        role: true,
        reputationLevel: true,
        scoreTotal: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

