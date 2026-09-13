import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  festivalInfo,
  initialCommitteeMembers,
  initialDonations,
  initialEvents,
  initialExpenses,
  initialGallery,
  sponsors,
  translations,
  auditLog,
  yearOptions,
  themeOptions,
  languageOptions,
} from '../data/mockData';

const AppContext = createContext(null);

async function translateText(text, targetLang) {
  if (!text || targetLang === 'en') return text;

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    if (Array.isArray(data?.[0])) {
      return data[0].map((part) => part?.[0] ?? '').join('');
    }
    return text;
  } catch (error) {
    return text;
  }
}

async function translateObject(obj, targetLang) {
  const translated = {};

  for (const [key, value] of Object.entries(obj || {})) {
    if (typeof value === 'string') {
      translated[key] = await translateText(value, targetLang);
    } else if (value && typeof value === 'object') {
      translated[key] = await translateObject(value, targetLang);
    } else {
      translated[key] = value;
    }
  }

  return translated;
}

export function AppProvider({ children }) {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [theme, setTheme] = useState(() => localStorage.getItem('ganesh-theme') || 'sunrise');
  const [language, setLanguage] = useState(() => localStorage.getItem('ganesh-language') || 'en');
  const [translatedContent, setTranslatedContent] = useState(translations.en);
  const [committeeMembers, setCommitteeMembers] = useState(initialCommitteeMembers);
  const [donations, setDonations] = useState(initialDonations);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [gallery, setGallery] = useState(initialGallery);
  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    localStorage.setItem('ganesh-theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ganesh-language', language);
  }, [language]);

  useEffect(() => {
    let active = true;

    const buildTranslations = async () => {
      if (language === 'en') {
        setTranslatedContent(translations.en);
        return;
      }

      const next = { ...translations.en };

      const keysToTranslate = [
        'login', 'donate', 'theme', 'language', 'year', 'heroTitle', 'heroKicker', 'heroBody',
        'explore', 'support', 'festivalEdition', 'sthapana', 'visarjan', 'chanda', 'expenses',
        'balance', 'donors', 'completePlatform', 'completePlatformTitle', 'ourStory', 'aboutTitle',
        'storyIntro', 'aboutBody1', 'aboutBody2', 'milestonesTitle', 'leadership', 'committeeTitle',
        'committeeIntro', 'committeeBody', 'call', 'email', 'whatsapp', 'festivalCalendar',
        'eventsTitle', 'eventsIntro', 'dailyRituals', 'aartiTimings', 'prasadSeva', 'description',
        'visarjanRoute', 'routeTitle', 'routeBody', 'supportFestival', 'donateTitle', 'donationIntro',
        'paymentDetails', 'everyContribution', 'upiId', 'phonePe', 'bank', 'account', 'ifsc',
        'qrTitle', 'qrBody', 'sponsorTiers', 'getInTouch', 'contactTitle', 'contactIntro',
        'mandalOffice', 'mandalName', 'address', 'officeHours', 'socialChannels',
        'volunteerRegistration', 'fullName', 'phoneNumber', 'registerInterest', 'exploreLabel',
        'festivalInfoLabel', 'contactLabel', 'footerDescription'
      ];

      for (const key of keysToTranslate) {
        if (typeof translations.en[key] === 'string') {
          next[key] = await translateText(translations.en[key], language);
        }
      }

      next.nav = await translateObject(translations.en.nav, language);
      next.values = await translateObject(translations.en.values, language);

      if (active) {
        setTranslatedContent(next);
      }
    };

    buildTranslations();
    return () => {
      active = false;
    };
  }, [language]);

  const value = useMemo(() => ({
    selectedYear,
    setSelectedYear,
    theme,
    setTheme,
    language,
    setLanguage,
    t: translatedContent,
    translations,
    festivalInfo,
    yearOptions,
    themeOptions,
    languageOptions,
    committeeMembers,
    setCommitteeMembers,
    donations,
    setDonations,
    expenses,
    setExpenses,
    gallery,
    setGallery,
    events,
    setEvents,
    sponsors,
    auditLog,
  }), [selectedYear, theme, language, translatedContent, committeeMembers, donations, expenses, gallery, events]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
