export interface Customer {
    id: string;
    name: string;
    phoneNumber: string;
    address: string;
    measurements: {
        chest?: number;
        waist?: number;
        length?: number;
        shoulder?: number;
        additionalInfo?: string; // e.g. inseam, neck, etc.
    };
    deliveryDate: string; // ISO date string
    notes?: string;
    photos?: string[]; // Array of base64 strings or URLs
}
