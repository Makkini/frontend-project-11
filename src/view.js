import onChange from 'on-change';
import i18next from './i18n.js';

const handleProcessState = (elements, processState, feedback) => {
  switch (processState) {
    case 'sending':
      elements.submitButton.disabled = true;
      feedback.textContent = i18next.t('messages.loading');
      feedback.classList.remove('text-danger', 'text-success');
      feedback.classList.add('text-info');
      break;
    case 'sent':
      elements.urlInput.value = '';
      elements.urlInput.focus();
      feedback.textContent = i18next.t('messages.loaded');
      feedback.classList.remove('text-info', 'text-danger');
      feedback.classList.add('text-success');
      elements.submitButton.disabled = false;
      break;
    case 'error':
      elements.submitButton.disabled = false;
      feedback.classList.remove('text-info', 'text-success');
      feedback.classList.add('text-danger');
      break;
    case 'filling':
      elements.submitButton.disabled = false;
      feedback.textContent = '';
      feedback.classList.remove('text-info', 'text-danger', 'text-success');
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const renderError = (feedback, error) => {
  if (error) {
    feedback.textContent = error;
    feedback.classList.remove('text-info', 'text-success');
    feedback.classList.add('text-danger');
  } else {
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
  }
};

export default (state, elements) => {
  return onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        handleProcessState(elements, value, elements.feedback);
        break;
      case 'form.error':
        renderError(elements.feedback, value);
        break;
      default:
        break;
    }
  });
};