import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

interface SendMailProps {
  to: string;
  subject: string;
  content: string;
}

@Injectable()
export class NodemailerService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail({ to, subject, content }: SendMailProps) {
    await this.mailerService.sendMail({
      from: '',
      to,
      subject,
      html: content,
    });
  }
}
