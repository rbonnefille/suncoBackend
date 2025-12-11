import * as dotenv from 'dotenv';
dotenv.config();
import pkg from 'jsonwebtoken';
const { sign } = pkg;

const { KEY_ID: keyUsername, SECRET_KEY: keyPassword } = process.env;

export default class Jwt {
  constructor(external_id, name, email, emailVerified) {
    this.external_id = external_id;
    this.name = name;
    this.email = email;
    this.email_verified = emailVerified;
    this.expiry_time_in_seconds = 604800; // 7 days in seconds
    this.defaultExpiry = 604800; // 7 days in seconds
    this.nowInSeconds = Math.floor(Date.now() / 1000);
    this.expiry =
      parseInt(this.expiry_time_in_seconds, 10) || this.defaultExpiry;
    this.body = Object.assign({
      scope: 'user',
      external_id: this.external_id,
      ...(this.name && { name: this.name }),
      ...(this.email && { email: this.email }),
      ...(this.email_verified && { email_verified: this.email_verified }),
      iat: this.nowInSeconds,
      exp: this.nowInSeconds + this.expiry,
    });
  }
  signJwt() {
    return sign(this.body, keyPassword, {
      header: {
        alg: 'HS256',
        typ: 'JWT',
        kid: keyUsername,
      },
    });
  }
}
