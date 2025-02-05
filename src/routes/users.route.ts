import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Liste des utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ 
      error: error,
      body: req.body,
    });
  }
});

// Utilisateur spécifique
router.get('/:id', async (req, res) => {
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
});

// Création d'un utilisateur
router.post('/', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: req.body.password,
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      error: error,
      body: req.body,
    });
  }
});

export default router;
