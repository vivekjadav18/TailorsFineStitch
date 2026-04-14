import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private readonly storageKey = 'tailors_customers';
    private customersSubject = new BehaviorSubject<Customer[]>(this.loadFromStorage());
    public customers$ = this.customersSubject.asObservable();

    constructor() {
        // Add mock data if empty
        const current = this.loadFromStorage();
        if (current.length === 0) {
            this.populateMockData();
        }
    }

    private loadFromStorage(): Customer[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    private saveToStorage(customers: Customer[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(customers));
        this.customersSubject.next(customers);
    }

    getCustomers(): Observable<Customer[]> {
        return this.customers$;
    }

    getCustomerById(id: string): Customer | undefined {
        return this.customersSubject.value.find(c => c.id === id);
    }

    addCustomer(customer: Omit<Customer, 'id'>): void {
        const newCustomer: Customer = {
            ...customer,
            id: crypto.randomUUID()
        };
        const updated = [...this.customersSubject.value, newCustomer];
        this.saveToStorage(updated);
    }

    updateCustomer(id: string, updates: Partial<Customer>): void {
        const updated = this.customersSubject.value.map(c =>
            c.id === id ? { ...c, ...updates } : c
        );
        this.saveToStorage(updated);
    }

    deleteCustomer(id: string): void {
        const updated = this.customersSubject.value.filter(c => c.id !== id);
        this.saveToStorage(updated);
    }

    private populateMockData() {
        const mockCustomers: Customer[] = [
            {
                id: crypto.randomUUID(),
                name: 'John Doe',
                phoneNumber: '123-456-7890',
                address: '123 Fashion St, NY',
                measurements: {
                    chest: 42,
                    waist: 34,
                    length: 30,
                    shoulder: 18,
                    additionalInfo: 'Slim fit preferences'
                },
                deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                notes: 'Needs it for a wedding ceremony.',
                photos: []
            },
            {
                id: crypto.randomUUID(),
                name: 'Jane Smith',
                phoneNumber: '987-654-3210',
                address: '456 Style Ave, CA',
                measurements: {
                    length: 40,
                    waist: 28,
                },
                deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                notes: 'Alteration on the hem only.',
                photos: []
            }
        ];
        this.saveToStorage(mockCustomers);
    }
}
