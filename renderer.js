// filepath: /home/ed/Desktop/Repos/snap-asana-master/renderer.js
const { ipcRenderer } = require("electron");

ipcRenderer.on("auth-code-received", (event, authCode) => {
  console.log("Authentication code received:", authCode);
  // Use the auth code to complete the OAuth flow
});