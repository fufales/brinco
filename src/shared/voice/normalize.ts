/** La misma frase siempre se busca igual, aunque cambien los espacios. */
export function normalizePhrase(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}
