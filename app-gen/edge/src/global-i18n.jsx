import I18n from 'i18next'

import {initReactI18next} from 'react-i18next'

import I18nHttpBackend from 'i18next-http-backend'

import I18nLocalStorageCache from 'i18next-localstorage-cache'

import I18nBrowserLanguageDetector from 'i18next-browser-languagedetector'

// sznui.lib.edge.global-i18n/saveOptions [14] 
export var saveOptions = {
  "saveMissing":true,
  "saveMissingTo":"current",
  "ns":["translation"],
  "defaultNS":"translation",
  "backend":{
    "loadPath":"/locals/{{lng}}/{{ns}}.json",
    "addPath":"/api/i18n/add/{{lng}}/{{ns}}"
  }
};

// sznui.lib.edge.global-i18n/__init__ [25] 
I18n.use(initReactI18next).use(I18nHttpBackend).use(I18nLocalStorageCache).use(I18nBrowserLanguageDetector).init({
  "fallbackLng":"en",
  "interpolation":{"escapeValue":false},
  "load":"languageOnly",
  "nonExplicitSupportedLngs":true,
  "lowerCaseLng":true
});

export default I18n