import { Trade, UserPayload } from './types';

export enum EventType {
    UserCreated = 'USER_CREATED',
    TradeExecuted = 'TRADE_EXECUTED',
    PriceUpdated = 'PRICE_UPDATED'
}

export interface UserCreatedEvent {
    type: EventType.UserCreated;
    data: UserPayload;
}

export interface TradeExecutedEvent {
    type: EventType.TradeExecuted;
    data: Trade;
}

export interface PriceUpdatedEvent {
    type: EventType.PriceUpdated;
    data: {
        symbol: string;
        price: number;
        timestamp: string; // ISO string for JSON serialization
    };
}

export type DomainEvent = UserCreatedEvent | TradeExecutedEvent | PriceUpdatedEvent;
