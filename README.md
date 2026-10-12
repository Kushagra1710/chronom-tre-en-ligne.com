# Chronomètre en ligne

Site entièrement en français pour **chronomètre-en-ligne.com**, développé avec Astro, TypeScript et CSS. Chronomètres numérique, analogique, minimaliste et personnalisé ; minuteurs, Pomodoro et intervalles. Les polices Geist sont hébergées localement.

## Développement

Node 22.12+ et npm sont nécessaires.

```sh
npm install
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```

La commande de démarrage indique le port disponible. Le port par défaut est 4321.

## Vérification

```sh
npm test
npm run typecheck
npm run build
npm run test:e2e
```

Démarrez le serveur avant les tests navigateur. Si son port diffère :

```sh
PLAYWRIGHT_BASE_URL=http://localhost:4325 npm run test:e2e
```

Les tests Playwright couvrent Chromium sur ordinateur et un écran mobile simulé, avec des contrôles d’accessibilité. Ils ne remplacent pas des tests sur Safari ou iOS réels.

## Référencement et routes

La page d’accueil cible « chronomètre en ligne ». Le contenu explique le plein écran, les usages en classe, la minute et la personnalisation aesthetic sans créer de pages de langue supplémentaires. Le document déclare `lang="fr"` ; chaque page indexable possède un lien `hreflang="fr"` vers elle-même pour tous les publics francophones. Les erreurs sont exclues de l’indexation.

Le domaine internationalisé est sérialisé en `https://xn--chronomtre-en-ligne-wyb.com` dans les URL techniques. Il s’agit de la représentation ASCII de **chronomètre-en-ligne.com**. La constante `src/lib/site.ts` fournit l’origine aux canoniques et au sitemap.

Routes : `/`, `/chronometres/`, `/chronometre-analogique/`, `/chronometre-minimaliste/`, `/chronometre-personnalise/`, `/minuteur/`, `/pomodoro/`, `/minuteur-intervalle/`, `/minuteurs/`, `/minuteurs-concentration/`, `/outils/`, `/a-propos/`, `/confidentialite/`, `/conditions-utilisation/`, `/contact/`.

Le fichier `public/_redirects` redirige les anciennes routes anglaises sur Cloudflare ; le middleware applique les mêmes règles pendant le développement. Les redirections mènent à leurs équivalents français avec un statut HTTP 301 et conserve les paramètres de requête, notamment les liens de personnalisation et les programmes enregistrés. Le sitemap ne contient que les URL françaises canoniques.

## Données et précision

Les séances, tours, préférences et programmes restent dans le stockage local du navigateur. Les variantes ont des séances distinctes. La restauration d’une séance active inclut le temps d’absence et met la séance en pause pour vérification. Les fichiers CSV constituent une copie indépendante du stockage local.

Le chronomètre utilise une horloge monotone pendant une séance active. Les minuteurs utilisent des échéances ; les changements d’horloge peuvent les affecter. La veille et la suspension du navigateur peuvent retarder les alertes. Les liens personnalisés partagent les paramètres d’apparence et le titre, pas les tours.

Le site conserve la configuration Google Analytics existante. La page Confidentialité décrit ce service séparément des données de séance locales.

## Déploiement

Le projet utilise l’adaptateur Cloudflare et `wrangler.jsonc`. `npm run build` produit les ressources dans `dist/`. `npm run deploy` compile puis déploie le Worker. Configurez le domaine personnalisé, le HTTPS et les redirections du domaine chez l’hébergeur. Les redirections depuis un autre domaine doivent être configurées sur cet ancien domaine.

Cette modification ne configure pas le DNS et ne publie pas le site. Après déploiement, vérifiez le domaine et soumettez `/sitemap.xml` dans Google Search Console.
