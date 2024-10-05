import { Injectable } from '@nestjs/common';
import { ResourceRepository } from 'src/repositories/resource.repository';
import { RoleRepository } from 'src/repositories/role.repository';
import { convert2ObjectId } from 'src/utils/tool.util';

@Injectable()
export class RbacService {
    constructor(
        private readonly resourceRepository: ResourceRepository,
        private readonly roleRepository: RoleRepository,
    ) {}
    async createResource({ name = 'profile', description = '' }) {
        try {
            const resource = await this.resourceRepository.create({
                src_name: name,
                src_description: description,
            });
            return resource;
        } catch (error) {
            return error;
        }
    }

    async resourceList() {
        try {
            return await this.resourceRepository.resourceList();
        } catch (error) {
            return [];
        }
    }

    async createRole({ name = 'shop', description = 'extend from shop or user', grants = [] }) {
        try {
            grants = grants.map((item) => ({
                ...item,
                resourceId: convert2ObjectId(item.resourceId),
            }));

            const newRole = await this.roleRepository.create({
                rol_name: name,
                rol_description: description,
                rol_grants: grants,
            });

            return newRole;
        } catch (error) {
            return error;
        }
    }

    async roleList() {
        try {
            return await this.roleRepository.roleList();
        } catch (error) {}
    }
}
