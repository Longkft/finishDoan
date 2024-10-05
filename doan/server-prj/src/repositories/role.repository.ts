import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { RoleDocument } from 'src/models/role.model';

@Injectable()
export class RoleRepository extends AbstractRepository<RoleDocument> {
    protected readonly logger = new Logger(RoleRepository.name);

    constructor(@InjectModel(RoleDocument.name) readonly roleModel: Model<RoleDocument>) {
        super(roleModel);
    }

    async roleList() {
        return await this.roleModel.aggregate([
            {
                $unwind: '$rol_grants',
            },
            {
                $lookup: {
                    from: 'resourcedocuments',
                    localField: 'rol_grants.resourceId',
                    foreignField: '_id',
                    as: 'resource',
                },
            },
            {
                $unwind: '$resource',
            },
            {
                $project: {
                    role: '$rol_name',
                    resource: '$resource.src_name',
                    action: '$rol_grants.actions',
                    attributes: '$rol_grants.attributes',
                },
            },
            {
                $unwind: '$action',
            },
            {
                $project: {
                    role: 1,
                    resource: 1,
                    action: '$action',
                    attributes: 1,
                },
            },
        ]);
    }
}
