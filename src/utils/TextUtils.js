export function getShortCode(name = "", onlyFirst = false) {
  const initials = name
    .split(" ")
    .filter((word) => word.trim().length > 0)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return onlyFirst ? initials.charAt(0) : initials;
}
