import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSectorSelectionDto } from './dto/create-sector-selection.dto';
import { SectorSelectionEntity } from './entities/sector-selection.entity';

@Injectable()
export class SectorsService {
  constructor(
    @InjectRepository(SectorSelectionEntity)
    private readonly sectorRepo: Repository<SectorSelectionEntity>,
  ) {}

  getOptions() {
    return [
      { key: 'innovation', label: 'الابتكار والتكنولوجيا', icon: '💡' },
      { key: 'sales', label: 'المبيعات والتجارة', icon: '🛒' },
      { key: 'marketing', label: 'التسويق والإعلان', icon: '📢' },
      { key: 'manual_services', label: 'الخدمات اليدوية والحرفية', icon: '🔧' },
      { key: 'management', label: 'الإدارة والتنظيم', icon: '📊' },
      { key: 'people', label: 'العمل مع الناس', icon: '🤝' },
    ];
  }

  async create(dto: CreateSectorSelectionDto) {
    const userId = dto.userId ?? 'anonymous';
    await this.sectorRepo.delete({ userId });

    const entity = this.sectorRepo.create({ userId, sectors: dto.sectors });
    await this.sectorRepo.save(entity);

    return { ok: true, userId, sectors: dto.sectors };
  }

  async getByUser(userId: string) {
    const row = await this.sectorRepo.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return row ? row.sectors : [];
  }
}
