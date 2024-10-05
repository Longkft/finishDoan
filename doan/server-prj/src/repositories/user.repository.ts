import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from './abstract.repository';
import { UserDocument } from 'src/models/user.model';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
    protected readonly logger = new Logger(UsersRepository.name);

    constructor(@InjectModel(UserDocument.name) readonly userModel: Model<UserDocument>) {
        super(userModel);
    }

    async getCountUser() {
        return await this.userModel.countDocuments();
    }

    async getMonthlyActiveUsers() {
        const currentYear = new Date().getFullYear();

        const monthlyActiveUsers = await this.userModel.aggregate([
            { $unwind: '$loginHistory' },
            {
                $match: {
                    loginHistory: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                        $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$loginHistory' },
                        month: { $month: '$loginHistory' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                },
            },
        ]);

        return monthlyActiveUsers.map((record) => ({
            _id: `${record._id.year}-${record._id.month}`,
            totalCount: record.count,
        }));
    }

    async getDailyActiveUsersCurrentMonth() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const dailyActiveUsers = await this.userModel.aggregate([
            { $unwind: '$loginHistory' },
            {
                $match: {
                    loginHistory: {
                        $gte: new Date(`${currentYear}-${currentMonth}-01T00:00:00.000Z`),
                        $lt: new Date(`${currentYear}-${currentMonth + 1}-01T00:00:00.000Z`),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$loginHistory' },
                        month: { $month: '$loginHistory' },
                        day: { $dayOfMonth: '$loginHistory' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                    '_id.day': 1,
                },
            },
        ]);

        return dailyActiveUsers.map((record) => ({
            _id: `${record._id.year}-${record._id.month}-${record._id.day}`,
            totalCount: record.count,
        }));
    }
}
