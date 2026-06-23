/**
 * Modèle Ticket — Billet de la billetterie EventHub
 */
export declare enum TicketStatus {
    VALID = "valid",
    USED = "used",
    CANCELLED = "cancelled"
}
export interface Ticket {
    id: string;
    qrCode: string;
    eventId: string;
    userId: string;
    status: TicketStatus;
    purchaseDate: Date;
    usedAt?: Date;
    cancelledAt?: Date;
}
export interface CreateTicketDto {
    eventId: string;
    userId: string;
}
export interface TicketWithEvent extends Ticket {
    eventTitle: string;
    eventDate: string;
    eventCity: string;
    eventPrice: number;
}
export interface TicketStats {
    totalTickets: number;
    validTickets: number;
    usedTickets: number;
    cancelledTickets: number;
    totalRevenue: number;
}
//# sourceMappingURL=ticket.d.ts.map