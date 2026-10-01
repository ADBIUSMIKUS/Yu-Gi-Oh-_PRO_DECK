import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { YugiohService } from '../../core/services/yugioh.service';
import { YugiohCard } from '../../models/card.model';
import { CardComponent } from '../../shared/card/card';

type SearchState = 'idle' | 'loading' | 'success' | 'empty' | 'error';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, CardComponent],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class SearchComponent {
  readonly query = new FormControl('', { nonNullable: true });
  readonly cards = signal<YugiohCard[]>([]);
  readonly state = signal<SearchState>('idle');
  readonly errorMessage = signal('');
  private readonly service = inject(YugiohService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.query.valueChanges.pipe(
      map((value) => value.trim()),
      debounceTime(400),
      distinctUntilChanged(),
      tap((value) => {
        this.cards.set([]);
        this.state.set(value ? 'loading' : 'idle');
      }),
      switchMap((value) => value ? this.service.searchCards(value).pipe(
        map((cards) => ({ cards, error: '' })),
        catchError((error: unknown) => of({ cards: [] as YugiohCard[], error: this.describeError(error) }))
      ) : of({ cards: [] as YugiohCard[], error: '' })),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ cards, error }) => {
      this.cards.set(cards);
      this.errorMessage.set(error);
      this.state.set(error ? 'error' : !this.query.value.trim() ? 'idle' : cards.length ? 'success' : 'empty');
    });
  }

  openCard(card: YugiohCard): void {
    void this.router.navigate(['/card', card.id]);
  }

  private describeError(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 0) return 'No se pudo conectar con YGOPRODeck. Revisa tu conexión e inténtalo de nuevo.';
    return 'No se pudieron cargar las cartas. Inténtalo de nuevo en unos momentos.';
  }
}
