import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { generateOpenApiDocument } from './config/swagger';
import { apiRouter } from './modules';

const app = express();
const PORT = process.env.PORT || 3009;

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(generateOpenApiDocument()));

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
