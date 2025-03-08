import axios from 'axios';

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

const parseRss = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('errors.invalidRss');
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

export { parseRss, fetchRss };
