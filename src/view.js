import onChange from 'on-change';
import { Modal } from 'bootstrap';

const handleProcessState = (elements, processState, feedback, i18nInstance) => {
  const { submitButton, urlInput } = elements;
  const feedbackElement = feedback;

  switch (processState) {
    case 'sending':
      submitButton.disabled = true;
      feedbackElement.classList.remove('text-danger', 'text-success');
      feedbackElement.classList.add('text-info');
      break;
    case 'sent':
      urlInput.value = '';
      urlInput.focus();
      feedbackElement.textContent = i18nInstance.t('messages.loaded');
      submitButton.disabled = false;
      feedbackElement.classList.remove('text-danger', 'text-info');
      feedbackElement.classList.add('text-success');
      break;
    case 'error':
      submitButton.disabled = false;
      feedbackElement.classList.remove('text-info', 'text-success');
      feedbackElement.classList.add('text-danger');
      break;
    case 'filling':
      submitButton.disabled = false;
      feedbackElement.textContent = '';
      feedbackElement.classList.remove('text-danger', 'text-success', 'text-info');
      break;
    default:
      throw new Error(`Unhandled process state: ${processState}`);
  }
};

const renderError = (feedback, error, i18nInstance) => {
  const feedbackElement = feedback;

  if (error) {
    feedbackElement.textContent = i18nInstance.t(error);
    feedbackElement.classList.add('text-danger');
    feedbackElement.classList.remove('text-info', 'text-success');
  } else {
    feedbackElement.textContent = '';
    feedbackElement.classList.remove('text-danger');
  }
};

const renderFeeds = (feeds, container) => {
  const containerElement = container;

  const feedsHtml = feeds
    .map(
      (feed) => `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${feed.title}</h5>
          <p class="card-text">${feed.description}</p>
        </div>
      </div>
      `,
    )
    .join('');

  containerElement.innerHTML = `<h2>Фиды</h2>${feedsHtml}`;
};

const renderPosts = (posts, container, readPostIds) => {
  const containerElement = container;

  const postsHtml = posts
    .map(
      (post) => `
      <div class="card mb-3">
        <div class="card-body d-flex justify-content-between align-items-center">
          <a href="${post.link}" target="_blank" rel="noopener noreferrer" class="${readPostIds.includes(post.id) ? 'fw-normal link-secondary text-muted' : 'fw-bold'}" data-id="${post.id}">${post.title}</a>
          <button class="btn btn-primary btn-sm preview-button" data-post-id="${post.id}">Просмотр</button>
        </div>
      </div>
    `,
    )
    .join('');

  containerElement.innerHTML = `<h2>Посты</h2>${postsHtml}`;
};

const renderModal = (modalState, elements) => {
  const {
    modalTitle, modalBody, fullArticleLink, modalElement,
  } = elements;

  if (modalState.isOpen) {
    modalTitle.textContent = modalState.title;
    modalBody.textContent = modalState.description;
    fullArticleLink.href = modalState.link;

    const modal = new Modal(modalElement);
    modal.show();
  }
};

export default (state, elements, i18nInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, value, elements.feedback, i18nInstance);
      break;
    case 'form.error':
      renderError(elements.feedback, value, i18nInstance);
      break;
    case 'feeds':
      renderFeeds(value, elements.feedsContainer);
      break;
    case 'posts':
    case 'readPostIds':
      renderPosts(state.posts, elements.postsContainer, state.readPostIds);
      break;
    case 'modal':
      renderModal(value, elements);
      break;
    default:
      break;
  }
});
