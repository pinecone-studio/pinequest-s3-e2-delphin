const MOJIBAKE_PATTERN = /[ÐÑÃ]/;

export function repairMojibakeText(value: string) {
  if (!MOJIBAKE_PATTERN.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return decoded.includes("�") ? value : decoded;
  } catch {
    return value;
  }
}
