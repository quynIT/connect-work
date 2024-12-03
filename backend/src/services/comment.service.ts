import { Injectable } from '@nestjs/common';
import { CommentRepository } from './repositories/comment.repository'; // Import CommentRepository
import { CreateCommentDto } from '../services/dto/comment.dto'; // Dữ liệu tạo comment
import { Comment } from '../models/comment.model'; // Định nghĩa loại Comment

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository, // Inject CommentRepository
  ) {}

  // Tạo comment mới
  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    try {
      const comment = await this.commentRepository.create(createCommentDto); // Sử dụng phương thức create của repository
      return comment; // Trả về một đối tượng comment duy nhất
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new Error('Failed to create comment');
    }
  }

  // Lấy một comment theo ID
  async getCommentById(commentId: string): Promise<Comment> {
    try {
      const comment = await this.commentRepository.findById(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }
      return comment; // Trả về đối tượng comment duy nhất
    } catch (error) {
      console.error('Error fetching comment by ID:', error);
      throw new Error('Failed to fetch comment by ID');
    }
  }

  // Xóa comment theo ID
  async deleteComment(commentId: string): Promise<any> {
    try {
      const result = await this.commentRepository.deleteOne(commentId);
      if (!result) {
        throw new Error('Comment not found');
      }
      return result; // Trả về kết quả xóa
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new Error('Failed to delete comment');
    }
  }
  // Lấy tất cả comment theo IDTask
  async getCommentsByTask(taskId: string): Promise<Comment[]> {
    try {
      const comments = await this.commentRepository.findByConditionAll({
        taskId,
      });
      return comments; // Trả về danh sách các comment
    } catch (error) {
      console.error('Error fetching comments for task:', error);
      throw new Error('Failed to fetch comments for task');
    }
  }
}
