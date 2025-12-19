import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tag, RotateCcw } from 'lucide-react';
import { useWishlist, CATEGORIES } from '../hooks/useWishlist';
import { toast } from 'sonner';
import { useI18n } from '../i18n/I18nContext';

const Completed = () => {
    const { items, isLoading, toggleWishStatus } = useWishlist();
    const { t } = useI18n();

    const completedItems = items.filter(item => item.status === 'completed');

    const getCategoryColor = (catId: string) => {
        return CATEGORIES.find(c => c.id === catId)?.color || 'gray';
    };

    const getCategoryLabel = (catId: string) => {
        return CATEGORIES.find(c => c.id === catId)?.label || catId;
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleWishStatus(id);
            toast.success(t('wishRestored'));
        } catch (error) {
            toast.error(t('errorUpdating'));
        }
    };

    return (
        <Layout>
            <div className="container">
                {/* Header Section */}
                <div style={{
                    paddingTop: '3rem',
                    paddingBottom: '2rem'
                }}>
                    {/* Info card */}
                    <div style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.5rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        marginBottom: '2rem',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            color: 'hsl(var(--color-text-muted))',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            letterSpacing: '0.02em'
                        }}>
                            {isLoading ? t('loading') : `${completedItems.length} ${completedItems.length === 1 ? t('completedWish') : t('completedWishes')} ✨`}
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <p className="text-muted">{t('loading')}</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                        gap: 'clamp(1rem, 3vw, 2rem)'
                    }}>
                        <AnimatePresence>
                            {completedItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    layout
                                >
                                    <Card hoverEffect style={{
                                        padding: '1.75rem',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        background: 'linear-gradient(to bottom right, #ffffff, #fafafa)',
                                        border: '1px solid rgba(0,0,0,0.06)',
                                        position: 'relative',
                                        overflow: 'visible',
                                        opacity: 0.85
                                    }}>
                                        {/* Category badge */}
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            alignSelf: 'flex-start',
                                            background: `${getCategoryColor(item.category)}10`,
                                            padding: '0.4rem 0.9rem',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: getCategoryColor(item.category),
                                            border: `1.5px solid ${getCategoryColor(item.category)}30`,
                                            marginBottom: '1.25rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            <Tag size={14} />
                                            {getCategoryLabel(item.category)}
                                        </div>

                                        {/* Title */}
                                        <h3 style={{
                                            fontSize: '1.35rem',
                                            fontWeight: 700,
                                            marginBottom: '0.75rem',
                                            color: 'var(--color-text-muted)',
                                            lineHeight: 1.3,
                                            textDecoration: 'line-through'
                                        }}>
                                            {item.title}
                                        </h3>

                                        {/* Description */}
                                        {item.description && (
                                            <p style={{
                                                fontSize: '0.925rem',
                                                color: 'var(--color-text-muted)',
                                                marginBottom: '1.25rem',
                                                lineHeight: 1.6,
                                                flex: 1
                                            }}>
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Action button */}
                                        <div style={{
                                            marginTop: 'auto',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid rgba(0,0,0,0.06)'
                                        }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                style={{
                                                    width: '100%',
                                                    color: 'hsl(var(--color-text-muted))',
                                                    borderColor: '#6b728020',
                                                    background: '#6b728008',
                                                    fontWeight: 600
                                                }}
                                                onClick={() => handleToggleStatus(item.id)}
                                                leftIcon={<RotateCcw size={16} />}
                                            >
                                                {t('restore')}
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {completedItems.length === 0 && (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '4rem',
                                background: 'white',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px dashed #e5e7eb'
                            }}>
                                <p style={{ color: 'var(--color-text-muted)' }}>Nenhum desejo realizado ainda.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Completed;
