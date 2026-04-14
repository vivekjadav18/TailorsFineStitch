import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Dashboard } from './dashboard/dashboard';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'dashboard', component: Dashboard },
  {
    path: 'customers',
    loadChildren: () => import('./customers/customers-module').then((m) => m.CustomersModule),
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
