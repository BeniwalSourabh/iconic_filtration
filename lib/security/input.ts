const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function cleanText(value: string) {
  return value.replace(controlCharacters, "").trim();
}

export function cleanOptionalText(value?: string) {
  const cleaned = cleanText(value ?? "");
  return cleaned ? cleaned : undefined;
}
