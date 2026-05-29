const MAX_LENGTH = 1000;

export type TemperamentNotes = string & { readonly __temperamentNotes: true };

export function toTemperamentNotes(value: string): TemperamentNotes {
  if (value.length > MAX_LENGTH) {
    throw new Error(`Temperament notes must not exceed ${MAX_LENGTH} characters`);
  }
  return value as TemperamentNotes;
}
