export function resolvePreferredPickupSelection(
  preferredStoreCode: string | null | undefined,
  currentSelection: string | null,
): string | null {
  if (currentSelection) return currentSelection;
  return preferredStoreCode ?? null;
}
