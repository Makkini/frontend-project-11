import axios from 'axios';
import i18next from './i18n.js';

const fetchRss = async (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;
  try {
    const response = await axios.get(proxyUrl);
    return response.data.contents;
  } catch (err) {
    if (err.isAxiosError) {
      throw new Error(i18next.t('errors.networkError'));
    }
    throw new Error(i18next.t('errors.invalidRss'));
  }
};

const parseRss = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error(i18next.t('errors.invalidRss'));
  }
  const feed = {
    title: doc.querySelector('channel > title').textContent,
    description: doc.querySelector('channel > description').textContent,
  };

  const posts = Array.from(doc.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
    description: item.querySelector('description').textContent,
  }));
  return { feed, posts };
};
export { fetchRss, parseRss };
