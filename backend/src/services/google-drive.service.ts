import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { Readable } from 'stream';

@Injectable()
export class GoogleDriveService {
  private driveClient;
  private readonly logger = new Logger(GoogleDriveService.name);

  constructor() {
    try {
      // Xử lý private key đặc biệt
      let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';

      // Thêm các bước xử lý private key
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----\n`;
      }

      this.logger.debug('Client Email:', process.env.GOOGLE_CLIENT_EMAIL);

      if (!process.env.GOOGLE_CLIENT_EMAIL || !privateKey) {
        throw new Error('Missing Google Drive credentials');
      }

      this.driveClient = google.drive({
        version: 'v3',
        auth: new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: privateKey,
          },
          scopes: ['https://www.googleapis.com/auth/drive.file'],
        }),
      });
    } catch (error) {
      this.logger.error('Failed to initialize Google Drive service:', error);
      throw error;
    }
  }

  async uploadFile(file: Express.Multer.File) {
    // Kiểm tra file tồn tại
    if (!file || !file.buffer) {
      this.logger.error('Invalid file provided');
      throw new Error('Invalid file provided');
    }

    try {
      const fileStream = new Readable();
      fileStream.push(file.buffer);
      fileStream.push(null);

      this.logger.log(`Uploading file: ${file.originalname}`);

      const response = await this.driveClient.files.create({
        requestBody: {
          name: file.originalname,
          mimeType: file.mimetype,
        },
        media: {
          mimeType: file.mimetype,
          body: fileStream,
        },
      });

      this.logger.log(`File uploaded with ID: ${response.data.id}`);

      await this.driveClient.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      const fileData = await this.driveClient.files.get({
        fileId: response.data.id,
        fields: 'webViewLink, webContentLink',
      });

      return {
        fileId: response.data.id,
        webViewLink: fileData.data.webViewLink,
        downloadLink: fileData.data.webContentLink,
      };
    } catch (error) {
      this.logger.error('Upload failed:', error);
      throw new Error(
        `Failed to upload file to Google Drive: ${error.message}`,
      );
    }
  }
  async deleteFile(fileId: string) {
    if (!fileId) {
      this.logger.error('Invalid file ID provided');
      throw new Error('Invalid file ID provided');
    }

    try {
      this.logger.log(`Attempting to delete file with ID: ${fileId}`);

      await this.driveClient.files.delete({
        fileId: fileId,
      });

      this.logger.log(`Successfully deleted file with ID: ${fileId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete file with ID ${fileId}:`, error);
      throw new Error(
        `Failed to delete file from Google Drive: ${error.message}`,
      );
    }
  }
}
