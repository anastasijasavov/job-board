import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'apps/client-user/src/app/pages/home/home.component';
import { NavigationComponent } from './pages/navigation/navigation.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CompanyComponent } from './pages/company/company.component';
import { PostingComponent } from './pages/posting/posting.component';
import { SearchComponent } from './pages/search/search.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: NavigationComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'user/:id', component: UserComponent },
      { path: 'company/:id', component: CompanyComponent },
      { path: 'posting/:id', component: PostingComponent },
      { path: 'search', component: SearchComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '**',
    redirectTo: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
