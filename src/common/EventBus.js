// EventBus.js

const eventBus = {
  // Subscribe to an event
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },

  // Dispatch an event with some data
  dispatch(event, data) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },

  // Remove a listener for an event
  remove(event, callback) {
    document.removeEventListener(event, callback);
  },
};

export default eventBus;
