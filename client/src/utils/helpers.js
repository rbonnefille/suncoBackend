import { useUserStore } from "@/stores/store";

export const getToken = async (userData) => {
  const response = await fetch("/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    window.alert(`HTTP error! status: ${response.status}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const setSessionAuth = (external_id, token) => {
  clearSessionAuth();
  window.sessionStorage.setItem(
    "suncoWidgetAuth",
    JSON.stringify({ external_id, token })
  );
};

export const clearSessionAuth = () => {
  window.sessionStorage.removeItem("suncoWidgetAuth");
};

export const getSessionAuth = () => {
  return JSON.parse(window.sessionStorage.getItem("suncoWidgetAuth"));
};

export const clearBrowserStorage = () => {
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
    "https://cdn2.thecatapi.com/images/1be.jpg",
    "https://cdn2.thecatapi.com/images/7g4.jpg",
    "https://cdn2.thecatapi.com/images/9tc.jpg",
    "https://cdn2.thecatapi.com/images/a3u.jpg",
    "https://cdn2.thecatapi.com/images/alc.gif",
    "https://cdn2.thecatapi.com/images/bca.jpg",
    "https://cdn2.thecatapi.com/images/cgr.jpg",
    "https://cdn2.thecatapi.com/images/ddb.jpg",
    "https://cdn2.thecatapi.com/images/_np7TW9Iq.jpg",
    "https://cdn2.thecatapi.com/images/9K-Lvmafl.jpg",
  ],
};

export const getRandomImageUrl = () => {
  const randomIndex = Math.floor(Math.random() * catImgUrls.mediaUrls.length);
  return catImgUrls.mediaUrls[randomIndex];
};
