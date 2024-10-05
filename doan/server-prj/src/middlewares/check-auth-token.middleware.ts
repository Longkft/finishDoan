import { Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { KeyTokenService } from 'src/services/keyToken.service';
import * as JWT from 'jsonwebtoken';
import { ExtendedRequest } from 'src/common/interfaces/extended-request.interface';
import { HeaderApi } from 'src/common/enums/header-api.enum';

@Injectable()
export class CheckAuthTokenMiddleware implements NestMiddleware {
    constructor(private keyTokenService: KeyTokenService) { }

    async use(req: ExtendedRequest, res: Response, next: NextFunction) {
        const userId = req.headers[HeaderApi.CLIENT_ID];
        if (!userId) throw new UnauthorizedException('Invalid Request');
        const keyStore = await this.keyTokenService.findByUserId(userId.toString());
        if (!keyStore) {
            throw new NotFoundException('Not found key store');
        }

        if (req.headers[HeaderApi.REFRESH_TOKEN]) {
            try {
                const decodeUser = JWT.verify(req.headers[HeaderApi.REFRESH_TOKEN], keyStore.privateKey);
                if (userId !== decodeUser._id) {
                    throw new UnauthorizedException('Invalid User');
                }
                req.keyStore = keyStore;
                req.user = decodeUser;
                req.refreshToken = req.headers[HeaderApi.REFRESH_TOKEN].toString();

                return next();
            } catch (error) {
                throw new UnauthorizedException('Token expired');
            }
        }

        const accessToken = req.headers[HeaderApi.AUTHORIZATION];
        if (!accessToken) {
            throw new UnauthorizedException('Invalid Request');
        }

        try {
            const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
            if (userId !== decodeUser._id) {
                throw new UnauthorizedException('Invalid User');
            }
            req.keyStore = keyStore;
            req.user = decodeUser;

            return next();
        } catch (error) {
            throw new UnauthorizedException('Token expired');
        }
    }
}
