import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import pokemonRouter from './routes/pokemons.route';
import userRouter from './routes/users.route';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

export const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Accueil
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Bienvenue 👋' });
});

app.use('/pokemons-cards', pokemonRouter);
app.use('/users', userRouter);

// Démarrer le serveur EN DERNIER
export const server = app.listen(port);

export function stopServer() {
  server.close();
}