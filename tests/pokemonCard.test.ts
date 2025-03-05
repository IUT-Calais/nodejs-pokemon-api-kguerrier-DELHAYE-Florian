import request from 'supertest';
import { app, stopServer } from '../src';
import { prismaMock } from './jest.setup';

afterAll(() => { 
  stopServer(); 
});

describe('PokemonCard API', () => {
  describe('GET /pokemons-cards', () => {
    it('should fetch all PokemonCards', async () => {
      const mockPokemonCards = [
        {
          id: 1,
          name: 'Bulbizarre',
          pokedexId: 1,
          typeId: 1,
          lifePoints: 45,
          weight: 6.9,
          size: 0.7,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png'
        }, 
        {
          id: 2,
          name: 'Herbizarre',
          pokedexId: 2,
          typeId: 1,
          lifePoints: 60,
          weight: 13,
          size: 1,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/002.png'
        },
        {
          id: 3,
          name: 'Florizarre',
          pokedexId: 3,
          typeId: 1,
          lifePoints: 80,
          weight: 100,
          size: 2,
          imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/003.png'
        }
      ];

      prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);

      const response = await request(app).get('/pokemons-cards');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCards);
    });
  });
  
  describe('GET /pokemons-cards/:pokemonCardId', () => {
    it('should fetch a PokemonCard by ID', async () => {
      const mockPokemonCards = {
        id: 1,
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 1,
        lifePoints: 45,
        weight: 6.9,
        size: 0.7,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png'
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCards);

      const response = await request(app).get('/pokemons-cards/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCards);
    });

    it('should return 404 if PokemonCard is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/pokemons-cards/999');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Pokémon introuvable' });
    });
  });

  describe('POST /pokemons-cards', () => {
    it('should create a new PokemonCard', async () => {
      const createdPokemonCard = {
        name: 'Bulbizarre',
        pokedexId: 1,
        typeId: 1,
        lifePoints: 45,
        weight: 6.9,
        size: 0.7,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png'
      }

      prismaMock.pokemonCard.findMany.mockResolvedValue(createdPokemonCard);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPokemonCard)
    });
  });

  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('should update an existing PokemonCard', async () => {
      const updatedPokemonCard = {};

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedPokemonCard);
    });
  });

  describe('DELETE /pokemon-cards/:pokemonCardId', () => {
    it('should delete a PokemonCard', async () => {
      expect(response.status).toBe(204);
    });
  });
  */
});
