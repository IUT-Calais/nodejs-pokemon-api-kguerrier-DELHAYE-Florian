import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      error: error,
      body: req.body,
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(req.params.id),
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      error: error,
      body: req.body,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: `Email ou mot de passe manquant` });
    }
    const mail_utilise = await prisma.user.findUnique({
        where: { email },
    });
    if (mail_utilise) {
        res.status(400).json({ error: `L'email est déjà utilisé` });
    }
    const password_crypte = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: password_crypte,
      }
    });
    res.status(201).json({
        data: user,
        message: `Utilisateur créé avec succès`,
    });
  } catch (error) {
    res.status(500).json({ 
      error: error,
      body: req.body,
    });
  }
};