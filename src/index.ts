import express, { Request, Response } from 'express';
import { PrismaClient, PokemonCard } from '@prisma/client';

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

// Listes des pokémons
app.get('/pokemons-cards', async (req: Request, res: Response) => {
  try {
    const pokemonCards: PokemonCard[] = await prisma.pokemonCard.findMany();
    res.json(pokemonCards);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
});

// Pokémon spécifique
app.get('/pokemons-cards/:id', async (req: Request, res: Response) => {
  try {
    const pokemonCard: PokemonCard | null = await prisma.pokemonCard.findUnique({
      where: {
        id: parseInt(req.params.id),
      }
    });
    res.json(pokemonCard);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
});

// Ajout d'un pokémon
app.post('/pokemons-cards', async (req: Request, res: Response) => {
  try {
    console.log('Request body:', req.body); 
    const pokemonCard: PokemonCard = await prisma.pokemonCard.create({
      data: {
        name: req.body.name,
        pokedexId: req.body.pokedexId,
        typeId: req.body.typeId,
        lifePoints: req.body.lifePoints,
        weight: req.body.weight,
        size: req.body.size,
        imageUrl: req.body.imageUrl
      }
    });
    res.json(pokemonCard);
  } catch (error) {
    res.status(500).json({ 
      error: error,
      body: req.body,
    });
  }
});

