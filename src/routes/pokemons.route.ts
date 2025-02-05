import { Router } from 'express';
import { PrismaClient, PokemonCard } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Listes des pokémons
router.get('/', async (req, res) => {
  try {
    const pokemonCards: PokemonCard[] = await prisma.pokemonCard.findMany();
    res.json(pokemonCards);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
});

// Pokémon spécifique
router.get('/:id', async (req, res) => {
  try {
    const pokemonCard: PokemonCard | null = await prisma.pokemonCard.findUnique({
      where: {
        id: parseInt(req.params.id),
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

// Ajout d'un pokémon
router.post('/', async (req, res) => {
  try {
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

// Modification d'un pokémon
router.patch('/:id', async (req, res) => {
  try {
    const pokemonCard: PokemonCard = await prisma.pokemonCard.update({
      where: {
        id: parseInt(req.params.id),
      },
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

// Suppression d'un pokémon
router.delete('/:id', async (req, res) => {
  try {
    const pokemonCard: PokemonCard = await prisma.pokemonCard.delete({
      where: {
        id: parseInt(req.params.id),
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

export default router;
