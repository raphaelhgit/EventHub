/**
 * Configuration de l'application EventHub
 *
 * Ce fichier centralise toutes les variables d'environnement.
 * En Node.js/Express, on utilise process.env pour accéder aux
 * variables d'environnement système.
 *
 * Avantages de ce centraliser les configs :
 * - Un seul endroit à modifier pour changer une config
 * - Validation des variables obligatoires au démarrage
 * - Documentation des variables attendu
 */
export declare const config: {
    port: string | number;
    databaseUrl: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtExpiresMs: number;
    nodeEnv: string;
    frontendUrl: string;
    isProduction: boolean;
    isDevelopment: boolean;
};
export default config;
//# sourceMappingURL=index.d.ts.map