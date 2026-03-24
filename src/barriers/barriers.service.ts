import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBarrierDto } from './dto/create-barrier.dto';
import { BarrierEntity } from './entities/barrier.entity';

@Injectable()
export class BarriersService {
  constructor(
    @InjectRepository(BarrierEntity)
    private readonly barrierRepo: Repository<BarrierEntity>,
  ) {}

  async create(dto: CreateBarrierDto) {
    const userId = dto.userId ?? 'anonymous';

    // Remove old barriers for this user, then insert the new set
    await this.barrierRepo.delete({ userId });

    const entities = (dto.barriers ?? []).map((barrier) =>
      this.barrierRepo.create({ userId, barrier }),
    );
    await this.barrierRepo.save(entities);

    return {
      ok: true,
      userId,
      barriers: dto.barriers,
    };
  }

  async getLatestBarriers(userId: string): Promise<string[]> {
    const rows = await this.barrierRepo.find({ where: { userId } });
    return rows.map((r) => r.barrier);
  }
}
