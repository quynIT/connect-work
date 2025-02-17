import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsEnum(['internal', 'urgent', 'event', 'policy'])
  type: 'internal' | 'urgent' | 'event' | 'policy';

  @IsNotEmpty()
  @IsEnum(['low', 'high'])
  priority: 'low' | 'high';

  @IsOptional()
  @IsEnum(['open', 'closed'])
  status?: 'open' | 'closed';

  @IsOptional()
  is_pinned?: string;

  @IsOptional()
  attachments?: string[];
}

export class UpdateNotificationDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  @IsEnum(['internal', 'urgent', 'event', 'policy'])
  type?: 'internal' | 'urgent' | 'event' | 'policy';

  @IsOptional()
  @IsEnum(['low', 'high'])
  priority?: 'low' | 'high';

  @IsOptional()
  @IsEnum(['open', 'closed'])
  status?: 'open' | 'closed';

  @IsOptional()
  is_pinned?: string;

  @IsOptional()
  attachments?: string[];
}
