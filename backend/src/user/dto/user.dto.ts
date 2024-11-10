import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() email: string;
  // @IsNotEmpty() username: string;
  @IsNotEmpty() name: string;
  // @IsNotEmpty() phone: string;
  // @IsNotEmpty() salary: string;
  // @IsNotEmpty() gender: string;
  // @IsNotEmpty() bithdate: string;
  // @IsNotEmpty() stk: string;
  // @IsNotEmpty() address: string;
  // @IsNotEmpty() position: string;
  // @IsNotEmpty() avt: string;
  @IsNotEmpty() password: string;
}

export class LoginUserDto {
  @IsNotEmpty() email: string;
  @IsNotEmpty() password: string;
}
