// types.ts

import dayjs from 'dayjs';

export class Attraction {
    id: string;
    name: string;
    cityId: number;
    theme: string;
    revenue: number;
    rating: number;
    latitude: number;
    longitude: number;
    photoPath: string;

    constructor(data: any) {
        this.id = data.id;
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
    id: string;
    attractionId: number;
    name: string;
    description: string;
    price: number;
    startDate: string;
    endDate: string;

    constructor(data: any) {
        this.id = data.id;
        this.attractionId = Number(data.attraction_id);
        this.name = data.name;
        this.description = data.description;
        this.price = parseFloat(data.price);
        this.startDate = data.start_date;
        this.endDate = data.end_date;
    }
}

export class State {
    id: number;
    name: string;

    constructor(data: any) {
        this.id = Number(data.id);
        this.name = data.name;
    }
}

export class City {
    id: number;
    name: string;

    constructor(data: any) {
        this.id = Number(data.id);
        this.name = data.name;
    }
}

export class CartItem {
    event: Event;
    quantity: number;

    constructor(event: Event, quantity: number) {
        this.event = event;
        this.quantity = quantity;
    }
}

export interface AttractionFormData {
    name: string;
    theme: string;
    revenue: number;
    rating: number;
    state: number;
    city_id: number;
    photo: null | File;
}

export interface EventFormData {
    name: string;
    description: string;
    price: number;
    startDate: dayjs.Dayjs;
    endDate: dayjs.Dayjs;
    attractionId: string;
}

export interface MapPosition {
    lat: number;
    lng: number;
}
