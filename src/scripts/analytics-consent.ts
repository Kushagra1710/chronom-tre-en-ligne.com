export {};
const ID = "G-40ZNFZXB6W";
const KEY = "chrono-analytics-consent-v1";
const VERSION = 1;
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
type Choice = { version: number; accepted: boolean; savedAt: number };
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  [key: `ga-disable-${string}`]: boolean;
};
const analytics = window as unknown as AnalyticsWindow;
const panel = document.querySelector<HTMLElement>("#analytics-consent")!;
const consentStatus = document.querySelector<HTMLElement>("#consent-status")!;
let loaded = false;
let choice: Choice | null = readChoice();

function readChoice(): Choice | null {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null");
    if (value?.version === VERSION && typeof value.accepted === "boolean" &&
      typeof value.savedAt === "number" && value.savedAt <= Date.now() &&
      Date.now() - value.savedAt < MAX_AGE) return value;
  } catch { /* If storage is unavailable, consent is required on each visit. */ }
  return null;
}

function tag(...args: unknown[]) {
  analytics.dataLayer ??= [];
  // gtag's queue expects Arguments objects.
  analytics.dataLayer.push(arguments);
}

function cleanURL(value: string): string {
  try {
    const url = new URL(value);
    return url.origin + url.pathname;
  } catch { return ""; }
}

function clearAnalyticsCookies() {
  const domains = location.hostname.split(".");
  const paths = new Set(["/"]);
  const segments = location.pathname.split("/").filter(Boolean);
  for (let i = 1; i <= segments.length; i++) {
    const path = "/" + segments.slice(0, i).join("/");
    paths.add(path);
    paths.add(path + "/");
  }
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name)) continue;
    for (const path of paths) {
      const expired = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax`;
      document.cookie = expired;
      for (let i = 0; i < domains.length - 1; i++) {
        document.cookie = `${expired}; Domain=${domains.slice(i).join(".")}`;
      }
    }
  }
}

function enableAnalytics() {
  analytics[`ga-disable-${ID}`] = false;
  if (loaded) {
    tag("consent", "update", { analytics_storage: "granted" });
    return;
  }
  loaded = true;
  // Basic consent mode: no Google script or request before acceptance.
  tag("consent", "default", {
    analytics_storage: "granted", ad_storage: "denied",
    ad_user_data: "denied", ad_personalization: "denied",
  });
  tag("js", new Date());
  tag("config", ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: MAX_AGE / 1000,
    cookie_update: false,
    page_location: cleanURL(location.href),
    page_referrer: cleanURL(document.referrer),
  });
  tag("event", "page_view", {
    page_location: cleanURL(location.href),
    page_referrer: cleanURL(document.referrer),
    page_title: document.title,
  });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
  document.head.append(script);
}

function disableAnalytics() {
  analytics[`ga-disable-${ID}`] = true;
  clearAnalyticsCookies();
}

function save(accepted: boolean) {
  choice = { version: VERSION, accepted, savedAt: Date.now() };
  let persisted = true;
  try { localStorage.setItem(KEY, JSON.stringify(choice)); }
  catch { persisted = false; }
  if (accepted) enableAnalytics();
  else disableAnalytics();
  panel.hidden = true;
  if (!accepted && loaded) {
    // Unload Google's code entirely after withdrawal. The stored refusal is
    // applied before any tag is created on the next document.
    if (persisted) location.reload();
  }
}

if (choice?.accepted) enableAnalytics();
else disableAnalytics();
panel.hidden = choice !== null;
document.querySelector("#consent-accept")!.addEventListener("click", () => save(true));
document.querySelector("#consent-reject")!.addEventListener("click", () => save(false));
document.querySelectorAll("[data-cookie-preferences]").forEach((button) => {
  button.addEventListener("click", () => {
    consentStatus.textContent = choice ? `Choix actuel : ${choice.accepted ? "accepté" : "refusé"}.` : "Aucun choix enregistré.";
    panel.hidden = false;
    document.querySelector<HTMLButtonElement>("#consent-reject")!.focus({ preventScroll: true });
  });
});
window.addEventListener("storage", (event) => {
  if (event.key !== KEY && event.key !== null) return;
  choice = readChoice();
  if (!choice?.accepted) {
    disableAnalytics();
    if (loaded) location.reload();
    else panel.hidden = choice !== null;
  } else {
    panel.hidden = true;
    enableAnalytics();
  }
});
// A tab left open must not continue tracking after its remembered choice expires.
setInterval(() => {
  if (choice && Date.now() - choice.savedAt >= MAX_AGE) {
    choice = null;
    disableAnalytics();
    if (loaded) location.reload();
    else panel.hidden = false;
  }
}, 60000);
