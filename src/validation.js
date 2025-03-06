import * as yup from 'yup';
import i18next from './i18n.js';

yup.setLocale({
  string: {
    url: i18next.t('errors.url'),
    required: i18next.t('errors.required'),
  },
  mixed: {
    notOneOf: i18next.t('errors.notOneOf'),
  },
});

const validateUrl = (url, feeds) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(feeds);
  return schema.validate(url);
};

export default validateUrl;
