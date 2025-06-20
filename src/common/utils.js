export function convertTimestampToDate(timestamp) {
  return new Date(timestamp.replace(" ", "T"));
}
export function getDateAndTimeString(date) {
  return date.toLocaleDateString() + " - " + date.toLocaleTimeString();
}
export function getLastUpdatedString(timestamp) {
  const date = convertTimestampToDate(timestamp);
  return getDateAndTimeString(date);
}
