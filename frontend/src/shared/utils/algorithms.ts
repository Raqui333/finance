export function ByDateTimeAlgorithm(a: UserEntry, b: UserEntry) {
  return new Date(a.date).getTime() - new Date(b.date).getTime();
}
