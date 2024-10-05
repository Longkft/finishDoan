import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { HistoryDocument, HistoryModel } from 'src/models/history.model';
import { HistoryService } from 'src/services/history.service';
import { HistoryRepository } from 'src/repositories/history.repository';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([{ name: HistoryDocument.name, schema: HistoryModel }])],
    controllers: [],
    providers: [HistoryService, HistoryRepository],
    exports: [HistoryService],
})
export class HistoryModule {}
