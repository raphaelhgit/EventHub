/**
 * Middleware d'authentification JWT
 *
 * Ce middleware vérifie que la requête HTTP contient un token JWT valide.
 * Il protège les routes qui nécessitent une connexion.
 *
 * Fonctionnement :
 * 1. Extraction du token depuis le header Authorization: Bearer <token>
 * 2. Vérification de la validité du token (signature, expiration)
 * 3. Décodage du payload et attachement à req.user
 * 4. Si invalide → réponse 401 Unauthorized
 */
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../models/user.js';
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
/**
 * Authenticate — Vérifie le token JWT
 *
 * À utiliser sur les routes qui nécessitent une authentification.
 * Si le token est absent ou invalide, la requête est rejetée avec 401.
 */
export declare function authenticate(req: Request, res: Response, next: NextFunction): void;
/**
 * RequireRole — Vérifie que l'utilisateur a un rôle spécifique
 *
 * À utiliser APRÈS authenticate, car elle dépend de req.user.
 * Permet de restreindre l'accès à certaines routes à certains rôles.
 *
 * @example
 * router.post('/events', authenticate, requireRole('organizer'), createEvent);
 */
export declare function requireRole(...allowedRoles: string[]): (req: Request, res: Response, next: NextFunction) => void;
/**
 * OptionalAuth — Authentification optionnelle
 *
 * Si un token est présent et valide, req.user est rempli.
 * Si absent ou invalide, la requête continue quand même (req.user = undefined).
 *
 * Utile pour les routes publiques qui varient selon l'utilisateur connecté.
 */
export declare function optionalAuth(req: Request, res: Response, next: NextFunction): void;
declare const _default: {
    authenticate: typeof authenticate;
    requireRole: typeof requireRole;
    optionalAuth: typeof optionalAuth;
};
export default _default;
//# sourceMappingURL=auth.d.ts.map