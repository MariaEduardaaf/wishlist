import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useWishlistUI } from '../../context/WishlistUIContext';
import { LanguageSelector } from '../ui/LanguageSelector';
import { useI18n } from '../../i18n/I18nContext';
import styles from './Header.module.css';

export const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const { openAddModal } = useWishlistUI();
    const { t } = useI18n();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`container ${styles.container}`}>
                <div className={styles.logo}>
                    <Heart className={styles.logoIcon} size={24} fill="currentColor" />
                    <span>Wishlist</span>
                </div>

                <nav className={styles.nav}>
                    <NavLink to="/" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                        {t('home')}
                    </NavLink>
                    <NavLink to="/wishlist" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                        {t('wishlist')}
                    </NavLink>
                    <NavLink to="/realizados" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
                        {t('completed')}
                    </NavLink>
                </nav>

                <div className={styles.actions}>
                    <LanguageSelector />
                    <Button variant="primary" size="sm" onClick={openAddModal}>{t('newWish')}</Button>
                </div>
            </div>
        </motion.header>
    );
};
