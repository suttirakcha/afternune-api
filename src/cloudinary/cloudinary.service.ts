import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { CloudinaryResponse } from './cloudinary-response';
import 'multer';

@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    folder: string = 'static',
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: process.env.UPLOAD_PRESET,
          folder,
        },
        (error, result) => {
          if (error) {
            return reject(
              new Error(error.message || 'Failed to upload the image'),
            );
          }

          if (!result) {
            return reject(new Error('Failed to upload the image'));
          }

          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
