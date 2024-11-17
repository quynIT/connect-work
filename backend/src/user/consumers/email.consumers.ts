import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('send-mail')
export class EmailConsumer {
  constructor(private mailerService: MailerService) {}
  @Process('register')
  async registerEmail(job: Job<unknown>) {
    console.log(job.data);
  }
}
