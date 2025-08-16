// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./libsodium-wrappers-sumo.d.ts" />
import sodium from 'libsodium-wrappers-sumo';

export type KeyBundle = {
	identityKey: string;
	signedPreKey: { key: string; sig: string };
	oneTimePreKeys: string[];
};

export async function generateBundle(): Promise<KeyBundle> {
	await sodium.ready;
	const ik = sodium.crypto_sign_keypair();
	const spk = sodium.crypto_box_keypair();
	const sig = sodium.crypto_sign_detached(spk.publicKey, ik.privateKey);
	return {
		identityKey: sodium.to_base64(ik.publicKey),
		signedPreKey: { key: sodium.to_base64(spk.publicKey), sig: sodium.to_base64(sig) },
		oneTimePreKeys: []
	};
}