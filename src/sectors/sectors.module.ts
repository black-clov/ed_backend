import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorsController } from './sectors.controller';
import { SectorsService } from './sectors.service';
import { SectorSelectionEntity } from './entities/sector-selection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SectorSelectionEntity])],
  controllers: [SectorsController],
  providers: [SectorsService],
  exports: [SectorsService],
})
export class SectorsModule {}
