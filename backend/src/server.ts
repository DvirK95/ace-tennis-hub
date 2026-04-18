import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { generateOpenApiDocument } from './config/swagger';
import { apiRouter } from './modules';
import { authenticate } from './middleware/authenticate';

const app = express();
const PORT = process.env.PORT || 3009;

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(generateOpenApiDocument()));

app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/auth/')) return next();
  return authenticate(req, res, next);
}, apiRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
