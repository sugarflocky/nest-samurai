import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { UserAccountsConfig } from '../user-accounts.config';

@Injectable()
export class MailService {
  private transport: nodemailer.Transporter;

  constructor(private userAccountsConfig: UserAccountsConfig) {
    this.transport = nodemailer.createTransport({
      service: 'Mail.ru',
      auth: {
        user: 'zippen1337@mail.ru',
        pass: this.userAccountsConfig.getMailPass,
      },
    }) as nodemailer.Transporter;
  }

  sendEmail(recipient: string, subject: string, html: string): void {
    const args = {
      from: 'Samurai <zippen1337@mail.ru>',
      to: recipient,
      subject,
      html,
    };

    this.transport.sendMail(args).catch((err) => {
      console.error('Ошибка при отправке письма:', err);
    });
  }

  sendCode(recipient: string, code: string): void {
    const subject = 'Email confirmation';
    const html = `<a href='https://somesite.com/confirm-email?code=${code}'>Confirm email</a>`;
    this.sendEmail(recipient, subject, html);
  }

  sendRecoveryCode(recipient: string, code: string): void {
    const subject = 'Recovery password';
    const html = `<a href='https://somesite.com/password-recovery?recoveryCode=${code}'>Recovery password</a>`;
    this.sendEmail(recipient, subject, html);
  }
}
