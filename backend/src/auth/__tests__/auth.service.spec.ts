import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth.service';

const user = { id: 'u1', email: 'r@x.io', fullname: 'R', passwordHash: bcrypt.hashSync('pw', 10) };
const prisma = { user: { findUnique: jest.fn() } } as any;
const jwt = { sign: jest.fn().mockReturnValue('token123') } as any;
const service = new AuthService(prisma, jwt);

describe('AuthService.validateAndLogin', () => {
  beforeEach(() => jest.clearAllMocks());
  it('returns a token and user for valid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    const res = await service.validateAndLogin('r@x.io', 'pw');
    expect(res.accessToken).toBe('token123');
    expect(res.user).toEqual({ id: 'u1', email: 'r@x.io', fullname: 'R' });
  });
  it('rejects an unknown email', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.validateAndLogin('no@x.io', 'pw')).rejects.toBeInstanceOf(UnauthorizedException);
  });
  it('rejects a wrong password', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    await expect(service.validateAndLogin('r@x.io', 'nope')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
