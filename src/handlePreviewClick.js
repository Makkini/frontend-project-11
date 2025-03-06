import { Modal } from 'bootstrap';

const handlePreviewClick = (watchedState, postId) => {
  const post = watchedState.posts.find((p) => p.id === postId);

  if (post) {
    if (!watchedState.readPostIds.includes(postId)) {
      watchedState.readPostIds.push(postId);
    }

    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    const fullArticleLink = document.querySelector('.full-article');

    modalTitle.textContent = post.title;
    modalBody.textContent = post.description;
    fullArticleLink.href = post.link;

    const modalElement = document.getElementById('modal');
    const modal = new Modal(modalElement);
    modal.show();
  }
};

export default handlePreviewClick;
