import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { YugiohCard } from '../../models/card.model';
import { YugiohService } from '../../core/services/yugioh.service';
import { BlueEyesComponent } from './blue-eyes';

describe('BlueEyesComponent', () => {
  it('muestra Loading y Error si falla la API', async () => {
    const response = new Subject<YugiohCard[]>();
    await TestBed.configureTestingModule({
      imports: [BlueEyesComponent],
      providers: [provideRouter([]), { provide: YugiohService, useValue: { getBlueEyesCards: () => response.asObservable() } }]
    }).compileComponents();
    const fixture = TestBed.createComponent(BlueEyesComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Cargando cartas');
    response.error(new Error('Fallo de red'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No se pudo cargar la colección');
    expect(fixture.nativeElement.querySelector('button')?.textContent).toContain('Reintentar');
  });
});
