import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UsersController } from 'src/controllers/user.controller';
import { UsersRepository } from 'src/repositories/user.repository';
import { UsersService } from 'src/services/user.service';
import { KeyTokenModule } from './key-token.module';
import { RoleDocument, RoleModel } from 'src/models/role.model';
import { ResourceDocument, ResourceModel } from 'src/models/resource.model';
import { RbacService } from 'src/services/rbac.service';
import { RoleRepository } from 'src/repositories/role.repository';
import { ResourceRepository } from 'src/repositories/resource.repository';

@Module({
    imports: [
        DatabaseModule,
        DatabaseModule.forFeature([
            { name: RoleDocument.name, schema: RoleModel },
            { name: ResourceDocument.name, schema: ResourceModel },
        ]),
    ],
    controllers: [],
    providers: [RbacService, RoleRepository, ResourceRepository],
    exports: [RbacService],
})
export class RbacModule {}
