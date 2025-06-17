// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host:process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT), 
      secure: false,
      auth: {
        user: process.env.SMTP_USER ,
        pass: process.env.SMTP_PASS, 
      },
    });
  }

  async sendOtpEmail(to: string, otp: string) {
    const info = await this.transporter.sendMail({
      from: `MTOS Sports Fantasy ${process.env.SMTP_USER}`,
      to,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    });

    console.log('Message sent: %s', info.messageId);
  }
}
