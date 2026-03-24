import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';
import { SupportPreferenceEntity } from './entities/support-preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupportPreferenceEntity])],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}
