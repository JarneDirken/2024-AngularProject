export enum Currency {
    EUR, // Euro
    USD, // US Dollar
    GBP, // British Pound
}

export const CurrencySymbols: Record<number, string> = {
    [Currency.EUR]: "€",
    [Currency.USD]: "$",
    [Currency.GBP]: "£",
};