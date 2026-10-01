import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { YugiohService } from './yugioh.service';

describe('YugiohService', () => {
  let service: YugiohService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(YugiohService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('usa fname para la búsqueda parcial', () => {
    let result = 0;
    service.searchCards('Kuriboh').subscribe((cards) => result = cards.length);
    const request = http.expectOne((req) => req.url.endsWith('/cardinfo.php') && req.params.get('fname') === 'Kuriboh');
    expect(request.request.method).toBe('GET');
    request.flush({ data: [{ id: 1, name: 'Kuriboh', type: 'Effect Monster', desc: '' }] });
    expect(result).toBe(1);
  });

  it('interpreta el 400 específico sin coincidencias como Empty', () => {
    let result: number | undefined;
    service.searchCards('sin resultado').subscribe((cards) => result = cards.length);
    http.expectOne((req) => req.params.has('fname')).flush(
      { error: 'No card matching your query was found in the database.' },
      { status: 400, statusText: 'Bad Request' }
    );
    expect(result).toBe(0);
  });

  it('propaga un fallo de servidor como Error', () => {
    let status = 0;
    service.searchCards('Kuriboh').subscribe({ error: (error) => status = error.status });
    http.expectOne((req) => req.params.has('fname')).flush(
      { error: 'Internal error' }, { status: 500, statusText: 'Server Error' }
    );
    expect(status).toBe(500);
  });

  it('consulta el arquetipo Blue-Eyes desde la API', () => {
    service.getBlueEyesCards().subscribe();
    http.expectOne((req) => req.params.get('archetype') === 'Blue-Eyes').flush({ data: [] });
  });
});
