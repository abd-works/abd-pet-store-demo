const MAX_LENGTH = 2000;

export type StaffVisitNotes = string & { readonly __staffVisitNotes: true };

export function toStaffVisitNotes(value: string): StaffVisitNotes {
  if (value.length > MAX_LENGTH) {
    throw new Error(`Staff visit notes must not exceed ${MAX_LENGTH} characters`);
  }
  return value as StaffVisitNotes;
}
