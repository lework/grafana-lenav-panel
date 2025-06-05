import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zh from './locales/zh.json';

const getGrafanaLocale = (): string => {
  try {
    const grafanaBootData = (window as any).grafanaBootData;
    if (grafanaBootData && grafanaBootData.user && grafanaBootData.user.language) {
      console.log('grafanaBootData.user', grafanaBootData.user);
      const language = grafanaBootData.user.language;
      if (language.startsWith('zh')) {
        return 'zh';
      }
      return 'en';
    }
    
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.startsWith('zh')) {
      return 'zh';
    }
    return 'en';
  } catch (error) {
    console.warn('Failed to get Grafana locale, using browser default:', error);
    // 回退到浏览器语言
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.startsWith('zh')) {
      return 'zh';
    }
    return 'en';
  }
};

// 面板选项国际化辅助函数
// 由于面板选项在插件初始化时定义，我们需要同步获取翻译文本
export const getPanelOptionsText = () => {
  const currentLang = getGrafanaLocale();
  const translations = currentLang === 'zh' ? zh : en;
  
  return {
    category: translations.panelOptions.category,
    showLinkIcon: translations.panelOptions.showLinkIcon.name,
    showGroupName: translations.panelOptions.showGroupName.name,
    navTitleSize: {
      name: translations.panelOptions.navTitleSize.name,
      description: translations.panelOptions.navTitleSize.description,
    },
    navWidth: {
      name: translations.panelOptions.navWidth.name,
      placeholder: translations.panelOptions.navWidth.placeholder,
    },
    navTheme: {
      name: translations.panelOptions.navTheme.name,
      default: translations.panelOptions.navTheme.options.default,
      box: translations.panelOptions.navTheme.options.box,
    },
    navData: translations.panelOptions.navData.name,
  };
};

// 初始化i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      zh: {
        translation: zh,
      },
    },
    lng: getGrafanaLocale(), // 使用Grafana的语言设置
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // 语言检测配置
    detection: {
      // 检测顺序：查询参数 -> localStorage -> navigator
      order: ['querystring', 'localStorage', 'navigator'],
      // 缓存用户选择的语言
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // React已经转义了
    },
  });

export default i18n; 
