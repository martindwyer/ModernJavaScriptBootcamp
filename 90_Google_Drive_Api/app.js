const { google } = require("googleapis");
const keys = require("./keys");
const path = require("path");
const fs = require("fs");

const CLIENT_ID = keys.client_id;
const CLIENT_SECRET = keys.client_secret;
const REDIRECT_URI = keys.redirect_uris[0];

const REFRESH_TOKEN = keys.refresh_token;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const filePath = path.join(__dirname, "store.png");

async function uploadFile() {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: "e-store.png",
        mimeType: "image/png",
      },
      media: {
        mimeType: "image/png",
        body: fs.createReadStream(filePath),
      },
    });

    console.log(response.data);
  } catch (error) {
    console.log(error.messaage);
  }
}

// uploadFile();

async function deleteFile() {
  try {
    const response = await drive.files.delete({
      fileId: "1sj2XroztVJpzp_ZdrKT_9xpQV8sYG5Xu",
    });

    console.log(response.data, response.status);
  } catch (error) {
    console.log(error.message);
  }
}

// deleteFile();

async function generatePublicUrl() {
  try {
    const fileId = "1Enimu2PSg4PvFByO5iFhwijl9bNTpcPq";
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });

    console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}

generatePublicUrl();
