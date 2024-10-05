import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { KeyTokenDocument } from 'src/models/key-token.model';
import { convert2ObjectId } from 'src/utils/tool.util';

@Injectable()
export class KeyTokenRepository extends AbstractRepository<KeyTokenDocument> {
    protected readonly logger = new Logger(KeyTokenRepository.name);

    constructor(@InjectModel(KeyTokenDocument.name) readonly keyTokenModel: Model<KeyTokenDocument>) {
        super(keyTokenModel);
    }

    async deleteOneToken(id: string) {
        return await this.keyTokenModel.deleteOne({ _id: convert2ObjectId(id) });
    }
}
