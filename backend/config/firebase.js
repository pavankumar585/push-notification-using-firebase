const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "push-notification-ef1e9",
  private_key_id: process.env.FIRE_BASE_PRIVATE_KEY_ID,
  private_key: process.env.FIRE_BASE_PRIVATE_KEY,
  client_email:"firebase-adminsdk-51zhx@push-notification-ef1e9.iam.gserviceaccount.com",
  client_id: "102177002949320242666",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-51zhx%40push-notification-ef1e9.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

async function sendNotification(body, tokens) {
  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };

  const notification = {
    title: body.title,
    body: body.message
  };

  try {
    await admin.messaging().sendEachForMulticast({ tokens, notification }, options);
  } catch (error) {
    console.log("Error sending notification: ", error);
  }
}

module.exports.sendNotification = sendNotification;
