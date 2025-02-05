import express from 'express';
import { PrismaClient } from '@prisma/client';

export const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());

export const server = app.listen(port);

export function stopServer() {
  server.close();
}

// Accueil
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue 👋' });
});

// Listes des pokémons
app.get('/pokemons-cards', async (req, res) => {
  try {
    const pokemonCards = await prisma.pokemonCard.findMany();
    res.json(pokemonCards);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
});

// Pokémon spécifique
app.get('/pokemons-cards', async (req, res) => {
  try {
    const pokemonCards = await prisma.pokemonCard.findMany();
    res.json(pokemonCards);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
});
