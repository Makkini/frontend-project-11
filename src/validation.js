import * as yup from 'yup';

const validateUrl = (url, feeds) => {
  yup.setLocale({
    string: {
      url: 'errors.url',
      required: 'errors.required',
    },
    mixed: {
      notOneOf: 'errors.notOneOf',
    },
  });

  const schema = yup.string()
    .required()
    .url()
    .notOneOf(feeds);
  return schema.validate(url);
};

export default validateUrl;
