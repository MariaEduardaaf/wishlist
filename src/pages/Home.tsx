import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';

import { useWishlistUI } from '../context/WishlistUIContext';
import { useI18n } from '../i18n/I18nContext';

const Home = () => {
    const { openAddModal } = useWishlistUI();
    const { t } = useI18n();

    return (
        <Layout>
            <div className="container" style={{
                minHeight: 'calc(100vh - 80px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                paddingBottom: '4rem'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: 'hsl(var(--color-secondary) / 0.5)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'var(--color-primary)',
                        marginBottom: '1.5rem'
                    }}>
                        {t('homeSubtitle')}
                    </span>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                        marginBottom: '1.5rem',
                        letterSpacing: '-0.03em',
                        color: 'var(--color-text)'
                    }}>
                        {t('homeMainTitle')}<br />
                        <span style={{ color: 'hsl(var(--color-primary))' }}>{t('homeMainTitleHighlight')}</span>
                    </h1>

                    <p style={{
                        fontSize: '1.125rem',
                        color: 'hsl(var(--color-text-muted))',
                        maxWidth: '600px',
                        margin: '0 auto 2.5rem'
                    }}>
                        {t('homeDescription')}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Button variant="primary" size="lg" onClick={openAddModal}>
                            {t('addNewWish')}
                        </Button>
                        <Link to="/wishlist">
                            <Button variant="outline" size="lg">
                                {t('viewWishlist')}
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Home;
