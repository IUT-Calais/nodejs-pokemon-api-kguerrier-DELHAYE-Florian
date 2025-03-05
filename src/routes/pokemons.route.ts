import { Router } from 'express';
import { getPokemons, getPokemonById, createPokemon, updatePokemon, deletePokemon } from '../controllers/pokemons.controller';
import { verifyJWT } from '../common/jwt.middleware';

const router = Router();

// Listes des pokémons
router.get('/', getPokemons);

// Pokémon spécifique
router.get('/:id', getPokemonById);

// Ajout d'un pokémon
router.post('/', verifyJWT, createPokemon);

// Modification d'un pokémon
router.patch('/:id', verifyJWT, updatePokemon);

// Suppression d'un pokémon
router.delete('/:id', verifyJWT, deletePokemon);

export default router;
