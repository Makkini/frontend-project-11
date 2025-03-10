import i18next from 'i18next';
import uniqid from 'uniqid';
import { Modal } from 'bootstrap';
import axios from 'axios';
import ruTranslation from './locales/ru.js';
import view from './view.js';
import validateUrl from './validation.js';
import parseRss from './rss.js';

const initApp = () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru: ruTranslation,
    },
  }).then(() => {
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
    const fetchRss = async (url) => {
      const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;
      try {
        const response = await axios.get(proxyUrl);
        return response.data.contents;
      } catch (err) {
        if (err.isAxiosError) {
          throw new Error('errors.networkError');
        }
        throw new Error('errors.invalidRss');
      }
    };

    const updateFeeds = () => {
      const feedUpdates = watchedState.feeds.map((feed) => fetchRss(feed.url)
        .then((data) => {
          const { posts: newPosts } = parseRss(data);

          const existingPostLinks = watchedState.posts.map((post) => post.link);
          const uniqueNewPosts = newPosts.filter(
            (post) => !existingPostLinks.includes(post.link),
          );

          if (uniqueNewPosts.length > 0) {
            watchedState.posts.unshift(
              ...uniqueNewPosts.map((post) => ({
                ...post,
                id: uniqid(),
                feedId: feed.id,
              })),
            );
          }
        })
        .catch((err) => {
          console.error('Ошибка при обновлении RSS:', err.message);
        }));

      Promise.all(feedUpdates)
        .finally(() => {
          setTimeout(() => updateFeeds(watchedState), 5000);
        });
    };

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

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url').trim();

      watchedState.form.processState = 'sending';

      validateUrl(url, watchedState.feeds.map((feed) => feed.url))
        .then(() => fetchRss(url))
        .then((data) => {
          const { feed, posts } = parseRss(data);
          watchedState.feeds.unshift({ ...feed, url, id: uniqid() });
          watchedState.posts.unshift(
            ...posts.map((post) => ({ ...post, id: uniqid(), feedId: feed.id })),
          );
          watchedState.form.error = null;
          watchedState.form.processState = 'sent';
          return updateFeeds(watchedState);
        })
        .catch((err) => {
          watchedState.form.error = err.message;
          watchedState.form.processState = 'error';
        });
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
  });
};

export default initApp;
