const MAX_LENGTH = 500;

export type VisitNote = string & { readonly __visitNote: true };

export function toVisitNote(value: string): VisitNote {
  if (value.length > MAX_LENGTH) {
    throw new Error(`Visit note must not exceed ${MAX_LENGTH} characters`);
  }
  return value as VisitNote;
}
