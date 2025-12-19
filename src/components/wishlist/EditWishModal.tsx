import { useState } from 'react';
import { useWishlist, CATEGORIES, type Category, type WishlistItem } from '../../hooks/useWishlist';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { AlertCircle } from 'lucide-react';
import styles from '../ui/Input.module.css';
import { toast } from 'sonner';
import { useI18n } from '../../i18n/I18nContext';

interface EditWishModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: WishlistItem;
}

interface FormErrors {
    title?: string;
    link?: string;
    category?: string;
}

export const EditWishModal = ({ isOpen, onClose, item }: EditWishModalProps) => {
    const { updateWish } = useWishlist();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const { t } = useI18n();

    const [formData, setFormData] = useState({
        title: item.title,
        category: item.category as Category,
        link: item.link || '',
        description: item.description || ''
    });

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validate title
        if (!formData.title.trim()) {
            newErrors.title = t('titleRequired');
        } else if (formData.title.trim().length < 3) {
            newErrors.title = t('titleMinLength');
        } else if (formData.title.trim().length > 100) {
            newErrors.title = t('titleMaxLength');
        }

        // Validate link (if provided)
        if (formData.link.trim()) {
            try {
                const url = new URL(formData.link);
                if (!url.protocol.startsWith('http')) {
                    newErrors.link = t('linkMustStartHttp');
                }
            } catch {
                newErrors.link = t('invalidLink');
            }
        }

        // Validate category
        if (!formData.category) {
            newErrors.category = t('selectCategory');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validate form
        if (!validateForm()) {
            toast.error(t('fixErrors'));
            return;
        }

        setIsLoading(true);

        try {
            await updateWish(item.id, {
                title: formData.title.trim(),
                link: formData.link.trim(),
                description: formData.description.trim(),
                category: formData.category
            });

            toast.success(t('wishUpdated'));
            onClose();
        } catch (error) {
            console.error('Failed to update wish:', error);
            toast.error(t('errorUpdating'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('editWish')}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Title Input */}
                <div>
                    <label className={styles.label}>
                        <span>{t('title')} *</span>
                    </label>
                    <Input
                        type="text"
                        placeholder={t('titlePlaceholder')}
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={errors.title ? styles.inputError : ''}
                        disabled={isLoading}
                        maxLength={100}
                    />
                    {errors.title && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#dc2626',
                            fontSize: '0.875rem'
                        }}>
                            <AlertCircle size={14} />
                            <span>{errors.title}</span>
                        </div>
                    )}
                </div>

                {/* Category Select */}
                <div>
                    <label className={styles.label}>
                        <span>{t('category')} *</span>
                    </label>
                    <select
                        className={styles.input}
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value as Category)}
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: errors.category ? '2px solid #dc2626' : '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {t(cat.label as any)}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#dc2626',
                            fontSize: '0.875rem'
                        }}>
                            <AlertCircle size={14} />
                            <span>{errors.category}</span>
                        </div>
                    )}
                </div>

                {/* Link Input */}
                <div>
                    <label className={styles.label}>
                        <span>{t('productLink')}</span>
                    </label>
                    <Input
                        type="url"
                        placeholder={t('linkPlaceholder')}
                        value={formData.link}
                        onChange={(e) => handleInputChange('link', e.target.value)}
                        className={errors.link ? styles.inputError : ''}
                        disabled={isLoading}
                    />
                    {errors.link && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#dc2626',
                            fontSize: '0.875rem'
                        }}>
                            <AlertCircle size={14} />
                            <span>{errors.link}</span>
                        </div>
                    )}
                </div>

                {/* Description Textarea */}
                <div>
                    <label className={styles.label}>
                        <span>{t('description')}</span>
                    </label>
                    <textarea
                        className={styles.input}
                        placeholder={t('descriptionPlaceholder')}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        disabled={isLoading}
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            minHeight: '100px'
                        }}
                    />
                </div>

                {/* Form Actions */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        style={{ flex: 1 }}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        style={{ flex: 1 }}
                    >
                        {isLoading ? t('saving') : t('save')}
                    </Button>
                </div>

                <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                    textAlign: 'center',
                    marginTop: '-0.5rem'
                }}>
                    {t('requiredFields')}
                </p>
            </form>
        </Modal>
    );
};
