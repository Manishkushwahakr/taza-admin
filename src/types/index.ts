export type UserRoleType = 'admin' | 'seller' | 'user' | 'delivery';

export interface Profile {
    id: string;
    user_id: string;
    name: string;
    phone?: string;
    created_at: string;
    updated_at: string;
}

export interface UserRole {
    id: string;
    user_id: string;
    role: UserRoleType;
    created_at: string;
}

export interface Area {
    id: string;
    name: string;
    pincode?: string;
    is_active: boolean;
    created_at: string;
}

export interface Seller {
    id: string;
    user_id: string;
    area_id?: string;
    commission_percentage: number;
    tech_fee_type: 'fixed' | 'per_order';
    tech_fee_amount: number;
    is_active: boolean;
    created_at: string;
    Seller_name: string; // Note the capitalization from schema
    area_name?: string;
    // Joins
    profiles?: Profile;
    areas?: Area;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image_url?: string;
    created_at?: string;
    sub_categories?: string | null; // Mapped from 'sub categories'
}

export interface Product {
    id: string;
    name: string;
    unit: string;
    image_url?: string;
    categories: string;
    description?: string;
    in_stock: boolean;
    brand?: string;
    price_mrp?: number;
    price_selling?: number;
    stock?: number;
    tax_percent?: number;
    barcode?: string;
    price?: number;
    orders_last_7d: number;
    total_orders: number;
    profit_margin_percent: number;
    arrival_date?: string;
    rating_avg: number;
    priority_score: number;
    is_selling_fast: boolean;
    is_seller_editable: boolean;
    price_band_percent: number;
    created_at: string;
}

export interface ProductCategory {
    id: string;
    product_id: string;
    category_id: string;
}

export interface SellerSpecificPrice {
    id: string;
    product_id: string;
    seller_id: string;
    price: number;
    updated_at: string;
}

export interface Address {
    id: string;
    user_id: string;
    house_no: string;
    landmark?: string;
    area: string;
    pincode: string;
    is_default: boolean;
    name?: string;
    phone?: string;
    created_at: string;
}

export interface Order {
    id: string;
    order_number: string;
    user_id: string;
    address_id: string;
    delivery_slot: string;
    payment_mode: string;
    subtotal: number;
    delivery_fee: number;
    total: number;
    status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    seller_id?: string;
    area_id?: string;
    base_price_amount: number;
    seller_price_amount: number;
    commission_amount: number;
    tech_fee_amount: number;
    created_at: string;
    // Joins
    profiles?: Profile; // Customer profile
    addresses?: Address;
    sellers?: Seller;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    product_image?: string;
    price: number;
    quantity: number;
    created_at: string;
}

export interface SupportTicket {
    id: string;
    user_id?: string;
    name: string;
    phone: string;
    order_id?: string;
    issue_type: string;
    description: string;
    status: 'open' | 'closed' | 'in_progress';
    priority: 'low' | 'medium' | 'high';
    admin_notes?: string;
    created_at: string;
    updated_at: string;
}

export interface AssignedOrder {
    id: string;
    order_id: string;
    delivery_user_id: string;
    assigned_at: string;
    status: string;
}

export interface OrderPayment {
    id: string;
    order_id: string;
    amount: number;
    mode: string;
    paid: boolean;
    created_at: string;
}

export interface CallbackRequest {
    id: string;
    user_id?: string;
    name: string;
    phone: string;
    preferred_time: string;
    status: string;
    admin_notes?: string;
    created_at: string;
}

export interface SellerPayout {
    id: string;
    seller_id: string;
    total_order_amount: number;
    total_commission_amount: number;
    total_tech_fee_amount: number;
    final_payout_amount: number;
    payout_status: 'pending' | 'released';
    released_at?: string;
    created_at: string;
}

export interface Setting {
    id: string;
    key: string;
    value: string;
    description?: string;
    updated_at: string;
}
