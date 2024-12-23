import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import * as pug from 'pug';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(data) {
    try {
      const templatePath = join(__dirname, 'templates', data.template);
      const html = pug.renderFile(templatePath, data.context);
      await this.mailerService.sendMail({
        to: data.mail_to,
        from: process.env.MAIL_FROM,
        subject: data.subject,
        html,
      });
      return {
        success: true,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
