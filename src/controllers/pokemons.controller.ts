import { Request, Response } from 'express';
import { PokemonCard } from '@prisma/client';
import prisma from '../client';

// Récupérer tous les Pokémon
export const getPokemons = async (req: Request, res: Response) => {
  try {
    const pokemonCards: PokemonCard[] = await prisma.pokemonCard.findMany();
    if (pokemonCards.length > 0) {
      res.status(200).json(pokemonCards);
      return;
    }
    res.status(404).json({ error: 'Pokémons introuvables' });
  } catch (error) {
    const errorMessage = (error as Error).message || 'Une erreur est survenue';
    res.status(500).json({ error: errorMessage });
  }
};

// Récupérer un Pokémon par son ID
export const getPokemonById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const pokemonCard = await prisma.pokemonCard.findUnique({
      where: { id }
    });
    if (pokemonCard) {
      res.status(200).json(pokemonCard);
      return;
    }
    res.status(404).json({ error: 'Pokémon introuvable' });
  } catch (error) {
    const errorMessage = (error as Error).message || 'Une erreur est survenue';
    res.status(500).json({ error: errorMessage });
  }
};

// Créer un nouveau Pokémon
export const createPokemon = async (req: Request, res: Response) => {
  try {
    const pokemonCard = await prisma.pokemonCard.create({
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
    res.status(201).json(pokemonCard);
  } catch (error) {
    const errorMessage = (error as Error).message || 'Une erreur est survenue';
    res.status(500).json({ error: errorMessage });
  }
};

// Mettre à jour un Pokémon existant (PUT et PATCH)
export const updatePokemon = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const pokemonCard = await prisma.pokemonCard.update({
      where: { id },
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
    res.status(200).json(pokemonCard);
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage?.includes('Record to update not found')) {
      res.status(404).json({ error: 'Pokémon introuvable' });
    } else {
      res.status(500).json({ error: errorMessage || 'Une erreur est survenue' });
    }
  }
};

// Pour supporter PUT (en plus de PATCH)
export const updatePokemonPut = updatePokemon;

// Supprimer un Pokémon
export const deletePokemon = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.pokemonCard.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (
      errorMessage?.includes('Record to delete does not exist') ||
      errorMessage?.includes('Record to update not found')
    ) {
      res.status(404).json({ error: 'Pokémon introuvable' });
    } else {
      res.status(500).json({ error: errorMessage || 'Une erreur est survenue' });
    }
  }
};