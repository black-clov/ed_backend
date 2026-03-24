import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarriersController } from './barriers.controller';
import { BarriersService } from './barriers.service';
import { BarrierEntity } from './entities/barrier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BarrierEntity])],
  controllers: [BarriersController],
  providers: [BarriersService],
  exports: [BarriersService],
})
export class BarriersModule {}
