export function stripCitationMarkers(content) {
  return (content ?? '')
    .replace(/\s*\[근거\s*\d+\]/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}
