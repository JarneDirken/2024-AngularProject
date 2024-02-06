import { Currency } from "./Currency";

export interface Cost {
    id: number;
    amount: number;
    currency: Currency;
}