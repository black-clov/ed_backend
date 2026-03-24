import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PitchController } from './pitch.controller';
import { PitchService } from './pitch.service';
import { PitchEntity } from './entities/pitch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PitchEntity])],
  controllers: [PitchController],
  providers: [PitchService],
  exports: [PitchService],
})
export class PitchModule {}
