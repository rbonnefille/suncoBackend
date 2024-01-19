const checkOrigin = (req, res, next) => {
  const { referer, host } = req.headers || {};
  const allowedOrigins = ["localhost:5173", "localhost:3000", "127.0.0.1"];
  if (!allowedOrigins.some((origin) => host.startsWith(origin))) {
    console.log(`Request received from ${host}`);
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

export default checkOrigin;
