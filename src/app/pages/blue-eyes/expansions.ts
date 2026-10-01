import { YugiohCard } from '../../models/card.model';

export function getUniqueExpansions(cards: YugiohCard[]): string[] {
  const names = cards.flatMap((card) => card.card_sets ?? [])
    .map((printing) => printing.set_name)
    .filter((name) => name.trim().length > 0);
  return [...new Set(names)].sort((a, b) => a.localeCompare(b));
}

export function filterCardsByExpansion(cards: YugiohCard[], expansion: string): YugiohCard[] {
  if (!expansion) return cards;
  return cards.filter((card) => card.card_sets?.some((printing) => printing.set_name === expansion));
}
