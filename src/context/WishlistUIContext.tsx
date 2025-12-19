import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { AddWishModal } from '../components/wishlist/AddWishModal';

interface WishlistUIContextType {
    isAddModalOpen: boolean;
    openAddModal: () => void;
    closeAddModal: () => void;
}

const WishlistUIContext = createContext<WishlistUIContextType | undefined>(undefined);

export const WishlistUIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    return (
        <WishlistUIContext.Provider value={{ isAddModalOpen, openAddModal, closeAddModal }}>
            {children}
            <AddWishModal isOpen={isAddModalOpen} onClose={closeAddModal} />
        </WishlistUIContext.Provider>
    );
};

export const useWishlistUI = () => {
    const context = useContext(WishlistUIContext);
    if (context === undefined) {
        throw new Error('useWishlistUI must be used within a WishlistUIProvider');
    }
    return context;
};
