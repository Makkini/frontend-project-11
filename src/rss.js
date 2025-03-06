import axios from 'axios';

const fetchRss = async (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;
  const response = await axios.get(proxyUrl);
  return response.data.contents;
};

const parseRss = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Ошибка парсинга RSS');
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
