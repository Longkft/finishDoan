import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AbstractDocument } from 'src/repositories/abstract.schema';

@Schema({
    versionKey: false,
})
export class RoleDocument extends AbstractDocument {
    @Prop({
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin', 'superadmin'],
    })
    rol_name: string;

    @Prop({ type: String, default: '' })
    rol_description: string;

    @Prop({
        type: String,
        default: 'active',
        enum: ['active', 'block', 'pending'],
    })
    rol_status?: string;

    @Prop()
    rol_grants: Array<{
        resourceId: mongoose.Schema.Types.ObjectId;
        actions: string;
        attributes?: string;
    }>;
}

export const RoleModel = SchemaFactory.createForClass(RoleDocument);
