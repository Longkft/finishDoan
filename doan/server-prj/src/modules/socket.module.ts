import { Module } from '@nestjs/common';
import { SocketGateWay } from 'src/gateways/socket.gateway';
import { SocketService } from 'src/services/socket.service';
import { HistoryModule } from './history.module';
import { TasksService } from 'src/services/task.service';
import { CacheService } from 'src/services/cache.service';
import { KeyTokenModule } from './key-token.module';
import { UsersModule } from './user.module';
@Module({
    imports: [HistoryModule, KeyTokenModule, UsersModule],
    providers: [SocketGateWay, SocketService, TasksService, CacheService],
    exports: [SocketGateWay],
})
export class SocketModule {}
