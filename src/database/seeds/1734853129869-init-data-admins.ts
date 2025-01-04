import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { Seeder } from 'typeorm-extension';
import { Admin } from '../../admins/admins/entities/admin.entity';
import * as argon2 from 'argon2';

dotenvConfig({ path: '.env' });

export class InitDataAdmins1734853129869 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const adminRepository = dataSource.getRepository(Admin);
    await adminRepository.save({
      mail_address: 'duy.nguyenanh01@gmail.com',
      password: await argon2.hash('12345678'),
      role: 1,
    });
  }
}
