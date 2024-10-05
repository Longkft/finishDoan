import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { KeyTokenDocument, KeyTokenModel } from 'src/models/key-token.model';
import { KeyTokenService } from 'src/services/keyToken.service';
import { KeyTokenRepository } from 'src/repositories/key-token.repository';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([{ name: KeyTokenDocument.name, schema: KeyTokenModel }])],
    providers: [KeyTokenRepository, KeyTokenService],
    exports: [KeyTokenService],
})
export class KeyTokenModule {}
