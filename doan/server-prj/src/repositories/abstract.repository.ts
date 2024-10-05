import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
    protected abstract readonly logger: Logger;

    constructor(protected readonly model: Model<TDocument>) {}

    async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
        const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId(),
        });
        return (await createdDocument.save()).toJSON() as unknown as TDocument;
    }

    async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        const document = await this.model.findOne(filterQuery).lean<TDocument>(true);

        if (!document) {
            this.logger.warn('Document not found with filterQuery', filterQuery);
            throw new NotFoundException('Document not found.');
        }

        return document;
    }

    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
        select: Array<string> = [],
        upsert: boolean = false,
    ) {
        const document = await this.model
            .findOneAndUpdate(filterQuery, update, {
                new: true,
                upsert: upsert,
            })
            .select(select)
            .lean<TDocument>(true);

        if (!document) {
            this.logger.warn('Document not found with filterQuery', filterQuery);
            throw new NotFoundException('Document not found.');
        }

        return document;
    }

    async find(
        filterQuery: FilterQuery<TDocument>,
        sortBy: UpdateQuery<TDocument> = {},
        skip: number = 0,
        limit: number = 20,
    ) {
        return this.model.find(filterQuery).sort(sortBy).skip(skip).limit(limit).lean<TDocument[]>(true);
    }

    async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
        return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
    }

    async updateOne(filterQuery: FilterQuery<TDocument>, update: UpdateQuery<TDocument>) {
        return this.model.updateOne(filterQuery, update).lean<TDocument>(true);
    }
}
