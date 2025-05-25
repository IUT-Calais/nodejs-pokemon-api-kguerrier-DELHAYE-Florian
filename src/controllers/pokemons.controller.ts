import { Request, Response } from 'express';
import prisma from '../client';

// Récupérer tous les Pokémon
export const getPokemons = async (req: Request, res: Response): Promise<void> => {
  try {
    const pokemonCards = await prisma.pokemonCard.findMany();
    if (pokemonCards.length > 0) {
      res.status(200).json(pokemonCards);
    } else {
      res.status(404).json({ error: 'Aucun Pokémon trouvé.' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || 'Erreur serveur' });
  }
};

// Récupérer un Pokémon par son ID
export const getPokemonById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const pokemon = await prisma.pokemonCard.findUnique({ where: { id } });
    if (pokemon) {
      res.status(200).json(pokemon);
    } else {
      res.status(404).json({ error: 'Pokémon introuvable' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || 'Erreur serveur' });
  }
};

// Créer un Pokémon
export const createPokemon = async (req: Request, res: Response): Promise<void> => {
  const { name, pokedexId, typeId, lifePoints, weight, size, imageUrl } = req.body;

  // Champs requis
  if (!name || !pokedexId || !typeId || !lifePoints) {
    res.status(400).json({ error: 'Champs requis manquants (name, pokedexId, typeId, lifePoints)' });
    return;
  }

  try {
    // Vérifie si le type existe
    const typeExists = await prisma.type.findUnique({ where: { id: typeId } });
    if (!typeExists) {
      res.status(400).json({ error: 'Type inexistant' });
      return;
    }

    // Vérifie unicité name et pokedexId
    const existing = await prisma.pokemonCard.findFirst({
      where: {
        OR: [{ name }, { pokedexId }]
      }
    });
    if (existing) {
      res.status(400).json({ error: 'Un Pokémon avec ce nom ou ce pokedexId existe déjà' });
      return;
    }

    const newPokemon = await prisma.pokemonCard.create({
      data: { name, pokedexId, typeId, lifePoints, weight, size, imageUrl }
    });

    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || 'Erreur serveur' });
  }
};

// Mettre à jour un Pokémon
export const updatePokemon = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, pokedexId, typeId, lifePoints, weight, size, imageUrl } = req.body;

  try {
    // Vérifie si le Pokémon existe
    const existing = await prisma.pokemonCard.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'Pokémon introuvable' });
      return;
    }

    // Vérifie si typeId est fourni et valide
    if (typeId) {
      const typeExists = await prisma.type.findUnique({ where: { id: typeId } });
      if (!typeExists) {
        res.status(400).json({ error: 'Type inexistant' });
        return;
      }
    }

    // Vérifie unicité (si name ou pokedexId changés)
    if (name || pokedexId) {
      const conflict = await prisma.pokemonCard.findFirst({
        where: {
          OR: [{ name }, { pokedexId }],
          NOT: { id }
        }
      });
      if (conflict) {
        res.status(400).json({ error: 'Nom ou pokedexId déjà utilisé' });
        return;
      }
    }

    const updated = await prisma.pokemonCard.update({
      where: { id },
      data: { name, pokedexId, typeId, lifePoints, weight, size, imageUrl }
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message || 'Erreur serveur' });
  }
};

// Supprimer un Pokémon
export const deletePokemon = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await prisma.pokemonCard.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    const msg = (error as Error).message;
    if (msg.includes('Record to delete does not exist')) {
      res.status(404).json({ error: 'Pokémon introuvable' });
    } else {
      res.status(500).json({ error: msg || 'Erreur serveur' });
    }
  }
};
