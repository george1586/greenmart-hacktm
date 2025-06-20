import { fromNodeHeaders } from 'better-auth/node';
import { auth, type Auth } from '../utils/auth.ts';
import type { Request, Response, NextFunction } from 'express';
import { Role, type Order, type Shop } from '@prisma/client';
import { AppError } from '../utils/appError.ts';
import { prismaClient } from '../db/prismaClient.ts';
import { logger } from '../utils/logger.ts';

export interface AuthLocals {
  user: NonNullable<Auth['user']>;
}

export interface ShopLocals {
  user: NonNullable<Auth['user']>;
  shop: Shop;
}

export interface OrderLocals {
  user: NonNullable<Auth['user']>;
  order: Order;
}

export const authHandler = async (
  req: Request,
  res: Response<unknown, AuthLocals>,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    throw AppError.unauthorized('Access denied. Please sign in to continue.');
  }

  res.locals['user'] = session.user;
  next();
};

export const sellerHandler = async (
  _req: Request,
  res: Response<unknown, AuthLocals>,
  next: NextFunction,
) => {
  const { user } = res.locals;
  if (user?.role === Role.SELLER) {
    throw AppError.forbidden('Access denied. You are alr a seller');
  }
  next();
};

export const shopHandler = async (
  _req: Request,
  res: Response<unknown, ShopLocals>,
  next: NextFunction,
) => {
  const { user } = res.locals;
  logger.debug(user);

  if (user.role !== Role.SELLER) {
    throw AppError.forbidden('Access denied. Please create a seller account.');
  }

  const shop = await prismaClient.shop.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!shop) {
    throw AppError.forbidden('Accesss denied. Please create a shop.');
  }

  res.locals['shop'] = shop;

  next();
};
