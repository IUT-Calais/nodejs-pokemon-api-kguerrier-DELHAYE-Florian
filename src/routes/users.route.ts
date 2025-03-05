import { Router } from 'express';
import { getUsers, getUserById, createUser, loginUser } from '../controllers/users.controller';
import { verifyJWT } from '../common/jwt.middleware';

const router = Router();

// Liste des utilisateurs
router.get('/', getUsers);

// Utilisateur spécifique
router.get('/:id', getUserById);

// Création d'un utilisateur
router.post('/', createUser);

// Connexion d'un user
router.post('/login', verifyJWT, loginUser);

export default router;
