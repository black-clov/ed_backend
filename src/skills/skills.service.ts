import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SetUserSkillsDto } from './dto/set-user-skills.dto';
import { SkillEntity } from './entities/skill.entity';

@Injectable()
export class SkillsService {
  private readonly catalog = [
    'communication',
    'digital skills',
    'manual skills',
    'teamwork',
    'creativity',
    'negotiation',
  ];

  constructor(
    @InjectRepository(SkillEntity)
    private readonly skillRepo: Repository<SkillEntity>,
  ) {}

  getSkills() {
    return { skills: this.catalog };
  }

  async setUserSkills(dto: SetUserSkillsDto) {
    const userId = dto.userId ?? 'anonymous';
    const normalized = (dto.skills ?? []).filter((skill) => this.catalog.includes(skill));

    // Remove old skills for this user, then insert the new set
    await this.skillRepo.delete({ userId });

    const entities = normalized.map((name) => this.skillRepo.create({ userId, name }));
    await this.skillRepo.save(entities);

    return {
      ok: true,
      userId,
      skills: normalized,
    };
  }

  async getUserSkills(userId: string): Promise<string[]> {
    const rows = await this.skillRepo.find({ where: { userId } });
    return rows.map((r) => r.name);
  }
}
