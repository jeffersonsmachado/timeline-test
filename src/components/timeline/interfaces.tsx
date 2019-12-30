type EventType = 'comprou' | 'comprou-produto';

export interface ICustomData {
    key: string;
    value: string | number;
}

export interface IEvent {
    event: EventType,
    timestamp: number,
    custom_data: Array<ICustomData>,
    revenue?: number
}

export interface IItem {
    product: string,
    price: number
}

export interface ITransaction {
    id: string;
    store: string;
    revenue: number;
    timestamp: number;
    items: Array<IItem>;
}
