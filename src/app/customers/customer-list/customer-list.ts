import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/customer.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CustomerForm } from '../customer-form/customer-form';

@Component({
  selector: 'app-customer-list',
  standalone: false,
  templateUrl: './customer-list.html',
  styleUrls: ['./customer-list.css']
})
export class CustomerList implements OnInit, OnDestroy {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm: string = '';

  private sub: Subscription = new Subscription();

  constructor(private customerService: CustomerService, private dialog: MatDialog) { }

  ngOnInit() {
    this.sub = this.customerService.customers$.subscribe(data => {
      this.customers = data;
      this.applyFilter();
    });
  }

  openCustomerForm(id?: string) {
    const dialogRef = this.dialog.open(CustomerForm, {
      width: '100%',
      maxWidth: '800px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle result if necessary
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  applyFilter() {
    let result = this.customers;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.phoneNumber.includes(term)
      );
    }

    // Sort by delivery date ascending by default
    this.filteredCustomers = result.sort((a, b) =>
      new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime()
    );
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilter();
  }
}
