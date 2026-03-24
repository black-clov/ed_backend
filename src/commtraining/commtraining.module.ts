import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommTrainingController } from './commtraining.controller';
import { CommTrainingService } from './commtraining.service';
import { CommTrainingEntity } from './entities/comm-training.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommTrainingEntity])],
  controllers: [CommTrainingController],
  providers: [CommTrainingService],
  exports: [CommTrainingService],
})
export class CommTrainingModule {}
