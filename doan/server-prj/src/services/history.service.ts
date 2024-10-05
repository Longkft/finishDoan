import { Injectable } from '@nestjs/common';
import { GetHistoryDto } from 'src/dto/history.dto';
import { HistoryRepository } from 'src/repositories/history.repository';

@Injectable()
export class HistoryService {
    constructor(private readonly historyRepository: HistoryRepository) {}

    async updateHistory(winner: string, loser: string, draw: string = null, levelSelect: number) {
        const update: any = { countBattle: 1 };

        if (draw) update[`ratio.${levelSelect}.${winner}`] = 1;

        return await this.historyRepository.findOneAndUpdate(
            { 'usersParticipant._id': { $all: [winner, loser] } },
            { $inc: update },
        );
    }

    async getHistory(getHistoryDto: GetHistoryDto) {
        const skip = getHistoryDto.limit * getHistoryDto.page;
        return await this.historyRepository.find(
            { 'usersParticipant._id': getHistoryDto.userId },
            { updatedAt: -1 },
            skip,
            getHistoryDto.limit,
        );
    }

    async getMostPlayedLevel() {
        const result = await this.historyRepository.getMostPlayedLevel();
        return result.length > 0 ? result[0]._id : null;
    }
}
