import * as dotenv from "dotenv";
dotenv.config();
import pkg from "jsonwebtoken";
const { sign } = pkg;

export default class Jwt {
  constructor(external_id, name, email) {
    this.external_id = external_id;
    this.name = name;
    this.email = email;
    this.expiry_time_in_seconds = 86400;
    this.defaultExpiry = 86400;
    this.nowInSeconds = Math.floor(Date.now() / 1000);
    this.expiry =
      parseInt(this.expiry_time_in_seconds, 10) || this.defaultExpiry;
    this.body = Object.assign({
      scope: "user",
      external_id: this.external_id,
      name: this.name,
      email: this.email,
      email_verified: true,
      iat: this.nowInSeconds,
      // exp: this.nowInSeconds + this.expiry,
    });
  }
  signJwt() {
    return sign(this.body, process.env.SECRET_KEY, {
      header: {
        alg: "HS256",
        typ: "JWT",
        kid: process.env.KEY_ID,
      },
    });
  }
}
