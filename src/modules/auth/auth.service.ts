import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';
import { OrganizationsService } from '../organizations/organizations.service';
import { hashPassword, comparePassword } from '../../common/utils/password.util';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private organizationsService: OrganizationsService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Create organization
    const org = await this.organizationsService.create(dto.org_name);

    // Hash password and create user
    const hashedPassword = await hashPassword(dto.password);
    const user = await this.userModel.create({
      name: dto.admin_name,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      orgId: org._id,
    });

    // Update org with createdBy
    org.createdBy = user._id;
    await org.save();

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        orgId: org._id,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const passwordValid = await comparePassword(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        orgId: user.orgId,
        roleId: user.roleId,
      },
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    // Hash the incoming token to compare
    const tokenHash = this.hashToken(refreshToken);

    // Find and delete the stored refresh token (single-use rotation)
    const storedToken = await this.refreshTokenModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      tokenHash,
    }).exec();

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if ((storedToken as any).expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.userModel.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return this.generateTokens(user);
  }

  async logout(userId: string) {
    // Delete all refresh tokens for the user
    await this.refreshTokenModel.deleteMany({
      userId: new Types.ObjectId(userId),
    });
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    // In a real implementation, this would send a password reset email
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    // Always return success to prevent email enumeration
    return {
      message: 'If the email exists, a password reset link has been sent',
    };
  }

  private async generateTokens(user: UserDocument) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      orgId: user.orgId.toString(),
      roleId: user.roleId?.toString() || '',
    };

    const accessExpiry =
      this.configService.get<string>('jwt.accessExpiry') || '15m';
    const refreshExpiry =
      this.configService.get<string>('jwt.refreshExpiry') || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ ...payload, type: 'access' }, { expiresIn: accessExpiry as any }),
      this.jwtService.signAsync({ ...payload, type: 'refresh' }, { expiresIn: refreshExpiry as any }),
    ]);

    // Store refresh token hash
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenModel.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    return { token: accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
