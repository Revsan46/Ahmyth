import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly auth: AuthService) {}

	@Post('request-otp')
	async requestOtp(@Body() dto: { identifier: string }) {
		await this.auth.requestOtp(dto.identifier);
		return { ok: true };
	}

	@Post('verify-otp')
	async verifyOtp(@Body() dto: { identifier: string; otp: string }) {
		const { accessToken, refreshToken, deviceId } = await this.auth.verifyOtp(dto.identifier, dto.otp);
		return { accessToken, refreshToken, deviceId };
	}

	@Post('link-device')
	async linkDeviceInit(@Body() dto: { currentDeviceId: string }) {
		return this.auth.linkDeviceInit(dto.currentDeviceId);
	}

	@Post('link-device/confirm')
	async linkDeviceConfirm(@Body() dto: { token: string }) {
		const { accessToken, refreshToken, deviceId } = await this.auth.linkDeviceConfirm(dto.token);
		return { accessToken, refreshToken, deviceId };
	}
}