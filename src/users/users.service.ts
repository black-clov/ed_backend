
import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    async findByEmail(email: string) {
      return this.usersRepo.findOne({ where: { email } });
    }
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({
      email: dto.email,
      firstName: dto.first_name ?? '',
      lastName: dto.last_name ?? '',
      age: dto.age ?? null,
      ville: dto.ville ?? null,
      niveauScolaire: dto.niveau_scolaire ?? null,
      telephone: dto.telephone ?? null,
      passwordHash,
    });
    try {
      const saved = await this.usersRepo.save(user);
      // Never return passwordHash
      const { passwordHash: _, ...result } = saved;
      return result;
    } catch (err: any) {
      console.error('Error in UsersService.create:', err);
      if (err.code === '23505') {
        // Unique violation (duplicate email)
        throw new ConflictException('Email already registered');
      }
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async findAll() {
    const users = await this.usersRepo.find({ select: ['id', 'email', 'firstName', 'lastName', 'age', 'ville', 'niveauScolaire', 'telephone', 'role'] });
    return users.map(u => ({
      id: u.id,
      email: u.email,
      first_name: u.firstName,
      last_name: u.lastName,
      age: u.age,
      ville: u.ville,
      niveau_scolaire: u.niveauScolaire,
      telephone: u.telephone,
      role: u.role,
    }));
  }

  async findOne(id: string) {
    const u = await this.usersRepo.findOne({ where: { id }, select: ['id', 'email', 'firstName', 'lastName', 'age', 'ville', 'niveauScolaire', 'telephone', 'role'] });
    if (!u) return null;
    return {
      id: u.id,
      email: u.email,
      first_name: u.firstName,
      last_name: u.lastName,
      age: u.age,
      ville: u.ville,
      niveau_scolaire: u.niveauScolaire,
      telephone: u.telephone,
      role: u.role,
    };
  }

  getProfile(id: string) {
    return this.findOne(id);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (dto.first_name !== undefined) user.firstName = dto.first_name;
    if (dto.last_name !== undefined) user.lastName = dto.last_name;
    if (dto.age !== undefined) user.age = dto.age;
    if (dto.ville !== undefined) user.ville = dto.ville;
    if (dto.niveau_scolaire !== undefined) user.niveauScolaire = dto.niveau_scolaire;
    if (dto.telephone !== undefined) user.telephone = dto.telephone;
    if (dto.email !== undefined) user.email = dto.email;

    try {
      const saved = await this.usersRepo.save(user);
      const { passwordHash: _, resetToken: _rt, resetTokenExpires: _rte, ...result } = saved;
      return result;
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException('Could not update user');
    }
  }

  async setResetToken(email: string, token: string, expires: Date) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) return null;
    user.resetToken = token;
    user.resetTokenExpires = expires;
    await this.usersRepo.save(user);
    return { ok: true };
  }

  async findByResetToken(token: string) {
    const user = await this.usersRepo.findOne({ where: { resetToken: token } });
    if (!user) return null;
    if (user.resetTokenExpires && user.resetTokenExpires < new Date()) return null;
    return user;
  }

  async updatePassword(userId: string, newPasswordHash: string) {
    await this.usersRepo.update(userId, {
      passwordHash: newPasswordHash,
      resetToken: null,
      resetTokenExpires: null,
    });
  }

  async validatePassword(userId: string, password: string): Promise<boolean> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) return false;
    return bcrypt.compare(password, user.passwordHash);
  }

  async updateRole(id: string, role: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.role = role;
    await this.usersRepo.save(user);
    return { ok: true, role };
  }

  async countUsers() {
    return this.usersRepo.count();
  }
}
