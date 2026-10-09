export const tools = [
  {
    href: "/",
    title: "Digital stopwatch",
    label: "Digital",
    icon: "watch",
    type: "stopwatch",
    description: "A clear clock with lap records, split times, and exports.",
    preview: "00:00.00",
  },
  {
    href: "/analog-stopwatch/",
    title: "Analog stopwatch",
    label: "Analog",
    icon: "watch",
    type: "stopwatch",
    description: "A classic dial with a second hand and digital precision.",
    preview: "analog",
  },
  {
    href: "/minimal-stopwatch/",
    title: "Minimal stopwatch",
    label: "Minimal",
    icon: "expand",
    type: "stopwatch",
    description: "A quieter display for deep work and a little more focus.",
    preview: "00:00",
  },
  {
    href: "/custom-stopwatch/",
    title: "Custom stopwatch",
    label: "Custom",
    icon: "settings",
    type: "stopwatch",
    description: "Your title, your colors, your clock. Make this space yours.",
    preview: "Your time.",
  },
  {
    href: "/timer/",
    title: "Countdown timer",
    label: "Countdown",
    icon: "watch",
    type: "timer",
    description: "Set a duration, choose a preset, and make room for one task.",
    preview: "05:00",
  },
  {
    href: "/pomodoro/",
    title: "Pomodoro timer",
    label: "Pomodoro",
    icon: "play",
    type: "timer",
    description: "A repeatable rhythm of focused work and restorative breaks.",
    preview: "25:00",
  },
  {
    href: "/interval-timer/",
    title: "Interval timer",
    label: "Intervals",
    icon: "reset",
    type: "timer",
    description: "Alternate work and rest for a routine that fits your pace.",
    preview: "00:30",
  },
] as const;
export type StopwatchVariant = "digital" | "analog" | "minimal" | "custom";
export type TimerMode = "countdown" | "pomodoro" | "interval";

export const toolCategories = [
  {
    href: "/stopwatches/",
    title: "Stopwatches",
    description: "Digital, analog, minimal & custom",
    icon: "flag",
  },
  {
    href: "/timers/",
    title: "Timers",
    description: "Countdown, Pomodoro & intervals",
    icon: "reset",
  },
] as const;
