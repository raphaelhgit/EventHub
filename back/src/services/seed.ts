/**
 * Seed des donnees de demonstration
 *
 * Ce fichier initialise la base de donnees avec des donnees de test
 * conformes a l'enonce du projet EventHub.
 *
 * Donnees a inserer :
 * - 3 utilisateurs (organisateur, utilisateur, admin)
 * - 5 evenements de demonstration
 *
 * Les donnees de demo permettent de tester l'application immediatement
 * sans avoir a creer manuellement des comptes et des evenements.
 */

import db from './db.js';
import { UserRole } from '../models/user.js';
import { EventCategory } from '../models/event.js';

export async function seedDemoData(): Promise<void> {
  console.log('Seeding demo data...');

  // =============================================================================
  // UTILISATEURS DE DEMO
  // =============================================================================

  const usersData = [
    {
      email: 'organisateur@example.com',
      password: 'password123',
      name: 'Jean Organisateur',
      role: UserRole.ORGANIZER,
    },
    {
      email: 'utilisateur@example.com',
      password: 'password123',
      name: 'Marie Utilisatrice',
      role: UserRole.USER,
    },
    {
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin EventHub',
      role: UserRole.ADMIN,
    },
  ];

  for (const userData of usersData) {
    try {
      const existing = await db.users.findByEmail(userData.email);
      if (!existing) {
        await db.users.create(userData);
        console.log(`  Created user: ${userData.email}`);
      } else {
        console.log(`  User already exists: ${userData.email}`);
      }
    } catch (error) {
      console.error(`  Failed to create user ${userData.email}:`, error);
    }
  }

  // =============================================================================
  // EVENEMENTS DE DEMONSTRATION
  // =============================================================================

  // On recupere l'ID de l'organisateur pour l'associer aux evenements
  const organizer = await db.users.findByEmail('organisateur@example.com');

  if (!organizer) {
    console.error('Organisateur non trouve — skip event seed');
    return;
  }

  const eventsData = [
    {
      title: 'Concert Jazz au Sunset',
      description: 'Une soir jazz exception avec le quartet de Pierre Lenoir. Ambiance intimiste et musicale au coeur de Paris.',
      date: '2026-06-15',
      time: '20:30',
      location: 'Le Sunset',
      city: 'Paris',
      price: 35,
      totalPlaces: 100,
      category: EventCategory.CONCERT,
    },
    {
      title: 'Conference Tech Leaders',
      description: 'Les meilleurs experts tech partagent leurs retours sur l architecture des systemes distribues a grande echelle.',
      date: '2026-05-20',
      time: '09:00',
      location: 'Centre de Congres',
      city: 'Lyon',
      price: 50,
      totalPlaces: 200,
      category: EventCategory.CONFERENCE,
    },
    {
      title: 'Festival Electro Summer',
      description: '3 scenes, 20 artistes, une nuit entiere de musique electronique. Le rendez-vous incontournable de ete marsseillais.',
      date: '2026-07-10',
      time: '22:00',
      location: 'Parc des Expositions',
      city: 'Marseille',
      price: 45,
      totalPlaces: 500,
      category: EventCategory.FESTIVAL,
    },
    {
      title: 'Match de Gala',
      description: 'Match de charite opposant les legendes du football francais aux anciens internationaux. Un evenement sportif et solidaire.',
      date: '2026-06-01',
      time: '19:00',
      location: 'Stade Chaban-Delmas',
      city: 'Bordeaux',
      price: 25,
      totalPlaces: 150,
      category: EventCategory.SPORT,
    },
    {
      title: 'Hamlet - Comedie Francaise',
      description: 'La tragedie universelle de Shakespeare dans une mise en scene contemporaine par la troupe de la Comedie Francaise.',
      date: '2026-05-25',
      time: '20:00',
      location: 'Theatre de l Odeon',
      city: 'Paris',
      price: 40,
      totalPlaces: 80,
      category: EventCategory.THEATER,
    },
    {
      title: 'Soiree Stand-up Parisienne',
      description: 'Une lineup de dix humoristes emergents et confirmes pour une soiree rires garantis au coeur du Marais.',
      date: '2026-07-05',
      time: '21:00',
      location: 'Le Point Virgule',
      city: 'Paris',
      price: 22,
      totalPlaces: 120,
      category: EventCategory.THEATER,
    },
    {
      title: 'Hackathon Green Tech',
      description: '48 heures pour prototyper des solutions tech au service de la transition ecologique. Ouvert aux devs, designers et porteurs de projet.',
      date: '2026-10-03',
      time: '09:00',
      location: 'Campus Numérique',
      city: 'Nantes',
      price: 15,
      totalPlaces: 80,
      category: EventCategory.CONFERENCE,
    },
    {
      title: 'Expo Art Contemporain',
      description: 'Parcours immersif avec installations, performances live et rencontres avec une vingtaine d artistes europeens.',
      date: '2026-08-20',
      time: '10:00',
      location: 'La Condition Publique',
      city: 'Lille',
      price: 18,
      totalPlaces: 300,
      category: EventCategory.OTHER,
    },
    {
      title: 'Concert Hip-Hop Lyon',
      description: 'Scene ouverte aux talents locaux suivie d un set du collectif Rhone Beats. Ambiance festival en plein air.',
      date: '2026-07-25',
      time: '19:30',
      location: 'Sucre',
      city: 'Lyon',
      price: 28,
      totalPlaces: 250,
      category: EventCategory.CONCERT,
    },
    {
      title: 'Marathon de Toulouse',
      description: 'Course urbaine 42 km a travers le centre historique et les bords de Garonne. Dossards limites, ambiance festive garantie.',
      date: '2026-09-12',
      time: '08:00',
      location: 'Place du Capitole',
      city: 'Toulouse',
      price: 55,
      totalPlaces: 400,
      category: EventCategory.SPORT,
    },
  ];

  for (const eventData of eventsData) {
    // On verifie qu'un evenement avec ce titre n'existe pas deja
    const existingEvents = db.events.findAll();
    const exists = existingEvents.some(e => e.title === eventData.title);

    if (!exists) {
      db.events.create(eventData, organizer.id);
      console.log(`  Created event: ${eventData.title}`);
    } else {
      console.log(`  Event already exists: ${eventData.title}`);
    }
  }

  console.log('Demo data seeded successfully.');
}

export default seedDemoData;