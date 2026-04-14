import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerService } from '../core/services/customer.service';
import { Customer } from '../core/models/customer.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit, OnDestroy {
  totalCustomers: number = 0;
  upcomingDeliveries: Customer[] = [];
  private sub: Subscription = new Subscription();

  constructor(private customerService: CustomerService) { }

  ngOnInit() {
    this.sub = this.customerService.customers$.subscribe(customers => {
      this.totalCustomers = customers.length;

      const now = new Date();
      this.upcomingDeliveries = customers
        .filter(c => new Date(c.deliveryDate) >= now)
        .sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime())
        .slice(0, 3); // Get next 3 upcoming
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
