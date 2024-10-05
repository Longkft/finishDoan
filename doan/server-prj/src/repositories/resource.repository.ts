import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { ResourceDocument } from 'src/models/resource.model';

@Injectable()
export class ResourceRepository extends AbstractRepository<ResourceDocument> {
    protected readonly logger = new Logger(ResourceRepository.name);

    constructor(@InjectModel(ResourceDocument.name) readonly resourceModel: Model<ResourceDocument>) {
        super(resourceModel);
    }

    async resourceList() {
        return await this.resourceModel.aggregate([
            {
                $project: {
                    _id: 0,
                    name: '$src_name',
                    description: '$src_description',
                    resourceId: '$_id',
                    createdAt: 1,
                },
            },
        ]);
    }
}
