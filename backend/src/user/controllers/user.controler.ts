import {
  Controller,
  Put,
  Body,
  Param,
  Get,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard())
  //   @UseGuards(AuthGuard('jwt-two-factor'))
  @Get('profile')
  async getProfile(@Req() req: any) {
    return req.user;
  }
  // Get user by id
  @UseGuards(AuthGuard()) // Admin
  @Get('list')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
  // Update user
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    return await this.userService.updateUserById(id, updateData);
  }
  // Delete user
  @Delete(':id') // Admin
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUserById(id);
  }
  // Change password
  @Put(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    const { oldPassword, newPassword } = body;
    return await this.userService.changeUserPassword(
      id,
      oldPassword,
      newPassword,
    );
  }
}
