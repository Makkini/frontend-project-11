import uniqid from 'uniqid';
import { fetchRss, parseRss } from './rss.js';

const updateFeeds = async (watchedState) => {
  try {
    const feedUpdates = watchedState.feeds.map(async (feed) => {
      const data = await fetchRss(feed.url);
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
    });

    await Promise.all(feedUpdates);
  } catch (err) {
    console.error('Ошибка при обновлении RSS:', err.message);
  } finally {
    setTimeout(() => updateFeeds(watchedState), 5000);
  }
};

export default updateFeeds;
