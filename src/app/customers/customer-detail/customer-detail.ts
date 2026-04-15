import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/customer.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CustomerForm } from '../customer-form/customer-form';

@Component({
  selector: 'app-customer-detail',
  standalone: false,
  templateUrl: './customer-detail.html',
  styleUrls: ['./customer-detail.css']
})
export class CustomerDetail implements OnInit {
  customer: Customer | undefined;
  countdownDays: number = 0;
  countdownText: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.customer = this.customerService.getCustomerById(id);
      if (this.customer) {
        this.calculateCountdown();
      } else {
        this.router.navigate(['/customers']);
      }
    }
  }

  calculateCountdown() {
    if (!this.customer) return;
    const now = new Date().getTime();
    const delivery = new Date(this.customer.deliveryDate).getTime();
    const diffTime = delivery - now;
    this.countdownDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (this.countdownDays > 0) {
      this.countdownText = `${this.countdownDays} Days Remaining`;
    } else if (this.countdownDays === 0) {
      this.countdownText = 'Due Today!';
    } else {
      this.countdownText = `Overdue by ${Math.abs(this.countdownDays)} Days`;
    }
  }

  deleteCustomer() {
    if (this.customer && confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(this.customer.id);
      this.snackBar.open('Customer deleted successfully', 'Close', { duration: 3000 });
      this.router.navigate(['/customers']);
    }
  }

  editCustomer() {
    if (!this.customer) return;
    const dialogRef = this.dialog.open(CustomerForm, {
      width: '100%',
      maxWidth: '800px',
      data: { id: this.customer.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.customer) { // Updated if saved
        this.customer = this.customerService.getCustomerById(this.customer.id);
        if (this.customer) {
            this.calculateCountdown();
        }
      }
    });
  }
}
