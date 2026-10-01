import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { YugiohService } from '../../core/services/yugioh.service';
import { YugiohCard } from '../../models/card.model';
import { CardComponent } from '../../shared/card/card';
import { filterCardsByExpansion, getUniqueExpansions } from './expansions';

type CollectionState = 'loading' | 'success' | 'empty' | 'error';

@Component({
  selector: 'app-blue-eyes',
  imports: [CardComponent],
  templateUrl: './blue-eyes.html',
  styleUrl: './blue-eyes.css'
})
export class BlueEyesComponent implements OnInit {
  readonly cards = signal<YugiohCard[]>([]);
  readonly selectedExpansion = signal('');
  readonly state = signal<CollectionState>('loading');
  readonly expansions = computed(() => getUniqueExpansions(this.cards()));
  readonly visibleCards = computed(() => filterCardsByExpansion(this.cards(), this.selectedExpansion()));
  private readonly service = inject(YugiohService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.state.set('loading');
    this.service.getBlueEyesCards().pipe(
      catchError(() => {
        this.state.set('error');
        return of([] as YugiohCard[]);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((cards) => {
      if (this.state() === 'error') return;
      this.cards.set(cards);
      this.state.set(cards.length ? 'success' : 'empty');
    });
  }

  chooseExpansion(event: Event): void {
    this.selectedExpansion.set((event.target as HTMLSelectElement).value);
  }

  openCard(card: YugiohCard): void {
    void this.router.navigate(['/card', card.id], { queryParams: { from: 'blue-eyes' } });
  }
}
