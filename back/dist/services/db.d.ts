/**
 * Couche d'acces aux donnees — EventHub (SQLite)
 *
 * Ce fichier remplace le store en memoire par des operations SQLite.
 * Chaque fonction correspond a une requete SQL preparee.
 */
import { User, CreateUserDto } from '../models/user.js';
import { Event, CreateEventDto, UpdateEventDto, EventFilters } from '../models/event.js';
import { Ticket, CreateTicketDto, TicketStatus, TicketStats } from '../models/ticket.js';
declare function createUser(dto: CreateUserDto): Promise<User>;
declare function findUserByEmail(email: string): Promise<User | undefined>;
declare function findUserById(id: string): Promise<User | undefined>;
declare function verifyPassword(user: User, password: string): Promise<boolean>;
declare function updateUser(id: string, dto: {
    name: string;
}): Promise<User>;
declare function getAllUsers(): User[];
declare function createEvent(dto: CreateEventDto, organizerId: string): Event;
declare function findEventById(id: string): Event | undefined;
declare function findEvents(filters?: EventFilters): Event[];
declare function findEventsByOrganizer(organizerId: string): Event[];
declare function updateEvent(id: string, dto: UpdateEventDto): Event;
declare function deleteEvent(id: string): boolean;
declare function createTicket(dto: CreateTicketDto): Ticket;
declare function findTicketById(id: string): Ticket | undefined;
declare function findTicketsByUser(userId: string): Ticket[];
declare function findTicketsByEvent(eventId: string): Ticket[];
declare function updateTicketStatus(id: string, status: TicketStatus): Ticket;
declare function getTicketStatsByOrganizer(organizerId: string): TicketStats;
export declare const db: {
    users: {
        create: typeof createUser;
        findByEmail: typeof findUserByEmail;
        findById: typeof findUserById;
        verifyPassword: typeof verifyPassword;
        update: typeof updateUser;
        getAll: typeof getAllUsers;
    };
    events: {
        create: typeof createEvent;
        findById: typeof findEventById;
        findAll: typeof findEvents;
        findByOrganizer: typeof findEventsByOrganizer;
        update: typeof updateEvent;
        delete: typeof deleteEvent;
    };
    tickets: {
        create: typeof createTicket;
        findById: typeof findTicketById;
        findByUser: typeof findTicketsByUser;
        findByEvent: typeof findTicketsByEvent;
        updateStatus: typeof updateTicketStatus;
        getStatsByOrganizer: typeof getTicketStatsByOrganizer;
    };
};
export default db;
//# sourceMappingURL=db.d.ts.map