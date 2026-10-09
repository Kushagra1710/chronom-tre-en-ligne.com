/** Remove only this application's known records, never unrelated site storage. */
export function clearLocalData() {
  const keys = [
    "rs-session-v1",
    "rs-settings-v1",
    "rs-theme",
    "rs-custom-v1",
    "os-routines-v1",
    "os-history-v1",
    ...["analog", "minimal", "custom"].flatMap((variant) => [
      `rs-session-${variant}-v1`,
      `rs-settings-${variant}-v1`,
    ]),
    ...["countdown", "pomodoro", "interval"].map(
      (mode) => `rs-timer-${mode}-v1`,
    ),
  ];
  keys.forEach((key) => localStorage.removeItem(key));
}
