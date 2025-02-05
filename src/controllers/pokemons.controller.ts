import { Request, Response } from 'express';
import { PrismaClient, PokemonCard } from '@prisma/client';

const prisma = new PrismaClient();

export const getPokemons = async (req: Request, res: Response) => {
  try {
    const pokemonCards: PokemonCard[] = await prisma.pokemonCard.findMany();
    res.json(pokemonCards);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue' });
  }
};

export const getPokemonById = async (req: Request, res: Response) => {
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
};

export const createPokemon = async (req: Request, res: Response) => {
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
};

export const updatePokemon = async (req: Request, res: Response) => {
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
};

export const deletePokemon = async (req: Request, res: Response) => {
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
};
