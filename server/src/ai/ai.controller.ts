import { Body, Controller, Post } from '@nestjs/common';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

@Controller('ai')
export class AiController {
	@Post('translate')
	async translate(@Body() dto: { text: string; to: string; provider?: string }) {
		const cacheKey = `ai:translate:${dto.to}:${dto.text}`;
		const cached = await redis.get(cacheKey);
		if (cached) return JSON.parse(cached);
		const translated = `[${dto.to}] ${dto.text}`;
		await redis.set(cacheKey, JSON.stringify({ translated }), 'EX', 3600);
		return { translated };
	}

	@Post('llm')
	async llm(@Body() dto: { prompt: string; provider?: string }) {
		const key = `ai:llm:${dto.provider ?? 'default'}:${dto.prompt}`;
		const c = await redis.get(key);
		if (c) return JSON.parse(c);
		const completion = `Assistant: ...`;
		await redis.set(key, JSON.stringify({ completion }), 'EX', 600);
		return { completion };
	}
}