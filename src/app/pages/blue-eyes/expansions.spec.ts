import { YugiohCard } from '../../models/card.model';
import { filterCardsByExpansion, getUniqueExpansions } from './expansions';

const cards: YugiohCard[] = [
  { id: 1, name: 'A', type: 'Spell Card', desc: '', card_sets: [
    { set_name: 'Set B', set_code: 'B1', set_rarity: 'Common', set_price: '0' },
    { set_name: 'Set A', set_code: 'A1', set_rarity: 'Rare', set_price: '1' }
  ] },
  { id: 2, name: 'B', type: 'Effect Monster', desc: '', card_sets: [
    { set_name: 'Set A', set_code: 'A2', set_rarity: 'Rare', set_price: '2' }
  ] },
  { id: 3, name: 'C', type: 'Trap Card', desc: '' }
];

describe('expansiones', () => {
  it('extrae nombres únicos y ordenados', () => {
    expect(getUniqueExpansions(cards)).toEqual(['Set A', 'Set B']);
  });

  it('filtra por impresión y restaura todas', () => {
    expect(filterCardsByExpansion(cards, 'Set A').map((card) => card.id)).toEqual([1, 2]);
    expect(filterCardsByExpansion(cards, 'Set B').map((card) => card.id)).toEqual([1]);
    expect(filterCardsByExpansion(cards, '')).toEqual(cards);
  });
});
