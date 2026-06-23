/**
 * Contrôleur d'authentification
 *
 * Les contrôleurs contiennent la logique métier liée aux requêtes HTTP.
 * Chaque fonction correspond à un endpoint (GET, POST, etc.)
 *
 * Responsabilités d'un contrôleur :
 * - Lire les données de la requête (body, params, query)
 * - Appeler les services (db) pour la logique métier
 * - Renvoyer la réponse HTTP appropriée (200, 201, 400, 401, 404, 500)
 */
import { Request, Response } from 'express';
/**
 * POST /auth/register
 * Créer un nouveau compte utilisateur
 */
export declare function register(req: Request, res: Response): Promise<void>;
/**
 * POST /auth/login
 * Connecter un utilisateur existant
 */
export declare function login(req: Request, res: Response): Promise<void>;
/**
 * GET /auth/me
 * Récupérer le profil de l'utilisateur connecté
 */
export declare function getMe(req: Request, res: Response): Promise<void>;
/**
 * PUT /auth/me
 * Modifier le profil de l'utilisateur connecté
 */
export declare function updateMe(req: Request, res: Response): Promise<void>;
declare const _default: {
    register: typeof register;
    login: typeof login;
    getMe: typeof getMe;
    updateMe: typeof updateMe;
};
export default _default;
//# sourceMappingURL=auth.controller.d.ts.map