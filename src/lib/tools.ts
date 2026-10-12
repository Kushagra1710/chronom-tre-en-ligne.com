export const tools = [
  {
    href: "/",
    title: "Chronomètre numérique",
    label: "Numérique",
    icon: "watch",
    type: "stopwatch",
    description:
      "Un chronomètre en ligne gratuit avec tours, temps cumulés et export CSV.",
    preview: "00:00.00",
  },
  {
    href: "/chronometre-analogique/",
    title: "Chronomètre analogique",
    label: "Analogique",
    icon: "watch",
    type: "stopwatch",
    description:
      "Un cadran à aiguilles avec affichage numérique et temps intermédiaires.",
    preview: "analog",
  },
  {
    href: "/chronometre-minimaliste/",
    title: "Chronomètre minimaliste",
    label: "Minimaliste",
    icon: "expand",
    type: "stopwatch",
    description:
      "Un affichage épuré et lisible pour se concentrer ou chronométrer en classe.",
    preview: "00:00",
  },
  {
    href: "/chronometre-personnalise/",
    title: "Chronomètre personnalisé",
    label: "Personnalisé",
    icon: "settings",
    type: "stopwatch",
    description:
      "Créez votre chronomètre aesthetic : titre, couleurs, police et fond au choix.",
    preview: "Votre temps.",
  },
  {
    href: "/minuteur/",
    title: "Minuteur en ligne",
    label: "Compte à rebours",
    icon: "watch",
    type: "timer",
    description:
      "Réglez une durée de 1 minute ou plus et lancez le compte à rebours.",
    preview: "05:00",
  },
  {
    href: "/pomodoro/",
    title: "Minuteur Pomodoro",
    label: "Pomodoro",
    icon: "play",
    type: "timer",
    description:
      "Alternez les séances de concentration et les pauses à votre rythme.",
    preview: "25:00",
  },
  {
    href: "/minuteur-intervalle/",
    title: "Minuteur à intervalles",
    label: "Intervalles",
    icon: "reset",
    type: "timer",
    description:
      "Programmez vos phases d’effort et de repos pour le sport ou les exercices.",
    preview: "00:30",
  },
] as const;
export type StopwatchVariant = "digital" | "analog" | "minimal" | "custom";
export type TimerMode = "countdown" | "pomodoro" | "interval";

export const toolCategories = [
  {
    href: "/chronometres/",
    title: "Chronomètres",
    description: "Numérique, analogique, minimaliste et personnalisé",
    icon: "flag",
  },
  {
    href: "/minuteurs/",
    title: "Minuteurs",
    description: "Compte à rebours, Pomodoro et intervalles",
    icon: "reset",
  },
] as const;
