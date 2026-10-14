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

## Confidentialité et mesure d’audience

Google Analytics `G-40ZNFZXB6W` est chargé uniquement après acceptation explicite.
La bannière propose « Refuser » et « Accepter » avec la même présentation. Le
bouton « Gérer les cookies » est disponible dans le pied de page de chaque page.
Le choix daté et versionné est conservé pendant 180 jours. Le retrait désactive
Analytics, supprime ses cookies accessibles et recharge la page pour décharger
le script Google. Les refus et retraits sont synchronisés entre les onglets.
Les URL de page et de provenance transmises sont dépourvues de paramètres et
fragments ; Google Signals et la personnalisation publicitaire sont désactivés.

Les deux exploitants confirmés sont Kushagra Sharma et Rashmeet Chhabra, établis
en Inde. Ces informations figurent dans les pages de confidentialité et de
conditions. Le contact confirmé est `s4717901@gmail.com`. La répartition écrite
de leurs responsabilités en matière de données reste à définir entre eux.

Vérifications à effectuer dans le compte Google Analytics (non accessibles depuis
le code du site) : vérifier la durée de conservation des données utilisateur et
événement, les mesures améliorées activées, les paramètres de partage des données,
les liens publicitaires éventuels et les accords de traitement des données.
Désactiver les mesures améliorées non nécessaires, notamment les interactions de
formulaire, et activer la suppression du paramètre d’URL `title` comme protection
supplémentaire. Vérifier également la conservation des journaux Cloudflare et les
accords de transfert applicables. Mettre la politique à jour avec ces choix réels.
Ne pas annoncer une conformité juridique totale sans ces vérifications.

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
