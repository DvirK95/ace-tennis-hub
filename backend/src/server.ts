import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { generateOpenApiDocument } from './config/swagger';
import { apiRouter } from './modules';
import { authenticate } from './middleware/authenticate';

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());

const openApiDocument = generateOpenApiDocument();

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get('/api-json', (_req, res) => res.json(openApiDocument));

app.use(
  '/api',
  (req, res, next) => {
    if (req.path.toLowerCase().startsWith('/auth/login')) return next();
    return authenticate(req, res, next);
  },
  apiRouter,
);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
