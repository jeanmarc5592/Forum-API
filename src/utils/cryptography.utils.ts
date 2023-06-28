import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class CryptographyUtils {
  private SALT_LENGTH = 10;

  async hash(data: any) {
    return argon2.hash(data, { saltLength: this.SALT_LENGTH });
  }

  async verify(hash: string, data: any) {
    return argon2.verify(hash, data);
  }
}
