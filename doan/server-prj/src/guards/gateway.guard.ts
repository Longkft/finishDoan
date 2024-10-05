import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { WsBadRequestException, WsUnauthorizedException } from 'src/core/ws-exceptions';
import { KeyTokenService } from 'src/services/keyToken.service';
import * as JWT from 'jsonwebtoken';
import { HeaderApi } from 'src/common/enums/header-api.enum';
import { ExtendedSocket } from 'src/common/interfaces/extended-socket.interface';
import { UsersService } from 'src/services/user.service';

@Injectable()
export class GatewayGuard implements CanActivate {
    private readonly logger = new Logger(GatewayGuard.name);
    constructor(
        private keyTokenService: KeyTokenService,
        private userService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const socket: ExtendedSocket = context.switchToWs().getClient();

        const userId = socket.handshake.auth.userId || socket.handshake.headers['userid'];
        if (!userId) throw new WsUnauthorizedException('Invalid Request');

        const keyStore = await this.keyTokenService.findByUserId(userId.toString());
        if (!keyStore) {
            throw new WsBadRequestException('Not found key store');
        }

        const refreshToken = socket.handshake.auth.refreshToken || socket.handshake.headers[HeaderApi.REFRESH_TOKEN];
        if (refreshToken) {
            try {
                const payload = JWT.verify(refreshToken, keyStore.privateKey);
                if (userId !== payload._id) {
                    throw new UnauthorizedException('Invalid User');
                }

                this.updateSocketAndUser(socket, payload);

                return true;
            } catch (error) {
                throw new UnauthorizedException('Token expired');
            }
        }

        const accessToken = socket.handshake.auth.authorization || socket.handshake.headers[HeaderApi.AUTHORIZATION];

        if (!accessToken) {
            this.logger.error('No authorization accessToken provided');

            throw new WsUnauthorizedException('No accessToken provided');
        }

        try {
            const payload = JWT.verify(accessToken, keyStore.publicKey);

            this.logger.debug(`Validating admin using token payload`, payload);

            if (userId !== payload._id) {
                throw new WsUnauthorizedException('Invalid User');
            }

            this.updateSocketAndUser(socket, payload);

            return true;
        } catch {
            throw new WsUnauthorizedException('Token expired');
        }
    }

    async updateSocketAndUser(socket: ExtendedSocket, payload) {
        if (!socket._id && !socket.connectedSocket) {
            socket._id = payload._id;
            socket.email = payload.email;
            socket.connectedSocket = true;

            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            return await this.userService.updateUser(socket._id, { $addToSet: { loginHistory: today } });
        }
    }
}
