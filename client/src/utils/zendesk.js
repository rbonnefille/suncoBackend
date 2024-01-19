export const initZDWidget = (snippetId, key) => {
  const zeScript = document.createElement("script");
  zeScript.id = snippetId;
  zeScript.src = `https://static.zdassets.com/ekr/snippet.js?key=${key}`;
  document.body.appendChild(zeScript);
};
