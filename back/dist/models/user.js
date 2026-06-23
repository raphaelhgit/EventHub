/**
 * Modèle User — Utilisateur de la plateforme EventHub
 *
 * Ce fichier définit les TypeScript interfaces (types) pour les données
 * manipulées par l'application. TypeScript permet de typer les données
 * et de détecter les erreurs à la compilation (avant l'exécution).
 *
 * Avantage du typage :
 * - Autocomplétion dans l'IDE
 * - Erreurs détectées au build, pas à l'exécution
 * - Documentation auto du code
 */
/**
 * Énumération des rôles utilisateurs.
 * Utiliser un typeunion plutôt qu'une string brute permet
 * à TypeScript de détecter les erreurs si on tape mal un rôle.
 */
export var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["ORGANIZER"] = "organizer";
    UserRole["ADMIN"] = "admin";
})(UserRole || (UserRole = {}));
//# sourceMappingURL=user.js.map