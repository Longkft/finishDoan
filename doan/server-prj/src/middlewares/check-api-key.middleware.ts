import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';
import { HeaderApi } from 'src/common/enums/header-api.enum';
import { ExtendedRequest } from 'src/common/interfaces/extended-request.interface';

@Injectable()
export class CheckApiKeyMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}
    async use(req: ExtendedRequest, res: Response, next: NextFunction) {
        try {
            const key = req.headers[HeaderApi.API_KEY]?.toString();

            if (!key || key != this.configService.get<string>('app_secret')) {
                return res.status(403).json({
                    message: 'forbidden error',
                });
            }

            return next();
        } catch (error) {}
    }
}
