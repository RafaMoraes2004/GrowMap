import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';
import { Quizscreen } from './quizscreen/quizscreen';
import { Home } from './home/home';
import { Feedback } from './feedback/feedback';
import { Parceiros } from './parceiros/parceiros';
import { Sobre } from './sobre/sobre';
import { Planos } from './planos/planos';
import { DashboardUsuarioComponent } from './dashboard-usuario/dashboard-usuario';
import { RoadMapsUsuarioComponent } from './roadmaps-usuario/roadmaps-usuario';
import { MeusCursosComponent } from './meus-cursos/meus-cursos';
import { RankComponent } from './rank/rank';
import { QuizzesComponent } from './quizzes/quizzes';
import { CursosComponent } from './cursos/cursos';
import { ControleComponent } from './AdminFuncoes/controle/controle';
import { UsuariosComponent } from './AdminFuncoes/usuarios/usuarios';
import { SuporteComponent } from './suporte/suporte';
import { PerfilComponent } from './perfil/perfil';
import { EmpresaComponent } from './AdminFuncoes/configuracoes/configuracoes';
import { SuporteEmpresaComponent } from './AdminFuncoes/adminsup/adminsup';


export const routes: Routes = [
{ path: '', redirectTo: '/login', pathMatch: 'full' },
{ path: 'login', component: Login},
{ path: 'cadastro', component: Cadastro},
{ path: 'quizscreen', component: Quizscreen},
{ path: 'home', component: Home},
{ path: 'feedback', component: Feedback},
{ path: 'parceiros', component: Parceiros},
{ path: 'sobre', component: Sobre},
{ path: 'planos', component: Planos},
{path: 'dashboard', component: DashboardUsuarioComponent },
{path: 'roadmaps', component: RoadMapsUsuarioComponent},
{path: 'meus', component: MeusCursosComponent},
{path: 'rank', component: RankComponent},
{path: 'quizzes', component: QuizzesComponent},
{path: 'controle', component: ControleComponent},
{path: 'cursos', component: CursosComponent},
{path: 'usuarios', component: UsuariosComponent},
{path: 'suporte', component: SuporteComponent},
{path: 'perfil', component: PerfilComponent},
{path: 'configuracoes', component: EmpresaComponent},
{path: 'adminsup', component: SuporteEmpresaComponent },
];

