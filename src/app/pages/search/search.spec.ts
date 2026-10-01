import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { YugiohService } from '../../core/services/yugioh.service';
import { SearchComponent } from './search';

describe('SearchComponent', () => {
  it('consulta sólo el último valor tras escribir rápidamente', async () => {
    vi.useFakeTimers();
    const searched: string[] = [];
    try {
      await TestBed.configureTestingModule({
        imports: [SearchComponent],
        providers: [provideRouter([]), { provide: YugiohService, useValue: {
          searchCards: (name: string) => { searched.push(name); return of([]); }
        } }]
      }).compileComponents();
      const fixture = TestBed.createComponent(SearchComponent);
      fixture.detectChanges();
      fixture.componentInstance.query.setValue('Blu');
      fixture.componentInstance.query.setValue('Blue');
      fixture.componentInstance.query.setValue('Blue-Eyes');
      await vi.advanceTimersByTimeAsync(401);
      expect(searched).toEqual(['Blue-Eyes']);
      fixture.destroy();
    } finally {
      vi.useRealTimers();
    }
  });
});
