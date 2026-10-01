import { Component, input, output } from '@angular/core';
import { YugiohCard } from '../../models/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class CardComponent {
  readonly card = input.required<YugiohCard>();
  readonly selected = output<YugiohCard>();
}
