import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MapaComponent } from './pages/mapa/mapa.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { ImovelComponent } from './pages/imovel/imovel.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'mapa', component: MapaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'imovel/:id', component: ImovelComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
];
