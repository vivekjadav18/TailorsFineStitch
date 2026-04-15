import { Component, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerForm } from '../../../customers/customer-form/customer-form';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isMobileMenuOpen = signal(false);

  constructor(private dialog: MatDialog) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((value) => !value);
  }

  openCustomerForm(): void {
    this.closeMobileMenu();
    this.dialog.open(CustomerForm, {
      width: '100%',
      maxWidth: '800px',
      data: {}
    });
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
