import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../services/dto/comment.dto'; // Dữ liệu để tạo comment
import { Comment } from '../models/comment.model'; // Mô hình Comment

@Controller('comments') // Định nghĩa controller cho các route bắt đầu với '/comments'
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Tạo comment mới
  @Post('/create')
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    return this.commentService.createComment(createCommentDto); // Gọi service để tạo comment
  }

  // Lấy chi tiết comment theo ID
  @Get(':id')
  async getCommentById(@Param('id') id: string): Promise<Comment> {
    return this.commentService.getCommentById(id); // Gọi service để lấy comment theo ID
  }

  // Xóa comment theo ID
  @Delete('/delete/:id')
  async deleteComment(@Param('id') commentId: string): Promise<any> {
    return this.commentService.deleteComment(commentId); // Gọi service để xóa comment
  }

  @Get('/task/:taskId') // Định nghĩa đường dẫn với taskId
  async getCommentsByTask(@Param('taskId') taskId: string): Promise<Comment[]> {
    // Gọi service để lấy tất cả comment của task
    return this.commentService.getCommentsByTask(taskId);
  }
}
