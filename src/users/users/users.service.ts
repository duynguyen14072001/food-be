import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../../mailers/mailers.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserDto } from './dto/user.dto';
import { ResponseList } from './dto/user.res';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async mapOptions(query: any) {
    const { search, page, per_page, orders, all } = query;
    const orderMap = orders?.reduce(function (result, item) {
      result[item['key']] = item['dir'];
      return result;
    }, {});

    const options = {
      order: orderMap,
      where: {},
    };
    if (!all && page && per_page) {
      options['skip'] = (page - 1) * per_page;
      options['take'] = per_page;
    }
    return options;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const createData = this.userRepository.create(createUserDto);
      const data = await this.userRepository.save(createData);

      return await this.classMapper.mapAsync(data, User, UserDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findAll(query: any): Promise<ResponseList> {
    try {
      const { page, per_page: perPage } = query;
      const options = await this.mapOptions(query);
      const total = await this.userRepository.count(options);
      const data = await this.userRepository.find(options);

      const result = await this.classMapper.mapArrayAsync(data, User, UserDto);
      return {
        data: result,
        page,
        perPage,
        total,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ mail_address: email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
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
