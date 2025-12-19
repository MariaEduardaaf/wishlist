import { useI18n } from '../../i18n/I18nContext';
import type { Language } from '../../i18n/translations';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
    const { language, setLanguage } = useI18n();

    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'pt', label: 'Português', flag: '🇧🇷' },
        { code: 'es', label: 'Español', flag: '🇪🇸' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    ];

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                style={{
                    padding: '0.5rem 2.5rem 0.5rem 2.5rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid #e5e7eb',
                    background: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    appearance: 'none',
                    outline: 'none',
                    transition: 'all 0.2s',
                }}
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.label}
                    </option>
                ))}
            </select>
            <Globe
                size={16}
                style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280',
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
};
