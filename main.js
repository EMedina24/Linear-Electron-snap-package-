const { app, BrowserWindow, shell, ipcMain } = require("electron");
const { URL } = require("url");

let mainWindow;

const CLIENT_ID = "1081610536782-8f4l5ldd0tlalp958337s5sh56gng99a.apps.googleusercontent.com";
const REDIRECT_URI = "myapp://callback";
const AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile`;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.maximize();
  mainWindow.loadURL("https://linear.app/login");

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://accounts.google.com")) {
      // Open Google authentication in the default system browser
      shell.openExternal(AUTH_URL);
      return { action: "deny" }; // Prevent the main window from handling it
    } else if (!url.startsWith("https://linear.app/")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
});

// Handle custom protocol for authentication callback
app.on("open-url", (event, url) => {
  event.preventDefault();

  // Parse the URL to extract query parameters (e.g., tokens)
  const parsedUrl = new URL(url);
  const authCode = parsedUrl.searchParams.get("code");

  if (authCode) {
    console.log("Authentication code received:", authCode);
    // Send the auth code to the renderer process or handle it here
    mainWindow.webContents.send("auth-code-received", authCode);
  }
});

// Ensure the app is the default protocol handler for "myapp://"
app.whenReady().then(() => {
  if (!app.isDefaultProtocolClient("myapp")) {
    app.setAsDefaultProtocolClient("myapp");
  }
});

// Quit the app when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    app.emit("ready");
  }
});