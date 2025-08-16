import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

const otpMap = new Map<string, string>();

@Injectable()
export class AuthService {
	async requestOtp(identifier: string) {
		const code = (Math.floor(100000 + Math.random() * 900000)).toString();
		otpMap.set(identifier, code);
		// TODO: send via email/sms provider
		console.log('OTP for', identifier, code);
	}

	async verifyOtp(identifier: string, otp: string) {
		const expected = otpMap.get(identifier);
		if (!expected || expected !== otp) throw new Error('Invalid OTP');
		otpMap.delete(identifier);
		const deviceId = randomBytes(8).toString('hex');
		const accessToken = randomBytes(16).toString('hex');
		const refreshToken = randomBytes(16).toString('hex');
		return { accessToken, refreshToken, deviceId };
	}

	async linkDeviceInit(currentDeviceId: string) {
		const token = randomBytes(16).toString('hex');
		return { token, qr: `rtchat://link?token=${token}` };
	}

	async linkDeviceConfirm(token: string) {
		const deviceId = randomBytes(8).toString('hex');
		const accessToken = randomBytes(16).toString('hex');
		const refreshToken = randomBytes(16).toString('hex');
		return { accessToken, refreshToken, deviceId };
	}
}