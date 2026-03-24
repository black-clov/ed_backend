import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessPlanController } from './businessplan.controller';
import { BusinessPlanService } from './businessplan.service';
import { BusinessPlanEntity } from './entities/business-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessPlanEntity])],
  controllers: [BusinessPlanController],
  providers: [BusinessPlanService],
  exports: [BusinessPlanService],
})
export class BusinessPlanModule {}
