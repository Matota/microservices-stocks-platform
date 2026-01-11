export interface UserPayload {
    id: string;
    email: string;
}

export interface Stock {
    id: string;
    symbol: string;
    name: string;
}

export interface Quote {
    symbol: string;
    price: number;
    timestamp: Date;
}

export interface Trade {
    id: string;
    userId: string;
    symbol: string;
    shares: number; // positive for buy, negative for sell
    price: number;
    timestamp: Date;
}

export interface PortfolioItem {
    symbol: string;
    shares: number;
}
