import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AbstractDocument } from 'src/repositories/abstract.schema';

@Schema({
    versionKey: false,
})
export class KeyTokenDocument extends AbstractDocument {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: String, required: true })
    publicKey: string;

    @Prop({ type: String, required: true })
    privateKey: string;

    @Prop({ type: Array, default: [] })
    refreshTokensUsed: Array<any>;

    @Prop({ type: String, required: true })
    refreshToken: string;
}

export const KeyTokenModel = SchemaFactory.createForClass(KeyTokenDocument);
