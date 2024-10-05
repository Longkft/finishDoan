import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { HistoryDocument } from 'src/models/history.model';

@Injectable()
export class HistoryRepository extends AbstractRepository<HistoryDocument> {
    protected readonly logger = new Logger(HistoryRepository.name);

    constructor(@InjectModel(HistoryDocument.name) readonly historyModel: Model<HistoryDocument>) {
        super(historyModel);
    }

    async getMostPlayedLevel() {
        return await this.historyModel.aggregate([
            { $project: { ratio: { $objectToArray: '$ratio' } } },
            { $unwind: '$ratio' },
            {
                $group: {
                    _id: '$ratio.k',
                    playCount: {
                        $sum: {
                            $sum: { $objectToArray: '$ratio.v.v' },
                        },
                    },
                },
            },
            { $sort: { playCount: -1 } },
            { $limit: 1 },
        ]);
    }
}
