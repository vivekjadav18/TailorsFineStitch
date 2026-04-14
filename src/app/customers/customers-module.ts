import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing-module';
import { Customers } from './customers';
import { CustomerList } from './customer-list/customer-list';
import { CustomerForm } from './customer-form/customer-form';
import { CustomerDetail } from './customer-detail/customer-detail';

import { SharedModule } from '../shared/shared-module';

@NgModule({
  declarations: [Customers, CustomerList, CustomerForm, CustomerDetail],
  imports: [CommonModule, CustomersRoutingModule, SharedModule],
})
export class CustomersModule { }
