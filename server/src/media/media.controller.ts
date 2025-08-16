import { Controller, Post, Body } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Controller('media')
export class MediaController {
	private s3 = new S3Client({ region: process.env.AWS_REGION, endpoint: process.env.S3_ENDPOINT, forcePathStyle: true });
	@Post('sign')
	async sign(@Body() dto: { contentType: string; keyHint?: string }) {
		const key = dto.keyHint ?? `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}`;
		const url = await getSignedUrl(this.s3, new PutObjectCommand({
			Bucket: process.env.S3_BUCKET!, Key: key, ContentType: dto.contentType
		}), { expiresIn: 60 });
		return { key, url };
	}
}