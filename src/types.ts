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

export class Attraction {
    id: number;
    name: string;
    city_id: number;
    theme: string;
    revenue: number;
    rating: number;
    latitude: number;
    longitude: number;
    photo_path: string;

    constructor(data: any) {
        this.id = Number(data.id);
        this.name = data.name;
        this.city_id = Number(data.city_id);
        this.theme = data.theme;
        this.revenue = parseFloat(data.revenue);
        this.rating = parseFloat(data.rating);
        this.latitude = parseFloat(data.latitude);
        this.longitude = parseFloat(data.longitude);
        this.photo_path = data.photo_path;
    }
}

export interface State {
    id: number;
    name: string;
}

export interface City {
    id: number;
    name: string;
    state_id: number;
}
