import { Router } from 'express';
import { getPokemons, getPokemonById, createPokemon, updatePokemon, deletePokemon } from '../controllers/pokemons.controller';

const router = Router();

// Listes des pokémons
router.get('/', getPokemons);

// Pokémon spécifique
router.get('/:id', getPokemonById);

// Ajout d'un pokémon
router.post('/', createPokemon);

// Modification d'un pokémon
router.patch('/:id', updatePokemon);

// Suppression d'un pokémon
router.delete('/:id', deletePokemon);

export default router;
