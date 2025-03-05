import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        return;
    }
    const mail_utilise = await prisma.user.findUnique({
        where: { email },
    });
    if (mail_utilise) {
        res.status(400).json({ error: `L'email est déjà utilisé` });
        return;
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
    return;
  } catch (error) {
    res.status(500).json({ 
      error: error,
      body: req.body,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => { 
  try {
    const { email, password } = req.body; 

    if (!email || !password) {
      res.status(400).json({ error: 'Email ou mot de passe manquant' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      }
    });

    if (!user) {
      res.status(400).json({ error: "L'utilisateur n'existe pas." });
      return;
    }

    bcrypt.compare(password, user.password, () => {
      if (password != user.password) {
        res.status(400).json({error: "Mot de passe incorrect"});
        return;
      }
      const token = jwt.sign(
        { email: email }, // Payload
        process.env.JWT_SECRET as jwt.Secret, // Secret
        { expiresIn: '1d'} // Expiration
      );
      res.status(200).json({token});
    });
  } catch (error) {
    res.status(500).json({ 
      error: error,
      body: req.body,
    });
  }
};