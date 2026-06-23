/**
 * Contrôleur d'événements
 */
import { Request, Response } from 'express';
/**
 * GET /events
 * Liste tous les événements (avec filtres optionnels)
 */
export declare function getEvents(req: Request, res: Response): Promise<void>;
/**
 * GET /events/:id
 * Détail d'un événement
 */
export declare function getEventById(req: Request, res: Response): Promise<void>;
/**
 * POST /events
 * Créer un nouvel événement (organisateurs uniquement)
 */
export declare function createEvent(req: Request, res: Response): Promise<void>;
/**
 * PUT /events/:id
 * Modifier un événement (organisateurs — proprietaire uniquement)
 */
export declare function updateEvent(req: Request, res: Response): Promise<void>;
/**
 * DELETE /events/:id
 * Supprimer un événement (propriétaire uniquement)
 * Un événement avec des billets vendus ne peut pas être supprimé
 */
export declare function deleteEvent(req: Request, res: Response): Promise<void>;
/**
 * GET /organizer/events
 * Liste des événements de l'organisateur connecté
 */
export declare function getMyEvents(req: Request, res: Response): Promise<void>;
/**
 * GET /organizer/stats
 * Statistiques de l'organisateur (billets vendus, CA)
 */
export declare function getOrganizerStats(req: Request, res: Response): Promise<void>;
declare const _default: {
    getEvents: typeof getEvents;
    getEventById: typeof getEventById;
    createEvent: typeof createEvent;
    updateEvent: typeof updateEvent;
    deleteEvent: typeof deleteEvent;
    getMyEvents: typeof getMyEvents;
    getOrganizerStats: typeof getOrganizerStats;
};
export default _default;
//# sourceMappingURL=events.controller.d.ts.map