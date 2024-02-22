import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import returnToken from "./utils/auth.js";
import conversationRouter from "./routes/conversations.js";
import userRouter from "./routes/users.js";
import integrationRouter from "./routes/integrations.js";
import loggerMiddleware from "./utils/logger.js";

import * as helmet from "helmet";
import cors from "cors";

const app = express();
app.use(loggerMiddleware);
app.use(cors());
app.use(helmet.hidePoweredBy());
app.use(helmet.xssFilter());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/conversations", conversationRouter);
app.use("/integrations", integrationRouter);
app.use("/users", userRouter);
app.post("/auth", returnToken);

app.listen(process.env.PORT ?? 3000, () =>
  console.log(`Server is running on port ${process.env.PORT ?? 3000}`),
);
