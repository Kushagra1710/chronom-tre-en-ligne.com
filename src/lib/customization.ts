export const customDefaults = {
  title: "",
  face: "digital",
  palette: "ink",
  font: "mono",
  size: "standard",
  background: "dots",
  fractions: true,
  laps: true,
};
export type Customization = typeof customDefaults;
const choices = {
  face: ["digital", "analog"],
  palette: ["ink", "ocean", "forest", "plum"],
  font: ["mono", "sans"],
  size: ["standard", "large"],
  background: ["dots", "plain", "glow"],
};
export function parseCustomization(value: unknown): Customization {
  const result = { ...customDefaults };
  if (!value || typeof value !== "object") return result;
  const obj = value as Record<string, unknown>;
  if (typeof obj.title === "string") result.title = obj.title.slice(0, 60);
  for (const key of Object.keys(choices) as (keyof typeof choices)[])
    if (
      typeof obj[key] === "string" &&
      choices[key].includes(obj[key] as string)
    )
      result[key] = obj[key] as string;
  for (const key of ["fractions", "laps"] as const)
    if (typeof obj[key] === "boolean") result[key] = obj[key];
  return result;
}
