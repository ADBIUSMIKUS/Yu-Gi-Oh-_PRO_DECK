import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search';
import { BlueEyesComponent } from './pages/blue-eyes/blue-eyes';
import { CardDetailComponent } from './pages/card-detail/card-detail';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'search' },
  { path: 'search', component: SearchComponent, title: 'Buscar cartas | Blue-Eyes Card Explorer' },
  { path: 'blue-eyes', component: BlueEyesComponent, title: 'Blue-Eyes Collection | Blue-Eyes Card Explorer' },
  { path: 'card/:id', component: CardDetailComponent, title: 'Detalle de carta | Blue-Eyes Card Explorer' },
  { path: '**', redirectTo: 'search' }
];
