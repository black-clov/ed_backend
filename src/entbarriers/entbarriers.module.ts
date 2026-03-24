import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntBarriersController } from './entbarriers.controller';
import { EntBarriersService } from './entbarriers.service';
import { EntBarrierEntity } from './entities/ent-barrier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EntBarrierEntity])],
  controllers: [EntBarriersController],
  providers: [EntBarriersService],
  exports: [EntBarriersService],
})
export class EntBarriersModule {}
