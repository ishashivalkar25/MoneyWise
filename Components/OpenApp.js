import{
    Platform,
    Linking
  } from 'react-native';
  
  export const openOnDevice = async (url, { appName, appStoreId, appStoreLocale, playStoreId }) => {
    Linking.openURL(url).catch(err => {
      if (err.code === 'EUNSPECIFIED') {
        if (Platform.OS === 'ios') {
          const locale = typeof appStoreLocale === 'undefined' ? 'br' : appStoreLocale;
          Linking.openURL(`https://itunes.apple.com/${locale}/app/${appName}/id${appStoreId}`);
        } else {
          Linking.openURL(`https://play.google.com/store/apps/details?id=${playStoreId}`);
        }
      } else {
        throw new Error(`Could not open ${appName}. ${err.toString()}`);
      }
    });
  };
  
  export const openInStore = async ({ appName, appStoreId, appStoreLocale = 'br', playStoreId }) => {
    if (Platform.OS === 'ios') {
      Linking.openURL(`https://itunes.apple.com/${appStoreLocale}/app/${appName}/id${appStoreId}`);
    } else {
      Linking.openURL(`https://play.google.com/store/apps/details?id=${playStoreId}`);
    }
  };