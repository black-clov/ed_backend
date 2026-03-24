import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';
import { ProgramEntity } from './entities/program.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProgramEntity])],
  controllers: [ProgramsController],
  providers: [ProgramsService],
})
export class ProgramsModule {}
