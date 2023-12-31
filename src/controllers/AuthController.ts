import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';
import { Logger } from 'winston';
import { TokenService } from '../services/TokenService';
import { UserService } from '../services/UserService';
import { RegisterUserRequest } from '../types';
export class AuthController {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private logger: Logger
  ) {}

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array()
      });
    }
    const { firstName, lastName, email, password, role } = req.body;

    this.logger.debug('Request initiated for registering user', {
      firstName,
      lastName,
      email,
      password: '*******',
      role
    });
    try {
      const newUser = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role
      });
      this.logger.info('User has been registered', { id: newUser.id });

      const payload: JwtPayload = {
        sub: newUser.id,
        role: newUser.role
      };

      const accessToken = await this.tokenService.generateAccessToken(payload);
      const newRefreshToken =
        await this.tokenService.persistRefreshToken(newUser);

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        id: newRefreshToken.id
      });

      res.cookie('accessToken', accessToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60, //1 hour
        httpOnly: true
      });
      res.cookie('refreshToken', refreshToken, {
        domain: 'localhost',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1year
        httpOnly: true
      });

      res.status(201).json(newUser);
    } catch (error) {
      return next(error);
    }
  }
}
