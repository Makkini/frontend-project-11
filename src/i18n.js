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
          invalidRss: 'Ресурс не содержит валидный RSS',
          networkError: 'Ошибка сети',
        },
        messages: {
          loaded: 'RSS успешно загружен',
        },
      },
    },
  },
});

export default i18next;
