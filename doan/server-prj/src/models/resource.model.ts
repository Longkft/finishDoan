import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/repositories/abstract.schema';

@Schema({
    versionKey: false,
})
export class ResourceDocument extends AbstractDocument {
    @Prop({ type: String, required: true, unique: true })
    src_name: string;

    @Prop({ type: String, default: '' })
    src_description: string;
}

export const ResourceModel = SchemaFactory.createForClass(ResourceDocument);
