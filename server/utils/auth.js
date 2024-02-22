import Jwt from "../models/Jwt.js";

const returnToken = async (req, res) => {
  const { referer, host } = req.headers || {};
  const allowedOrigins = [
    "localhost:5173",
    "localhost:3000",
    "127.0.0.1",
    process.env.AUTHORISED_ORIGIN,
    process.env.AUTHORISED_ORIGIN_HC,
  ];
  if (!allowedOrigins.some((origin) => host.startsWith(origin))) {
    console.log(`Request received from ${host}`);
    return res.status(403).json({ error: "Forbidden" });
  }
  if (Object.keys(req.body).length === 0) {
    res.status(400).send("Bad Request - Body needs to be provided");
    return;
  }
  const { external_id, name, email } = req.body;
  const jwt = new Jwt(external_id, name, email);
  const jwtToken = jwt.signJwt();
  const parts = jwtToken.split(".");
  console.log(
    `----------------------------------------Encoded JWT---------------------------------------- \n`,
  );
  console.log(`JWT Token generated: ${jwtToken}`);
  console.log(
    `----------------------------------------Decoded JWT---------------------------------------- \n`,
  );
  console.log(JSON.parse(`${Buffer.from(parts[1], "base64").toString()} \n`));
  res.json({ token: jwtToken });
};

export default returnToken;
