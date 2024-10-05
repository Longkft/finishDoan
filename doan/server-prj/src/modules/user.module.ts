import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserDocument, UserSchema } from 'src/models/user.model';
import { UsersController } from 'src/controllers/user.controller';
import { UsersRepository } from 'src/repositories/user.repository';
import { UsersService } from 'src/services/user.service';
import { KeyTokenModule } from './key-token.module';

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }]),
        KeyTokenModule,
    ],
    controllers: [UsersController],
    providers: [UsersRepository, UsersService],
    exports: [UsersService],
})
export class UsersModule {}
