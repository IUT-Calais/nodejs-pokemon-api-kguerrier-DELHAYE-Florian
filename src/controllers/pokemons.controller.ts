import { Request, Response } from 'express';
import { PrismaClient, PokemonCard } from '@prisma/client';
import prisma from '../client';

export const getPokemons = async (req: Request, res: Response) => {
  try {
    const pokemonCards: PokemonCard[] = await prisma.pokemonCard.findMany();
    if (pokemonCards) {
      res.status(200).json(pokemonCards);
      return
    }
    res.status(400).json({ error: 'Pokémons introuvable' })
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
    if (pokemonCard) {
      res.status(200).json(pokemonCard);
      return
    }
    res.status(400).json({ error: 'Pokémon introuvable' })
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
