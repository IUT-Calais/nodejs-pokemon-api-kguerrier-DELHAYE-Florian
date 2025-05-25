import { Router } from 'express';
import {
  getPokemons,
  getPokemonById,
  createPokemon,
  updatePokemon,
  deletePokemon
} from '../controllers/pokemons.controller';
import { verifyJWT } from '../common/jwt.middleware';

const router = Router();

// Liste de tous les pokémons
router.get('/pokemon-cards', getPokemons);

// Pokémon spécifique par ID
router.get('/pokemon-cards/:id', getPokemonById);

// Création d'un pokémon (authentification requise)
router.post('/pokemon-cards', verifyJWT, createPokemon);

// Modification d'un pokémon (authentification requise)
router.patch('/pokemon-cards/:id', verifyJWT, updatePokemon);

// Suppression d'un pokémon (authentification requise)
router.delete('/pokemon-cards/:id', verifyJWT, deletePokemon);

export default router;
