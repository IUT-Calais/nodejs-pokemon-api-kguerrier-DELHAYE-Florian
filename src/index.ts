import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import pokemonRouter from './routes/pokemons.route';
import userRouter from './routes/users.route';

export const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export const server = app.listen(port);

export function stopServer() {
  server.close();
}

// Accueil
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Bienvenue 👋' });
});

// Utilisation des routeurs
app.use('/pokemons-cards', pokemonRouter);
app.use('/users', userRouter);