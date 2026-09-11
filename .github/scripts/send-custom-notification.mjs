// Sends one ad-hoc notification, triggered manually via the
// "Send custom notification" GitHub Actions workflow (workflow_dispatch),
// not tied to a latest-updates.html card.

import admin from "firebase-admin";

const TOPICS = ["dars_e_quran", "quran_urdu_translation", "yaqeen_ka_safar", "jummah_khutbah"];

async function main() {
  const title = process.env.NOTIF_TITLE;
  const body = process.env.NOTIF_BODY;
  const topicInput = process.env.NOTIF_TOPIC;
  const url = process.env.NOTIF_URL || "https://taleemaateislam.com/";

  if (!title || !body) {
    throw new Error("title and body are required");
  }

  const topics = topicInput === "all" ? TOPICS : [topicInput];
  for (const t of topics) {
    if (!TOPICS.includes(t)) {
      throw new Error(`Unknown topic "${t}". Must be one of: ${TOPICS.join(", ")}, or "all".`);
    }
  }

  const serviceAccountJson = process.env.FCM_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error("FCM_SERVICE_ACCOUNT_JSON secret is not set");
  }
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
  });

  for (const topic of topics) {
    await admin.messaging().send({
      topic,
      notification: { title, body },
      data: { url },
      android: { notification: { channelId: "fcm_default_channel" } },
    });
    console.log(`Sent to topic "${topic}": ${title}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
