import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { privateDecrypt } from 'crypto';
import mongoose, { Model, UpdateQuery } from 'mongoose';
import { KeyTokenDocument } from 'src/models/key-token.model';
import { KeyTokenRepository } from 'src/repositories/key-token.repository';
import { convert2ObjectId } from 'src/utils/tool.util';

@Injectable()
export class KeyTokenService {
    constructor(private readonly keyTokenRepository: KeyTokenRepository) {}
    async createToken(userId, publicKey, privateKey, refreshToken) {
        try {
            const token = await this.keyTokenRepository.findOneAndUpdate(
                {
                    userId,
                },
                {
                    userId,
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken,
                },
                ['createdAt', 'updatedAt', '_id'],
                true,
            );
            return token ? token.publicKey : null;
        } catch (error) {
            return error;
        }
    }

    async findByUserId(userId: string) {
        return await this.keyTokenRepository.findOne({ userId: convert2ObjectId(userId) });
    }

    async updateTokenByUserId(userId: string, dataUpadte: UpdateQuery<KeyTokenDocument>) {
        return await this.keyTokenRepository.findOneAndUpdate({ userId: convert2ObjectId(userId) }, dataUpadte);
    }

    async deleteKeyById(id: string) {
        return await this.keyTokenRepository.deleteOneToken(id);
    }

    async deleteKeyByUserId(userId: string) {
        return await this.keyTokenRepository.findOneAndDelete({ userId: convert2ObjectId(userId) });
    }

    // async findByRefreshTokenUsed(refreshToken) {
    //     return await this.keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
    // }

    // async findByRefreshToken(refreshToken) {
    //     return await this.keyTokenModel.findOne({ refreshToken }).lean();
    // }
}
