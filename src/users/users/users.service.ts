import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from 'src/mailers/mailers.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ mail_address: email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async updatePassword(id: number, password: string) {
    try {
      const data = await this.userRepository.findOne({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException(`Could not find Account with id: ${id}`);
      }
      const newData = await this.userRepository.save({
        ...data,
        password,
      });
      return await this.classMapper.mapAsync(newData, User, UserDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneByID(id: number): Promise<UserDto> {
    const data = await this.userRepository.findOneBy({ id });
    if (!data) {
      throw new NotFoundException(`Could not find User with id: ${id}`);
    }
    return await this.classMapper.mapAsync(data, User, UserDto);
  }
}
