import validateUrl from './validation.js';
import view from './view.js';

const initApp = () => {
  const state = {
    form: {
      processState: 'filling',
      error: null,
    },
    feeds: [],
  };

  const elements = {
    urlInput: document.getElementById('url-input'),
    feedback: document.querySelector('.feedback'),
    form: document.querySelector('.rss-form'),
    submitButton: document.querySelector('button[type="submit"]'),
  };

  const watchedState = view(state, elements);

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('url').trim();

    try {
      watchedState.form.processState = 'sending';
      await validateUrl(url, watchedState.feeds);
      watchedState.form.error = null;
      watchedState.feeds.push(url);
      watchedState.form.processState = 'sent';
    } catch (err) {
      watchedState.form.error = err.message;
      watchedState.form.processState = 'error';
    }
  });
};

export default initApp;