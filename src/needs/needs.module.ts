import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeedsController } from './needs.controller';
import { NeedsService } from './needs.service';
import { NeedsAssessmentEntity } from './entities/needs-assessment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NeedsAssessmentEntity])],
  controllers: [NeedsController],
  providers: [NeedsService],
  exports: [NeedsService],
})
export class NeedsModule {}
