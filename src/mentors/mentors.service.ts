import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConnectMentorDto } from './dto/connect-mentor.dto';
import { MentorEntity } from './entities/mentor.entity';
import { MentorConnectionEntity } from './entities/mentor-connection.entity';

@Injectable()
export class MentorsService implements OnModuleInit {
  constructor(
    @InjectRepository(MentorEntity)
    private readonly mentorRepo: Repository<MentorEntity>,
    @InjectRepository(MentorConnectionEntity)
    private readonly connectionRepo: Repository<MentorConnectionEntity>,
  ) {}

  /** Seed default mentors if the table is empty. */
  async onModuleInit() {
    const count = await this.mentorRepo.count();
    if (count === 0) {
      await this.mentorRepo.save([
        { name: 'Salma A.', expertise: 'Entrepreneurship' },
        { name: 'Youssef B.', expertise: 'Digital Careers' },
      ]);
    }
  }

  async findAll() {
    return this.mentorRepo.find();
  }

  async connect(dto: ConnectMentorDto) {
    const connection = this.connectionRepo.create({
      userId: dto.userId,
      mentorId: dto.mentorId,
    });
    await this.connectionRepo.save(connection);

    return { ok: true, connection };
  }
}
