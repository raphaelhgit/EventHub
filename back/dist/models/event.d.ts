/**
 * Modèle Event — Événement de la billetterie EventHub
 */
export declare enum EventCategory {
    CONCERT = "Concert",
    CONFERENCE = "Conf\u00E9rence",
    FESTIVAL = "Festival",
    SPORT = "Sport",
    THEATER = "Th\u00E9\u00E2tre",
    OTHER = "Autre"
}
export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    city: string;
    price: number;
    totalPlaces: number;
    availablePlaces: number;
    category: EventCategory;
    image?: string;
    organizerId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateEventDto {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    city: string;
    price: number;
    totalPlaces: number;
    category: EventCategory;
    image?: string;
}
export interface UpdateEventDto {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    city?: string;
    price?: number;
    totalPlaces?: number;
    category?: EventCategory;
    image?: string;
}
export interface EventFilters {
    category?: EventCategory;
    city?: string;
    maxPrice?: number;
    minPrice?: number;
    upcomingOnly?: boolean;
}
/**
 * Réponse paginée pour la liste des événements.
 */
export interface EventListResponse {
    events: Event[];
    total: number;
    page: number;
    limit: number;
}
//# sourceMappingURL=event.d.ts.map