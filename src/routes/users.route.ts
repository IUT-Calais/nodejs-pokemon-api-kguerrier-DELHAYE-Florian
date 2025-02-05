import { Router } from 'express';
import { getUsers, getUserById, createUser } from '../controllers/users.controller';

const router = Router();

// Liste des utilisateurs
router.get('/', getUsers);

// Utilisateur spécifique
router.get('/:id', getUserById);

// Création d'un utilisateur
router.post('/', createUser);

export default router;
