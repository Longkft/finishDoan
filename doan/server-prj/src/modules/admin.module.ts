import { Module } from '@nestjs/common';
import { HistoryModule } from './history.module';
import { CacheService } from 'src/services/cache.service';
import { UsersModule } from './user.module';
import { RbacModule } from './rbac.module';
import { AdminController } from 'src/controllers/admin.controller';
import { AdminService } from 'src/services/admin.service';
import { SocketModule } from './socket.module';
@Module({
    imports: [HistoryModule, UsersModule, RbacModule, SocketModule],
    controllers: [AdminController],
    providers: [AdminService, CacheService],
})
export class AdminModule {}
