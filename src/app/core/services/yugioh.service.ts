import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { CardInfoResponse, YugiohCard } from '../../models/card.model';

const CARD_INFO_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

@Injectable({ providedIn: 'root' })
export class YugiohService {
  private readonly http = inject(HttpClient);

  searchCards(name: string): Observable<YugiohCard[]> {
    return this.getCards(new HttpParams().set('fname', name)).pipe(
      catchError((error: unknown) => this.emptySearchOrError(error))
    );
  }

  getBlueEyesCards(): Observable<YugiohCard[]> {
    return this.getCards(new HttpParams().set('archetype', 'Blue-Eyes'));
  }

  getCardById(id: number): Observable<YugiohCard | undefined> {
    return this.getCards(new HttpParams().set('id', id)).pipe(
      map((cards) => cards[0]),
      catchError((error: unknown) => this.emptyCardOrError(error))
    );
  }

  private getCards(params: HttpParams): Observable<YugiohCard[]> {
    return this.http.get<CardInfoResponse>(CARD_INFO_URL, { params }).pipe(
      map((response) => {
        if (!response || !Array.isArray(response.data)) {
          throw new Error('La API devolvió una respuesta inesperada.');
        }
        return response.data;
      })
    );
  }

  private emptySearchOrError(error: unknown): Observable<YugiohCard[]> {
    if (this.isNoMatch(error)) return of([]);
    return throwError(() => error);
  }

  private emptyCardOrError(error: unknown): Observable<YugiohCard | undefined> {
    if (this.isNoMatch(error)) return of(undefined);
    return throwError(() => error);
  }

  // YGOPRODeck usa HTTP 400 para una consulta válida sin coincidencias.
  private isNoMatch(error: unknown): boolean {
    if (!(error instanceof HttpErrorResponse) || error.status !== 400) return false;
    const body: unknown = error.error;
    return typeof body === 'object' && body !== null && 'error' in body &&
      typeof body.error === 'string' &&
      body.error.startsWith('No card matching your query was found');
  }
}
