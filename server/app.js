import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import * as helmet from 'helmet';
import cors from 'cors';
import routes from './routes/index.js';
import loggerMiddleware from './utils/logger.js';

const { PORT: port } = process.env;
const defaultPort = 3000;

const app = express();
app.use(loggerMiddleware);
app.use(cors());
app.use(helmet.hidePoweredBy());
app.use(helmet.xssFilter());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

app.listen(port ?? defaultPort, () =>
  console.log(`Server is running on port ${port ?? defaultPort}`)
);
