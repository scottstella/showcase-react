export function convertTimestampToDate(timestamp: string): Date {
  return new Date(timestamp.replace(" ", "T"));
}

export function getDateAndTimeString(date: Date): string {
  return date.toLocaleDateString() + " - " + date.toLocaleTimeString();
}

export function getLastUpdatedString(timestamp: string): string {
  const date = convertTimestampToDate(timestamp);
  return getDateAndTimeString(date);
}
