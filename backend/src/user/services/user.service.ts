import { User } from './../models/user.model';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private mailerService: MailerService,
  ) {}

  async create(userDto: CreateUserDto) {
    const rawPassword = userDto.password;
    userDto.password = await bcrypt.hash(userDto.password, 10);

    // check exists
    const userInDb = await this.userRepository.findByCondition({
      email: userDto.email,
    });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    // await this.sendMail.add(
    //   'register',
    //   {
    //     to: userDto.email,
    //     name: userDto.name,
    //   },
    //   {
    //     removeOnComplete: true,
    //   },
    // );
    await this.sendEmail(userDto.email, 'Welcome to my website', 'welcome', {
      name: userDto.name,
      phone: userDto.phone,
      password: rawPassword,
      username: userDto.username,
      salary: userDto.salary,
      gender: userDto.gender,
      address: userDto.address,
      stk: userDto.stk,
      position: userDto.position,
      bithdate: userDto.bithdate,
    });

    return await this.userRepository.create(userDto);
  }
  async readTemplate(
    templateName: string,
    variables: Record<string, string>,
  ): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      'src/templates/email',
      `${templateName}.html`,
    );

    // Đọc file template và trả về nội dung của nó như một chuỗi
    let template = await fs.readFile(templatePath, 'utf-8');

    // Thay thế các placeholder bằng các giá trị thực tế
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, value);
    }

    return template;
  }

  // Gửi email
  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, string> = {},
  ) {
    const emailContent = await this.readTemplate(templateName, variables);

    await this.mailerService.sendMail({
      to,
      from: '"Connect Work" <trungquyen2902@gmail.com>',
      subject,
      html: emailContent,
    });
  }
  //   async setTwoFactorAuthenticationSecret(secret, user_id) {
  //     return this.userRepository.findByIdAndUpdate(user_id, {
  //       twoFactorAuthenticationSecret: secret,
  //     });
  //   }

  //   async turnOnTwoFactorAuthentication(user_id: string) {
  //     return this.userRepository.findByIdAndUpdate(user_id, {
  //       isTwoFactorAuthenticationEnabled: true,
  //     });
  //   }

  async findByLogin({ email, password }: LoginUserDto) {
    const user = await this.userRepository.findByCondition({
      email: email,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const is_equal = bcrypt.compareSync(password, user.password);

    if (!is_equal) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByCondition({ email: email });
  }
  async update(filter, update) {
    if (update.refreshToken) {
      update.refreshToken = await bcrypt.hash(
        this.reverse(update.refreshToken),
        10,
      );
    }
    return await this.userRepository.findByConditionAndUpdate(filter, update);
  }

  async getUserByRefresh(refresh_token, email) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const is_equal = await bcrypt.compare(
      this.reverse(refresh_token),
      user.refreshToken,
    );

    if (!is_equal) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  private reverse(s) {
    return s.split('').reverse().join('');
  }
  async getAllUsers() {
    return await this.userRepository.findAll();
  }
  async updateUserById(
    id: string,
    updateData: Partial<User>,
  ): Promise<User | null> {
    return await this.userRepository.findByIdAndUpdate(id, updateData);
  }
  async deleteUserById(id: string): Promise<any> {
    return await this.userRepository.deleteOne(id);
  }
  async changeUserPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<any> {
    // Tìm người dùng theo ID
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new HttpException(
        'Old password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Mã hóa và cập nhật mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.userRepository.findByIdAndUpdate(id, {
      password: hashedPassword,
    });
  }
}
