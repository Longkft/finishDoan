import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/repositories/abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class HistoryDocument extends AbstractDocument {
    @Prop()
    usersParticipant: [];

    @Prop()
    countBattle: number;

    @Prop({ type: Map, default: {} })
    ratio: any;
}

export const HistoryModel = SchemaFactory.createForClass(HistoryDocument);
