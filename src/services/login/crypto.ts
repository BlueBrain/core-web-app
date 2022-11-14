import * as CryptoJS from 'crypto-js';

const CODE_VERIFIER_LENGTH = 128;
const CODE_VERIFIER_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function createCodeVerifier(): string {
  const chars: string[] = [];
  for (let i = 0; i < CODE_VERIFIER_LENGTH; i += 1) {
    chars.push(
      CODE_VERIFIER_CHARACTERS.charAt(Math.round(Math.random() * CODE_VERIFIER_CHARACTERS.length))
    );
  }
  return chars.join('');
}

function base64URL(value: CryptoJS.lib.WordArray): string {
  return value
    .toString(CryptoJS.enc.Base64)
    .replace(/[=]/gu, '')
    .replace(/\+/gu, '-')
    .replace(/\//gu, '_');
}

export function getCodeChallenge(codeVerifier: string) {
  return base64URL(CryptoJS.SHA256(codeVerifier));
}
