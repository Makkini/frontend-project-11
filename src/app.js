import uniqid from 'uniqid';
import view from './view.js';
import validateUrl from './validation.js';
import { fetchRss, parseRss } from './rss.js';
import updateFeeds from './updateFeeds.js';
import handlePreviewClick from './handlePreviewClick.js';

const initApp = () => {
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
  };

  const watchedState = view(state, elements);

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
      handlePreviewClick(watchedState, postId);
    }
  });

  elements.postsContainer.addEventListener('click', (e) => {
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
