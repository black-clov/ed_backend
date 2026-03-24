import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProgramEntity } from './entities/program.entity';

@Injectable()
export class ProgramsService implements OnModuleInit {
  constructor(
    @InjectRepository(ProgramEntity)
    private readonly programRepo: Repository<ProgramEntity>,
  ) {}

  /** Seed default programs if the table is empty. */
  async onModuleInit() {
    const count = await this.programRepo.count();
    if (count === 0) {
      await this.programRepo.save([
        { name: 'Startup Launch Incubator', category: 'incubator' },
        { name: 'Youth Skills Association', category: 'association' },
        { name: 'Career Readiness Program', category: 'training program' },
        { name: 'Early Venture Grant', category: 'funding program' },
      ]);
    }
  }

  async findAll() {
    return this.programRepo.find();
  }
}
