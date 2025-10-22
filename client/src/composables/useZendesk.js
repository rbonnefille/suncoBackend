import {
  useGetToken,
  useGetSessionAuth,
  checkZendeskLoaded,
} from '@/composables/helpers';
import { useShowWarningToast } from '@/composables/helpers';

export const useInitZDWidget = async (snippetId, key) => {
  const zeScript = document.createElement('script');
  zeScript.id = snippetId;
  zeScript.src = `https://static.zdassets.com/ekr/snippet.js?key=${key}`;
  zeScript.async = true;
  document.body.appendChild(zeScript);
};

export const useLoginUserZDWidget = async userAuthJWT => {
  await checkZendeskLoaded();
  window.zE(
    'messenger',
    'loginUser',
    async callback => {
      try {
        const { token: sessionToken, external_id: sessionExternalId } =
          useGetSessionAuth();
        if (sessionToken && sessionExternalId) {
          callback(sessionToken);
          console.log('Login successful');
          window.zE('messenger', 'open');
          return;
        }
        // const userAuthJWT = {
        //   external_id: 'm-scott',
        //   name: 'Michael Scott',
        //   email: 'michael-scott@example.com',
        // };
        const { token } = await useGetToken(userAuthJWT);
        callback(token); // Call the callback with the new JWT token
        console.log('Login successful');
        window.zE('messenger', 'open');
      } catch (error) {
        console.error('Failed to fetch new JWT:', error);
        // Handle the error, similar to the original loginCallback
        const { type, reason, message } = error;
        console.log(`Error: ${type} - ${reason} - ${message}`);
        useShowWarningToast(`Error: ${type} - ${reason} - ${message}`, 5000);
      }
    },
    function loginCallback(error) {
      if (error) {
        // Example error handling
        const { type, reason, message } = error;
        console.log(`Error: ${type} - ${reason} - ${message}`);
        useShowWarningToast(`Error: ${type} - ${reason} - ${message}`, 5000);
      }
    },
  );
};
