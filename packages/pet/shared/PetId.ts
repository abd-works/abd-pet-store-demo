declare const __petId: unique symbol;

export type PetId = string & { readonly [__petId]: true };

export function toPetId(value: string): PetId {
  if (!value.trim()) throw new Error('PetId must not be blank');
  return value as PetId;
}
