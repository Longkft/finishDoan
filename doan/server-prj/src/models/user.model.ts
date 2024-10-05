import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/repositories/abstract.schema';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Prop()
    password: string;

    @Prop({ type: String, default: 'user' })
    role?: string;

    @Prop()
    socketId?: string;

    @Prop()
    loginHistory?: [];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
