import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

const SALT_BYTES = 16;
const KEY_LEN = 64;

export class PasswordHasher {
  hash(plain: string): string {
    const salt = randomBytes(SALT_BYTES).toString('hex');
    const derived = scryptSync(plain, salt, KEY_LEN).toString('hex');
    return `${salt}:${derived}`;
  }

  verify(plain: string, stored: string): boolean {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const derived = scryptSync(plain, salt, KEY_LEN).toString('hex');
    try {
      return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
    } catch {
      return false;
    }
  }
}
