import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-form',
  standalone: false,
  templateUrl: './customer-form.html',
  styleUrls: ['./customer-form.css']
})
export class CustomerForm implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  customerId: string | null = null;
  photos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9\\-\\+\\s\\(\\)]*$')]],
      address: ['', Validators.required],
      deliveryDate: ['', Validators.required],
      notes: [''],
      measurements: this.fb.group({
        chest: [null],
        waist: [null],
        length: [null],
        shoulder: [null],
        additionalInfo: ['']
      })
    });
  }

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.isEditMode = true;
      const customer = this.customerService.getCustomerById(this.customerId);
      if (customer) {
        this.customerForm.patchValue({
          name: customer.name,
          phoneNumber: customer.phoneNumber,
          address: customer.address,
          deliveryDate: new Date(customer.deliveryDate),
          notes: customer.notes,
          measurements: customer.measurements
        });
        this.photos = customer.photos || [];
      } else {
        this.router.navigate(['/customers']);
      }
    }
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photos.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removePhoto(index: number) {
    this.photos.splice(index, 1);
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;
      const customerData = {
        ...formValue,
        deliveryDate: formValue.deliveryDate.toISOString(),
        photos: this.photos
      };

      if (this.isEditMode && this.customerId) {
        this.customerService.updateCustomer(this.customerId, customerData);
        this.snackBar.open('Customer updated successfully!', 'Close', { duration: 3000 });
      } else {
        this.customerService.addCustomer(customerData);
        this.snackBar.open('Customer added successfully!', 'Close', { duration: 3000 });
      }
      this.router.navigate(['/customers']);
    } else {
      this.customerForm.markAllAsTouched();
    }
  }
}
