```
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ExternalLink, Tag, Link as LinkIcon, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import { useWishlist, CATEGORIES } from '../hooks/useWishlist';
import type { Category, WishlistItem } from '../hooks/useWishlist';
import { toast } from 'sonner';
import { EditWishModal } from '../components/wishlist/EditWishModal';
import { useI18n } from '../i18n/I18nContext';
import styles from './Wishlist.module.css';

const Wishlist = () => {
    const { items, isLoading, toggleWishStatus, deleteWish } = useWishlist();
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
    const { t } = useI18n();
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string | null; itemTitle: string }>({
        isOpen: false,
        itemId: null,
        itemTitle: ''
    });
    const [editItem, setEditItem] = useState<WishlistItem | null>(null);

    const filteredItems = items.filter(item => {
        const isPending = item.status === 'pending';
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return isPending && matchesCategory;
    });

    const getCategoryColor = (catId: string) => {
        return CATEGORIES.find(c => c.id === catId)?.color || 'gray';
    };

    const getCategoryLabel = (catId: string) => {
        return CATEGORIES.find(c => c.id === catId)?.label || catId;
    };

    const handleDeleteClick = (id: string, title: string) => {
        setDeleteConfirm({ isOpen: true, itemId: id, itemTitle: title });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.itemId) return;

        try {
            await deleteWish(deleteConfirm.itemId);
            toast.success(t('wishDeleted'));
            setDeleteConfirm({ isOpen: false, itemId: null, itemTitle: '' });
        } catch (error) {
            toast.error(t('errorDeleting'));
        }
    };

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleWishStatus(id);
            toast.success(t('wishCompleted'));
        } catch (error) {
            toast.error(t('errorUpdating'));
        }
    };

    return (
        <Layout>
            <div className="container">
                {/* Header Section */}
                <div
                    className={styles['wishlist-header']}
                    style={{
                        paddingTop: '3rem',
                        paddingBottom: '2rem'
                    }}
                >
                    {/* Category Filter - Minimalist Design */}
                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        padding: '0.75rem 0',
                        marginBottom: '1.5rem',
                    }}
                        className="category-scroll-container"
                    >
                        <button
                            onClick={() => setSelectedCategory('all')}
                            style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: '100px',
                                border: selectedCategory === 'all' ? 'none' : '1.5px solid #e5e7eb',
                                background: selectedCategory === 'all' ? 'hsl(var(--color-primary))' : 'white',
                                color: selectedCategory === 'all' ? 'white' : '#6b7280',
                                fontSize: '0.875rem',
                                fontWeight: selectedCategory === 'all' ? 600 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                boxShadow: selectedCategory === 'all' ? '0 2px 8px rgba(220, 38, 38, 0.2)' : 'none'
                            }}
                        >
                            {t('allCategories')}
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '100px',
                                    border: selectedCategory === cat.id ? 'none' : '1.5px solid #e5e7eb',
                                    background: selectedCategory === cat.id ? cat.color : 'white',
                                    color: selectedCategory === cat.id ? 'white' : '#6b7280',
                                    fontSize: '0.875rem',
                                    fontWeight: selectedCategory === cat.id ? 600 : 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0,
                                    boxShadow: selectedCategory === cat.id ? `0 2px 8px ${ cat.color } 33` : 'none'
                                }}
                            >
                                {t(cat.label as any)}
                            </button>
                        ))}
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
                            {filteredItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
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
                                        overflow: 'visible'
                                    }}>
                                        {/* Category badge */}
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            alignSelf: 'flex-start',
                                            background: `${ getCategoryColor(item.category) } 10`,
                                            padding: '0.4rem 0.9rem',
                                            borderRadius: 'var(--radius-full)',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: getCategoryColor(item.category),
                                            border: `1.5px solid ${ getCategoryColor(item.category) } 30`,
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
                                            color: 'var(--color-text)',
                                            lineHeight: 1.3
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

                                        {/* Link */}
                                        {item.link && (
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                fontSize: '0.85rem',
                                                color: 'hsl(var(--color-primary))',
                                                marginBottom: '1.5rem',
                                                textDecoration: 'none',
                                                fontWeight: 500,
                                                transition: 'all 0.2s',
                                                width: 'fit-content'
                                            }}>
                                                <LinkIcon size={14} />
                                                <span style={{
                                                    maxWidth: '200px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {(() => {
                                                        try {
                                                            return new URL(item.link).hostname;
                                                        } catch {
                                                            return item.link;
                                                        }
                                                    })()}
                                                </span>
                                            </a>
                                        )}

                                        {/* Action buttons */}
                                        <div style={{
                                            marginTop: 'auto',
                                            display: 'flex',
                                            gap: '0.75rem',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid rgba(0,0,0,0.06)'
                                        }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                style={{
                                                    flex: 1,
                                                    color: 'hsl(var(--color-text))',
                                                    borderColor: '#1f293720',
                                                    background: '#1f293708',
                                                    fontWeight: 600
                                                }}
                                                onClick={() => handleToggleStatus(item.id)}
                                                leftIcon={<CheckCircle size={16} />}
                                            >
                                                {t('complete')}
                                            </Button>

                                            {item.link && (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ flex: 1 }}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        style={{
                                                            width: '100%',
                                                            fontWeight: 600
                                                        }}
                                                        rightIcon={<ExternalLink size={14} />}
                                                    >
                                                        {t('view')}
                                                    </Button>
                                                </a>
                                            )}
                                        </div>


                                        {/* Edit and Delete buttons */}
                                        <div style={{ paddingTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                style={{
                                                    flex: 1,
                                                    color: 'hsl(var(--color-text-muted))',
                                                    borderColor: '#6b728020',
                                                    background: '#6b728008',
                                                    fontWeight: 600
                                                }}
                                                onClick={() => setEditItem(item)}
                                                leftIcon={<Edit2 size={16} />}
                                            >
                                                {t('edit')}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                style={{
                                                    flex: 1,
                                                    color: '#dc2626',
                                                    borderColor: '#dc262620',
                                                    background: '#dc262608',
                                                    fontWeight: 600
                                                }}
                                                onClick={() => handleDeleteClick(item.id, item.title)}
                                                leftIcon={<Trash2 size={16} />}
                                            >
                                                {t('delete')}
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredItems.length === 0 && !isLoading && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                                {t('noWishesFound')}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, itemId: null, itemTitle: '' })}
                title={t('confirmDelete')}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <p style={{ fontSize: '1rem', color: 'hsl(var(--color-text))' }}>
                        {t('confirmDeleteMessage')} "<strong>{deleteConfirm.itemTitle}</strong>"?
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteConfirm({ isOpen: false, itemId: null, itemTitle: '' })}
                            style={{ flex: 1 }}
                        >
                            {t('cancel')}
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleDeleteConfirm}
                            style={{ flex: 1, background: '#dc2626' }}
                        >
                            {t('delete')}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Edit Modal */}
            {editItem && (
                <EditWishModal
                    isOpen={true}
                    onClose={() => setEditItem(null)}
                    item={editItem}
                />
            )}
        </Layout>
    );
};

export default Wishlist;
