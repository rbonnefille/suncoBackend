import { useUserStore } from '@/stores/store';
import { useToast } from 'vue-toastification';
import { useStorage } from '@vueuse/core';
const toast = useToast();

/**
 * Checks if Zendesk Widget (zE) is loaded on the window object.
 * Polls every 100ms until the Zendesk Widget is available.
 *
 * @returns {Promise<void>} A promise that resolves when Zendesk Widget is loaded
 */
export const checkZendeskLoaded = () => {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (window.zE) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
};

/**
 * Sends a POST request to the '/auth' endpoint with the provided user data to retrieve an authentication token.
 *
 * @async
 * @function useGetToken
 * @param {Object} userData - The user data to be sent in the request body.
 * @returns {Promise<Object>} The response data parsed as JSON.
 * @throws {Error} Throws an error if the HTTP response is not ok.
 */
export const useGetToken = async userData => {
  const response = await fetch('/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    window.alert(`HTTP error! status: ${response.status}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

/**
 * Stores authentication information in sessionStorage under the key 'widgetAuth'.
 *
 * @param {string} external_id - The external identifier for the session.
 * @param {string} token - The authentication token to be stored.
 */
export const useSetSessionAuth = (external_id, token) => {
  useStorage(
    'widgetAuth',
    { external_id: external_id, token: token },
    sessionStorage,
  );
};

/**
 * Retrieves and parses the 'widgetAuth' object from sessionStorage.
 *
 * @returns {Object} The parsed authentication object from sessionStorage, or an empty object if not found.
 */
export const useGetSessionAuth = () => {
  return JSON.parse(window.sessionStorage.getItem('widgetAuth')) || {};
};

/**
 * Clears all data from localStorage and sessionStorage, resets the user store,
 * updates the authentication status to false, and logs out from Smooch.
 *
 * @function
 * @returns {void}
 */
export const useClearBrowserStorage = () => {
  const userStore = useUserStore();
  const { changeAuthenticationStatus } = useUserStore();
  localStorage.clear();
  sessionStorage.clear();
  userStore.$reset();
  changeAuthenticationStatus(false);
  window.Smooch.logout();
};

const catImgUrls = {
  mediaUrls: [
    'https://cdn2.thecatapi.com/images/1be.jpg',
    'https://cdn2.thecatapi.com/images/7g4.jpg',
    'https://cdn2.thecatapi.com/images/9tc.jpg',
    'https://cdn2.thecatapi.com/images/a3u.jpg',
    'https://cdn2.thecatapi.com/images/alc.gif',
    'https://cdn2.thecatapi.com/images/bca.jpg',
    'https://cdn2.thecatapi.com/images/cgr.jpg',
    'https://cdn2.thecatapi.com/images/ddb.jpg',
    'https://cdn2.thecatapi.com/images/_np7TW9Iq.jpg',
    'https://cdn2.thecatapi.com/images/9K-Lvmafl.jpg',
  ],
};

/**
 * Returns a random image URL from the `catImgUrls.mediaUrls` array.
 *
 * @function
 * @returns {string} A randomly selected image URL.
 */
export const useGetRandomImageUrl = () => {
  const randomIndex = Math.floor(Math.random() * catImgUrls.mediaUrls.length);
  return catImgUrls.mediaUrls[randomIndex];
};

/**
 * Displays a warning toast notification with the specified error message and timeout.
 *
 * @param {string} error - The error message to display in the toast.
 * @param {number} [timeout=3500] - Optional. Duration in milliseconds before the toast disappears. Defaults to 3500ms.
 */
export const useShowWarningToast = (error, timeout) => {
  toast.warning(error, {
    position: 'bottom-center',
    timeout: timeout || 3500,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: true,
    closeButton: 'button',
    icon: true,
    rtl: false,
  });
};

/**
 * Displays a success toast notification with the given message and optional timeout.
 *
 * @param {string} message - The message to display in the toast notification.
 * @param {number} [timeout=2000] - The duration (in milliseconds) for which the toast is visible. Defaults to 2000ms if not provided.
 */
export const useShowSuccessToast = (message, timeout) => {
  toast.success(message, {
    position: 'bottom-center',
    toastClassName: 'toast-body',
    timeout: timeout || 2000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: true,
    closeButton: 'button',
    icon: true,
    rtl: false,
  });
};

/**
 * Generates a random alphanumeric string of a specified length.
 * @param {number} [length=25] - The desired length of the ID.
 * @returns {string} The generated random external ID.
 */
export const useGenerateExternalId = (length = 25) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
