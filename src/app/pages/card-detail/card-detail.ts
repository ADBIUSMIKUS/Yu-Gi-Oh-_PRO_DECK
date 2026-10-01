import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { YugiohService } from '../../core/services/yugioh.service';
import { YugiohCard } from '../../models/card.model';

type DetailState = 'loading' | 'success' | 'empty' | 'error';

@Component({
  selector: 'app-card-detail',
  imports: [RouterLink],
  templateUrl: './card-detail.html',
  styleUrl: './card-detail.css'
})
export class CardDetailComponent implements OnInit {
  readonly card = signal<YugiohCard | undefined>(undefined);
  readonly state = signal<DetailState>('loading');
  readonly backLink = signal('/search');
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(YugiohService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.backLink.set(this.route.snapshot.queryParamMap.get('from') === 'blue-eyes' ? '/blue-eyes' : '/search');
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        if (!Number.isSafeInteger(id) || id <= 0) return of(undefined);
        this.state.set('loading');
        return this.service.getCardById(id).pipe(
          catchError(() => {
            this.state.set('error');
            return of(undefined);
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((card) => {
      if (this.state() === 'error') return;
      this.card.set(card);
      this.state.set(card ? 'success' : 'empty');
    });
  }
}
