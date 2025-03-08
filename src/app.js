import i18next from 'i18next';
import uniqid from 'uniqid';
import { Modal } from 'bootstrap';
import ruTranslation from './locales/ru.json';
import view from './view.js';
import validateUrl from './validation.js';
import { parseRss, fetchRss } from './rss.js';
import updateFeeds from './updateFeeds.js';

const initApp = async () => {
  const i18nInstance = i18next.createInstance();
  await i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru: ruTranslation,
    },
  });

  const state = {
    form: {
      processState: 'filling',
      error: null,
    },
    feeds: [],
    posts: [],
    readPostIds: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    urlInput: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    fullArticleLink: document.querySelector('.full-article'),
  };

  const watchedState = view(state, elements, i18nInstance);

  const handlePreviewClick = (postId) => {
    const post = watchedState.posts.find((p) => p.id === postId);

    if (post) {
      if (!watchedState.readPostIds.includes(postId)) {
        watchedState.readPostIds.push(postId);
      }

      elements.modalTitle.textContent = post.title;
      elements.modalBody.textContent = post.description;
      elements.fullArticleLink.href = post.link;

      const modalElement = document.getElementById('modal');
      const modal = new Modal(modalElement);
      modal.show();
    }
  };

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();
    try {
      watchedState.form.processState = 'sending';
      await validateUrl(url, watchedState.feeds.map((feed) => feed.url));
      const data = await fetchRss(url);
      const { feed, posts } = parseRss(data);
      watchedState.feeds.unshift({ ...feed, url, id: uniqid() });
      watchedState.posts.unshift(
        ...posts.map((post) => ({ ...post, id: uniqid(), feedId: feed.id })),
      );
      watchedState.form.error = null;
      watchedState.form.processState = 'sent';
      await updateFeeds(watchedState);
    } catch (err) {
      watchedState.form.error = err.message;
      watchedState.form.processState = 'error';
    }
  });

  elements.postsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('preview-button')) {
      const { postId } = e.target.dataset;
      handlePreviewClick(postId);
    }
    if (e.target.tagName === 'A') {
      const postId = e.target.dataset.id;

      if (!watchedState.readPostIds.includes(postId)) {
        watchedState.readPostIds.push(postId);
      }
      watchedState.posts = [...watchedState.posts];
    }
  });
};

export default initApp;
