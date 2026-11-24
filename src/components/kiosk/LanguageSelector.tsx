import React from 'react';
import { Globe } from 'lucide-react';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onSelectLanguage }) => {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
      <div className="px-2 text-slate-400">
        <Globe className="w-4 h-4" />
      </div>
      <div className="flex items-center gap-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelectLanguage(lang.code)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              currentLanguage === lang.code
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>{lang.flag}</span>
            <span className="hidden sm:inline">{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
