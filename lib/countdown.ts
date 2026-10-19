export function getCountdown(target: string, now: number) {
  const total = Math.max(0, Math.floor((new Date(target).getTime() - now) / 1000));
  return { days: Math.floor(total / 86400), hours: Math.floor((total % 86400) / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60, complete: total === 0 };
}
