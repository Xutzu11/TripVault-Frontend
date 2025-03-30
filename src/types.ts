// types.ts
export interface Exhibition {
    id: number;
    name: string;
    description: string;
    price: number;
    start_date: string;
    end_date: string;
}

export interface CartItem {
    quantity: number;
    exhibition: Exhibition;
}
