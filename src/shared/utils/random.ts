export function pickRandom<ItemType>(items: ItemType[]): ItemType | null {
  if (items.length === 0) return null;

  const index = Math.floor(Math.random() * items.length);

  return items[index];
}
