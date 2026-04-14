import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Customers } from './customers';

import { CustomerList } from './customer-list/customer-list';
import { CustomerForm } from './customer-form/customer-form';
import { CustomerDetail } from './customer-detail/customer-detail';

const routes: Routes = [
  {
    path: '',
    component: Customers,
    children: [
      { path: '', component: CustomerList },
      { path: 'new', component: CustomerForm },
      { path: ':id', component: CustomerDetail },
      { path: ':id/edit', component: CustomerForm }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule { }
