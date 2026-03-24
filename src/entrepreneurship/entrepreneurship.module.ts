import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntrepreneurshipController } from './entrepreneurship.controller';
import { EntrepreneurshipService } from './entrepreneurship.service';
import { EntrepreneurshipSkillEntity } from './entities/entrepreneurship-skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntrepreneurshipSkillEntity])],
  controllers: [EntrepreneurshipController],
  providers: [EntrepreneurshipService],
  exports: [EntrepreneurshipService],
})
export class EntrepreneurshipModule {}
