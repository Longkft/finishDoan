import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from './user.module';
import { CheckApiKeyMiddleware } from 'src/middlewares/check-api-key.middleware';
import { UsersController } from 'src/controllers/user.controller';
import { CheckAuthTokenMiddleware } from 'src/middlewares/check-auth-token.middleware';
import { ConfigModule } from '@nestjs/config';
import { KeyTokenModule } from './key-token.module';
import { SocketModule } from './socket.module';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/role.guard';
import { AdminModule } from './admin.module';
import { RbacModule } from './rbac.module';
import { AdminController } from 'src/controllers/admin.controller';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ScheduleModule.forRoot(),
        UsersModule,
        KeyTokenModule,
        SocketModule,
        AdminModule,
        RbacModule,
    ],
    providers: [{ provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CheckApiKeyMiddleware).forRoutes(UsersController, AdminController);
        consumer
            .apply(CheckAuthTokenMiddleware)
            .exclude(
                { path: '/v1/api/users/login', method: RequestMethod.POST },
                { path: '/v1/api/users/signup', method: RequestMethod.POST },
                { path: '/v1/api/users/account/verification', method: RequestMethod.GET },
            )
            .forRoutes(UsersController);
        consumer.apply(CheckAuthTokenMiddleware).forRoutes(AdminController);
    }
}
