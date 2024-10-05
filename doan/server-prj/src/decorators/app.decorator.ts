import { SetMetadata } from '@nestjs/common';
import { DecoratorMetadataKey } from 'src/common/enums/decorator.enum';
import { IResourceAuthorization } from 'src/common/interfaces/decorator.interface';

export const Resource = (resources: IResourceAuthorization) =>
    SetMetadata(DecoratorMetadataKey.RESOURCE_AUTHORIZATION, resources);
