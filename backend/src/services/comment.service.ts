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
  async createComment(comment: CreateCommentDto) {
    const newComment = await this.commentRepository.create(
      comment as unknown as Partial<Comment>,
    );
    return newComment;
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
    const comments = await this.commentRepository.findByConditionAll(
      { taskId },
      null, // Trả về tất cả các trường
      null, // Không có tùy chọn nào cho query
      {
        path: 'user', // Populating thông tin người dùng
        select: 'name avt', // Chỉ lấy các trường 'name' và 'avt' từ user
      },
    );
    return comments;
  }
}
