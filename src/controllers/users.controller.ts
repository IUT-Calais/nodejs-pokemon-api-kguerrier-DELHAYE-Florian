import { Request, Response } from 'express';
import prisma from '../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Récupérer tous les utilisateurs
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    const errorMessage = (error as Error).message || 'Une erreur est survenue';
    res.status(500).json({ error: errorMessage });
  }
};

// Récupérer un utilisateur par son ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id }
    });
    if (user) {
      res.status(200).json(user);
      return;
    }
    res.status(404).json({ error: 'Utilisateur introuvable' });
  } catch (error) {
    const errorMessage = (error as Error).message || 'Une erreur est survenue';
    res.status(500).json({ error: errorMessage });
  }
};

// Créer un nouvel utilisateur
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Vérifier si les champs sont présents
    if (!email || !password) {
      res.status(400).json({ error: 'Email et mot de passe requis' });
      return;
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà' });
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      data: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    const errorMessage = (error as Error).message || 'Une erreur est survenue';
    res.status(500).json({ error: errorMessage });
  }
};

// Connexion d'un utilisateur
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email et mot de passe requis' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400).json({ error: 'Email ou mot de passe incorrect' });
      return;
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    const errorMessage = (error as Error).message || 'Une erreur est survenue';
    res.status(500).json({ error: errorMessage });
  }
};