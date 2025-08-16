import { Body, Controller, Post } from '@nestjs/common';

@Controller('keys')
export class KeysController {
	@Post('upload')
	async upload(@Body() dto: { identityKey: string; signedPreKey: { key: string; sig: string }; oneTimePreKeys: string[] }) {
		// TODO: persist public key bundle per device
		return { ok: true };
	}
}