import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ResponseList } from './dto/admin.res';
import { AdminDto } from './dto/admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminRole, randomStr } from './admins.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';
import * as argon2 from 'argon2';
import { MailService } from '../../mailers/mailers.service';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
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
    };
    if (search) {
      options['where'] = {
        name: search,
      };
    }
    if (!all && page && per_page) {
      options['skip'] = (page - 1) * per_page;
      options['take'] = per_page;
    }
    return options;
  }

  async findAll(query: any): Promise<ResponseList> {
    try {
      const { page, per_page: perPage } = query;
      const options = await this.mapOptions(query);
      const total = await this.adminRepository.count(options);
      const data = await this.adminRepository.find(options);

      const result = await this.classMapper.mapArrayAsync(
        data,
        Admin,
        AdminDto,
      );
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

  async findOneByEmail(email: string): Promise<Admin> {
    return await this.adminRepository.findOneBy({ mail_address: email });
  }

  async findOneByID(id: number): Promise<AdminDto> {
    const data = await this.adminRepository.findOneBy({ id });
    if (!data) {
      throw new NotFoundException(`Could not find User with id: ${id}`);
    }
    return await this.classMapper.mapAsync(data, Admin, AdminDto);
  }

  async create(createAdminDto: CreateAdminDto, req: any): Promise<AdminDto> {
    try {
      if (req.user.id != AdminRole.ADMIN) {
        throw new ForbiddenException('No permission');
      }
      const pass = randomStr(10);
      const password = await argon2.hash(pass);

      const admin = await this.findOneByEmail(createAdminDto.mail_address);
      if (admin) {
        throw new UnprocessableEntityException('Email exits');
      }

      const createData = this.adminRepository.create({
        ...createAdminDto,
        password,
      });
      const data = await this.adminRepository.save(createData);

      if (data) {
        await this.mailService.sendMail({
          mail_to: createAdminDto.mail_address,
          subject: 'Welcome to Food TLU',
          template: `admin/mail-invite-admin.pug`,
          context: {
            pass,
          },
        });
      }
      return await this.classMapper.mapAsync(data, Admin, AdminDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateRole(
    id: number,
    updateAdminRoleDto: UpdateAdminRoleDto,
    req: any,
  ): Promise<any> {
    try {
      if (req.user.id != AdminRole.ADMIN) {
        throw new ForbiddenException('No permission');
      }
      const newData = await this.adminRepository.create({
        ...updateAdminRoleDto,
      });
      const data = await this.adminRepository.update({ id }, newData);

      if (!data) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(ids: number[] | number, req: any) {
    try {
      if (req.user.id != AdminRole.ADMIN) {
        throw new ForbiddenException('No permission');
      }
      return await this.adminRepository.softDelete(ids);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updatePassword(id: number, password: string) {
    try {
      const data = await this.adminRepository.findOne({
        where: { id },
      });
      if (!data) {
        throw new NotFoundException(`Could not find Account with id: ${id}`);
      }
      const newData = await this.adminRepository.save({
        ...data,
        password,
      });
      return await this.classMapper.mapAsync(newData, Admin, AdminDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
