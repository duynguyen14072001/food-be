import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserDto } from './dto/user.dto';
import { ResponseList } from './dto/user.res';
import { IMAGE_URL_USER_DEFAULT } from 'src/constants';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

    if (search) {
      options.where = [
        { name: Like(`%${search}%`) },
        { mail_address: Like(`%${search}%`) },
      ];
    }

    if (!all && page && per_page) {
      options['skip'] = (page - 1) * per_page;
      options['take'] = per_page;
    }
    return options;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const dataCreate = {
        ...createUserDto,
        password: await argon2.hash(createUserDto.password),
        image_url: IMAGE_URL_USER_DEFAULT,
      };
      const user = await this.findOneByEmail(createUserDto.mail_address);
      if (user) {
        throw new UnprocessableEntityException('Email exits');
      }
      const createData = this.userRepository.create(dataCreate);
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

  async updateData(id: number, dataUpdate: any) {
    try {
      const { mail_address, ...updateData } = dataUpdate;
      const data = await this.userRepository.findOne({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException(`Could not find Account with id: ${id}`);
      }

      return await await this.userRepository.update(id, updateData);
    } catch (error) {
      throw new Error(error.message);
    }
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
