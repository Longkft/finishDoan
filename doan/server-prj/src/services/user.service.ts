import {
    BadRequestException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { convert2ObjectId, getFieldsOfObject } from 'src/utils/tool.util';
import { createTokenPair } from 'src/utils/auth.util';
import { KeyTokenService } from './keyToken.service';
import { UsersRepository } from 'src/repositories/user.repository';
import { CreateUserDto, VerifyUserDto } from 'src/dto/user.dto';
import { UpdateQuery } from 'mongoose';
import { UserDocument } from 'src/models/user.model';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly keyTokenService: KeyTokenService,
    ) {}

    async createUser(createUserDto: CreateUserDto) {
        await this.validateCreateUserDto(createUserDto);

        const passwordHash = await bcrypt.hash(createUserDto.password, 10);
        const newUser = await this.usersRepository.create({
            ...createUserDto,
            password: passwordHash,
        });

        if (newUser) {
            const tokens = await this.generateToken(newUser._id.toString(), createUserDto.email, createUserDto.role);
            return {
                code: HttpStatus.CREATED,
                user: getFieldsOfObject(newUser, ['_id', 'email']),
                tokens,
            };
        }

        return {
            code: HttpStatus.OK,
            metadata: null,
        };
    }

    private async validateCreateUserDto(createUserDto: CreateUserDto) {
        try {
            await this.usersRepository.findOne({ email: createUserDto.email });
        } catch (error) {
            return;
        }
        throw new UnprocessableEntityException('Email already exists');
    }

    private async generateToken(_id: string, email: string, role: string) {
        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair({ _id, email, role }, publicKey, privateKey);

        await this.keyTokenService.createToken(_id, publicKey, privateKey, tokens.refreshToken);
        return tokens;
    }

    async verifyUser(verifyUserDto: VerifyUserDto) {
        const user = await this.usersRepository.findOne({ email: verifyUserDto.email });
        const passwordIsValid = await bcrypt.compare(verifyUserDto.password, user.password);

        if (!passwordIsValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateToken(user._id.toString(), user.email, user.role);
        return {
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
            },
            tokens,
        };
    }

    async handleRefreshToken(data) {
        const { _id, usr_email } = data.user;
        if (data.keyStore.refreshTokensUsed.includes(data.refreshToken)) {
            await this.keyTokenService.deleteKeyByUserId(_id);
            throw new BadRequestException('Please re-login');
        }

        if (data.keyStore.refreshToken !== data.refreshToken) {
            throw new UnauthorizedException('user not registered');
        }

        const user = await this.usersRepository.findOne({ usr_email: { $eq: usr_email, $type: 'string' } });
        if (!user) throw new NotFoundException('User not found');

        const tokens = await createTokenPair(
            { _id, usr_email, usr_role: user.role },
            data.keyStore.publicKey,
            data.keyStore.privateKey,
        );

        await this.keyTokenService.updateTokenByUserId(_id, {
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: data.refreshToken,
            },
        });

        return {
            user: {
                _id: user._id,
                email: user.email,
            },
            tokens,
        };
    }

    async logout(keyStore) {
        return await this.keyTokenService.deleteKeyById(keyStore._id);
    }

    async getCountUser() {
        return await this.usersRepository.getCountUser();
    }

    async updateUser(userId: string, dataUpdate: UpdateQuery<UserDocument>) {
        return await this.usersRepository.updateOne({ _id: convert2ObjectId(userId) }, dataUpdate);
    }

    async getMonthlyActiveUsers() {
        return await this.usersRepository.getMonthlyActiveUsers();
    }

    async getDailyActiveUsersCurrentMonth() {
        return await this.usersRepository.getDailyActiveUsersCurrentMonth();
    }
}
