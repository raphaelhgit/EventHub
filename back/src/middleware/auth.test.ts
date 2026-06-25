import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { authenticate, requireRole, optionalAuth } from './auth.js';
import config from '../config/index.js';
import { UserRole, type JwtPayload } from '../models/user.js';

type MockResponse = Response & {
  statusCode: number;
  body: unknown;
};

function createMockResponse(): MockResponse {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as MockResponse;
}

function createMockRequest(headers: Record<string, string> = {}): Request {
  return { headers } as Request;
}

function signToken(
  payload: JwtPayload,
  expiresIn: SignOptions['expiresIn'] = '1h',
): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
}

const basePayload: JwtPayload = {
  sub: 'user-1',
  email: 'test@example.com',
  role: UserRole.USER,
};

describe('authenticate', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it('retourne 401 si le header Authorization est absent', () => {
    const req = createMockRequest();
    const res = createMockResponse();

    authenticate(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Authorization header missing' });
    expect(next).not.toHaveBeenCalled();
  });

  it('retourne 401 si le format Bearer est invalide', () => {
    const req = createMockRequest({ authorization: 'Token abc' });
    const res = createMockResponse();

    authenticate(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      error: 'Invalid authorization format. Use: Bearer <token>',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('appelle next et remplit req.user avec un token valide', () => {
    const token = signToken(basePayload);
    const req = createMockRequest({ authorization: `Bearer ${token}` });
    const res = createMockResponse();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user).toMatchObject({
      sub: basePayload.sub,
      email: basePayload.email,
      role: basePayload.role,
    });
  });

  it('retourne 401 si le token est expiré', () => {
    const token = signToken(basePayload, '-1s');
    const req = createMockRequest({ authorization: `Bearer ${token}` });
    const res = createMockResponse();

    authenticate(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Token expired' });
    expect(next).not.toHaveBeenCalled();
  });

  it('retourne 401 si le token est invalide', () => {
    const req = createMockRequest({ authorization: 'Bearer not-a-valid-jwt' });
    const res = createMockResponse();

    authenticate(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });
});

describe('requireRole', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it('retourne 401 si req.user est absent', () => {
    const middleware = requireRole(UserRole.ORGANIZER);
    const req = createMockRequest();
    const res = createMockResponse();

    middleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Authentication required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('retourne 403 si le rôle ne correspond pas', () => {
    const middleware = requireRole(UserRole.ORGANIZER);
    const req = createMockRequest();
    req.user = { ...basePayload, role: UserRole.USER };
    const res = createMockResponse();

    middleware(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({
      error: 'Access denied',
      requiredRoles: [UserRole.ORGANIZER],
      yourRole: UserRole.USER,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('appelle next si le rôle est autorisé', () => {
    const middleware = requireRole(UserRole.ORGANIZER, UserRole.ADMIN);
    const req = createMockRequest();
    req.user = { ...basePayload, role: UserRole.ORGANIZER };
    const res = createMockResponse();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });
});

describe('optionalAuth', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it('continue sans user si aucun token', () => {
    const req = createMockRequest();
    const res = createMockResponse();

    optionalAuth(req, res, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledOnce();
  });

  it('remplit req.user avec un token valide', () => {
    const token = signToken(basePayload);
    const req = createMockRequest({ authorization: `Bearer ${token}` });
    const res = createMockResponse();

    optionalAuth(req, res, next);

    expect(req.user).toMatchObject({
      sub: basePayload.sub,
      email: basePayload.email,
      role: basePayload.role,
    });
    expect(next).toHaveBeenCalledOnce();
  });

  it('continue sans user si le token est invalide', () => {
    const req = createMockRequest({ authorization: 'Bearer bad-token' });
    const res = createMockResponse();

    optionalAuth(req, res, next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledOnce();
  });
});
