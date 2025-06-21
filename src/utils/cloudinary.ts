import { v2 as cloudinary } from 'cloudinary';
import { BadRequestException } from '@nestjs/common';

// Configure Cloudinary with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadPdfToCloudinary(file: Express.Multer.File): Promise<string> {
  if (!file.mimetype.includes('pdf')) {
    throw new BadRequestException('Only PDF files are allowed');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw', // use 'raw' for non-images like PDFs
        folder: 'resumes',     // optional folder
        public_id: file.originalname.replace(/\.pdf$/, ''), // optional clean public_id
        format: 'pdf',         // force .pdf extension
      },
      (error, result) => {
        if (error) {
          reject(new BadRequestException('Cloudinary upload failed'));
        } else if (!result?.secure_url) {
          reject(new BadRequestException('Cloudinary upload returned no URL'));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
}
