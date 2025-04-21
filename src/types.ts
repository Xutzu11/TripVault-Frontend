// types.ts

export class Attraction {
    id: number;
    name: string;
    cityId: number;
    theme: string;
    revenue: number;
    rating: number;
    latitude: number;
    longitude: number;
    photoPath: string;

    constructor(data: any) {
        this.id = Number(data.id);
        this.name = data.name;
        this.cityId = Number(data.city_id);
        this.theme = data.theme;
        this.revenue = parseFloat(data.revenue);
        this.rating = parseFloat(data.rating);
        this.latitude = parseFloat(data.latitude);
        this.longitude = parseFloat(data.longitude);
        this.photoPath = data.photo_path;
    }
}

export class Event {
    id: number;
    attractionId: number;
    name: string;
    description: string;
    price: number;
    startDate: string;
    endDate: string;

    constructor(data: any) {
        this.id = Number(data.id);
        this.attractionId = Number(data.attraction_id);
        this.name = data.name;
        this.description = data.description;
        this.price = parseFloat(data.price);
        this.startDate = data.start_date;
        this.endDate = data.end_date;
    }
}

export interface State {
    id: number;
    name: string;
}

export interface City {
    id: number;
    name: string;
}

export interface CartItem {
    event: Event;
    quantity: number;
}
