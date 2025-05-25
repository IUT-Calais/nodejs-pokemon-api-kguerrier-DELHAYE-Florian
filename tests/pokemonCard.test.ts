import request from 'supertest';
import { app, stopServer } from '../src';
import { prismaMock } from './jest.setup';

afterAll(() => {
  stopServer();
});

const mockCard = {
  id: 1,
  name: 'Bulbizarre',
  pokedexId: 1,
  typeId: 1,
  lifePoints: 45,
  weight: 6.9,
  size: 0.7,
  imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png'
};

describe('API des cartes Pokémon', () => {
  describe('GET /pokemons-cards', () => {
    it('devrait retourner toutes les cartes Pokémon', async () => {
      prismaMock.pokemonCard.findMany.mockResolvedValue([mockCard]);

      const response = await request(app).get('/pokemons-cards');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockCard]);
    });

    it('devrait retourner 404 si aucune carte Pokémon n\'est trouvée', async () => {
      prismaMock.pokemonCard.findMany.mockResolvedValue([]);

      const response = await request(app).get('/pokemons-cards');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Pokémons introuvables' });
    });
  });

  describe('GET /pokemons-cards/:id', () => {
    it('devrait retourner une carte Pokémon par ID', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockCard);

      const response = await request(app).get('/pokemons-cards/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCard);
    });

    it('devrait retourner 404 si la carte n\'est pas trouvée', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/pokemons-cards/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Pokémon introuvable' });
    });
  });

  describe('POST /pokemons-cards', () => {
    it('devrait créer une nouvelle carte Pokémon', async () => {
      prismaMock.pokemonCard.create.mockResolvedValue(mockCard);

      const response = await request(app)
        .post('/pokemons-cards')
        .set('Authorization', 'Bearer token')
        .send(mockCard);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCard);
    });

    it('devrait retourner une erreur 500 en cas d\'échec', async () => {
      prismaMock.pokemonCard.create.mockRejectedValue(new Error('Erreur'));

      const response = await request(app)
        .post('/pokemons-cards')
        .set('Authorization', 'Bearer token')
        .send(mockCard);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Erreur');
    });
  });

  describe('PATCH /pokemons-cards/:id', () => {
    it('devrait mettre à jour une carte Pokémon', async () => {
      prismaMock.pokemonCard.update.mockResolvedValue(mockCard);

      const response = await request(app)
        .patch('/pokemons-cards/1')
        .set('Authorization', 'Bearer token')
        .send(mockCard);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCard);
    });

    it('devrait retourner 404 si la carte n\'existe pas', async () => {
      prismaMock.pokemonCard.update.mockRejectedValue(
        new Error('Record to update not found')
      );

      const response = await request(app)
        .patch('/pokemons-cards/999')
        .set('Authorization', 'Bearer token')
        .send(mockCard);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Pokémon introuvable' });
    });
  });

  describe('DELETE /pokemons-cards/:id', () => {
    it('devrait supprimer une carte Pokémon', async () => {
      prismaMock.pokemonCard.delete.mockResolvedValue(mockCard);

      const response = await request(app)
        .delete('/pokemons-cards/1')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(204);
    });

    it('devrait retourner 404 si la carte n\'existe pas', async () => {
      prismaMock.pokemonCard.delete.mockRejectedValue(
        new Error('Record to delete does not exist')
      );

      const response = await request(app)
        .delete('/pokemons-cards/999')
        .set('Authorization', 'Bearer token');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Pokémon introuvable' });
    });
  });
});