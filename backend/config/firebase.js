const fcm = require("fcm-notification");

const firebase_config = {
  type: "service_account",
  project_id: "push-notification-ef1e9",
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email:"firebase-adminsdk-51zhx@push-notification-ef1e9.iam.gserviceaccount.com",
  client_id: "102177002949320242666",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-51zhx%40push-notification-ef1e9.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const FCM = new fcm(firebase_config);

function sendFcm(body, tokens) {
  const message = {
    notification: {
      title: body.title,
      body: body.message,
    },
  };

  FCM.sendToMultipleToken(message, tokens, (err, res) => {
    if (err) console.log("fcm error: ", err);
    else console.log("fcm response: ", res);
  });
}

module.exports.sendFcm = sendFcm;
