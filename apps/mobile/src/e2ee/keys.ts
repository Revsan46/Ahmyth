import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import { api } from '../api/client';

function b64(bytes: Uint8Array) {
	let binary = '';
	bytes.forEach(b => { binary += String.fromCharCode(b); });
	return typeof btoa !== 'undefined' ? btoa(binary) : Buffer.from(bytes).toString('base64');
}

export async function ensureDeviceKeysUploaded(accessToken: string) {
	const ikPk = await SecureStore.getItemAsync('ik_pk');
	if (!ikPk) {
		const ik = Crypto.getRandomBytes(32);
		const spk = Crypto.getRandomBytes(32);
		await SecureStore.setItemAsync('ik_pk', b64(ik));
		await SecureStore.setItemAsync('ik_sk', b64(Crypto.getRandomBytes(64)));
		await SecureStore.setItemAsync('spk_pk', b64(spk));
		await SecureStore.setItemAsync('spk_sk', b64(Crypto.getRandomBytes(64)));
		await api.post('/keys/upload', {
			identityKey: b64(ik),
			signedPreKey: { key: b64(spk), sig: b64(Crypto.getRandomBytes(64)) },
			oneTimePreKeys: []
		}, { headers: { Authorization: `Bearer ${accessToken}` } });
	}
}