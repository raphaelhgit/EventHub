/**
 * Base de donnees SQLite — EventHub
 *
 * Ce fichier gere la connexion et le schema de la base SQLite.
 * better-sqlite3 est synchrone — plus simple pour un serveur Express.
 */
import { type Database as DatabaseType } from 'better-sqlite3';
declare const db: DatabaseType;
export default db;
//# sourceMappingURL=database.d.ts.map