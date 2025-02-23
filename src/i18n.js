import i18next from 'i18next';

i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru: {
      translation: {
        errors: {
          required: 'Не должно быть пустым',
          url: 'Ссылка должна быть валидным URL',
          notOneOf: 'RSS уже существует',
        },
        messages: {
          loading: 'Идет загрузка...',
          loaded: 'RSS успешно загружен',
        },
      },
    },
  },
});

export default i18next;