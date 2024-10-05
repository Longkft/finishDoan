import { Injectable } from '@nestjs/common';
import { SocketGateWay } from 'src/gateways/socket.gateway';
import { UsersService } from './user.service';
import { HistoryService } from './history.service';

@Injectable()
export class AdminService {
    constructor(
        private readonly socketGateway: SocketGateWay,
        private readonly userService: UsersService,
        private readonly historyService: HistoryService,
    ) {}

    async overview() {
        const resultOverview = await Promise.all([
            this.userService.getCountUser(),
            this.historyService.getMostPlayedLevel(),
            this.socketGateway.getConnectedClientsCount(),
            this.socketGateway.getCountRoom(),
            this.socketGateway.getRoomPlaying(),
        ]);

        return {
            totalUser: resultOverview[0],
            mostPlayedLevel: resultOverview[1],
            totalUserOnline: resultOverview[2],
            totalRoom: resultOverview[3],
            roomPlaying: resultOverview[4],
        };
    }

    async getMonthlyActiveUsers() {
        return await this.userService.getMonthlyActiveUsers();
    }

    async getDailyActiveUsersCurrentMonth() {
        return await this.userService.getDailyActiveUsersCurrentMonth();
    }
}
