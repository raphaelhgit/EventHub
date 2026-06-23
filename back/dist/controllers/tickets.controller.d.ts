/**
 * Contrôleur de billetterie
 */
import { Request, Response } from 'express';
/**
 * POST /tickets
 * Acheter un billet pour un événement
 */
export declare function buyTicket(req: Request, res: Response): Promise<void>;
/**
 * GET /tickets
 * Liste des billets de l'utilisateur connecté
 */
export declare function getMyTickets(req: Request, res: Response): Promise<void>;
/**
 * GET /tickets/:id
 * Détail d'un billet spécifique
 */
export declare function getTicketById(req: Request, res: Response): Promise<void>;
/**
 * PATCH /tickets/:id/status
 * Modifier le statut d'un billet (admin uniquement)
 * Use case : marquer un billet comme "used" lors du scan QR
 */
export declare function updateTicketStatus(req: Request, res: Response): Promise<void>;
declare const _default: {
    buyTicket: typeof buyTicket;
    getMyTickets: typeof getMyTickets;
    getTicketById: typeof getTicketById;
    updateTicketStatus: typeof updateTicketStatus;
};
export default _default;
//# sourceMappingURL=tickets.controller.d.ts.map