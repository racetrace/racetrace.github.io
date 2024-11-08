import { createContext, useContext } from "react";

export const AccountContext = createContext();

export function useAccount() {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccount must be used within an AccountProvider');
    }
    return context;
}