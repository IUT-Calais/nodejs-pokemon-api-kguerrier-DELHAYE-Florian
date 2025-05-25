import request from 'supertest';
import { app, stopServer } from '../src';
import { prismaMock } from './jest.setup';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

afterAll(() => {
  stopServer();
});

describe('API des utilisateurs', () => {
  const userData = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedpassword'
  };

  describe('GET /users', () => {
    it('devrait retourner tous les utilisateurs', async () => {
      prismaMock.user.findMany.mockResolvedValue([userData]);

      const res = await request(app).get('/users');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toEqual(expect.arrayContaining([expect.objectContaining({
        id: userData.id,
        email: userData.email,
        password: userData.password
      })]));
    });

    it('devrait retourner une erreur 500 en cas de problème', async () => {
      prismaMock.user.findMany.mockRejectedValue(new Error('Erreur DB'));

      const res = await request(app).get('/users');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /users/:id', () => {
    it('devrait retourner un utilisateur spécifique', async () => {
      prismaMock.user.findUnique.mockResolvedValue(userData);

      const res = await request(app).get('/users/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(userData);
    });

    it('devrait retourner une erreur 404 si l\'utilisateur n\'existe pas', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/users/999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /users', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const newUser = { email: 'new@example.com', password: 'password123' };
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      const createdUser = { id: 2, email: newUser.email, password: hashedPassword };

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(createdUser);

      const res = await request(app).post('/users').send(newUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.email).toBe(newUser.email);
    });

    it('devrait retourner une erreur si l\'email est déjà utilisé', async () => {
      prismaMock.user.findUnique.mockResolvedValue(userData);

      const res = await request(app).post('/users').send({ email: userData.email, password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('devrait retourner une erreur si des champs sont manquants', async () => {
      const res = await request(app).post('/users').send({ email: '' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /login', () => {
    it('devrait connecter un utilisateur et retourner un token', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { id: 1, email: 'test@example.com', password: hashedPassword };

      prismaMock.user.findUnique.mockResolvedValue(user);

      const res = await request(app).post('/login').send({ email: user.email, password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('devrait retourner une erreur si l\'utilisateur n\'existe pas', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const res = await request(app).post('/login').send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('devrait retourner une erreur si le mot de passe est incorrect', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash('differentpassword', 10);
      const user = { id: 1, email: 'test@example.com', password: hashedPassword };

      prismaMock.user.findUnique.mockResolvedValue(user);

      const res = await request(app).post('/login').send({ email: user.email, password });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('devrait retourner une erreur si des champs sont manquants', async () => {
      const res = await request(app).post('/login').send({ email: '' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});