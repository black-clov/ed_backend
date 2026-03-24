import { Module } from '@nestjs/common';
import { RecommendationsController } from './recommendations.controller';
import { RecommendationsService } from './recommendations.service';
import { SkillsModule } from '../skills/skills.module';
import { BarriersModule } from '../barriers/barriers.module';

@Module({
  imports: [SkillsModule, BarriersModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
})
export class RecommendationsModule {}
