import { defineMiddleware } from "astro:middleware";

// Mirror public/_redirects for Astro development and Worker-served requests.
const legacyPaths: Record<string, string> = {
  "/analog-stopwatch": "/chronometre-analogique/",
  "/minimal-stopwatch": "/chronometre-minimaliste/",
  "/custom-stopwatch": "/chronometre-personnalise/",
  "/interval-timer": "/minuteur-intervalle/",
  "/focus-timers": "/minuteurs-concentration/",
  "/stopwatches": "/chronometres/",
  "/timers": "/minuteurs/",
  "/timer": "/minuteur/",
  "/tools": "/outils/",
  "/about": "/a-propos/",
  "/privacy": "/confidentialite/",
  "/terms": "/conditions-utilisation/",
};

export const onRequest = defineMiddleware((context, next) => {
  const destination = legacyPaths[context.url.pathname.replace(/\/+$/, "")];
  if (destination)
    return context.redirect(destination + context.url.search, 301);
  return next();
});
