// Watches latest-updates.html for newly added <article class="update-card">
// entries and pushes a notification to the matching FCM topic for each one.
//
// Why this file specifically: it's already the place either the site owner
// or the daily sync workflow writes a one-line human-readable summary of
// what changed, so it doubles as notification copy with no separate
// authoring step.

import { execSync } from "node:child_process";
import admin from "firebase-admin";

const TOPIC_RULES = [
  { pattern: /dars-e-quran(-videos)?\.html/, topic: "dars_e_quran" },
  { pattern: /quran-urdu-translation\.html/, topic: "quran_urdu_translation" },
  { pattern: /yaqeen-ka-safar-shorts\.html/, topic: "yaqeen_ka_safar" },
  { pattern: /jummah-khutbah\.html/, topic: "jummah_khutbah" },
];

function topicFor(href) {
  const rule = TOPIC_RULES.find((r) => r.pattern.test(href));
  return rule ? rule.topic : null;
}

function extractCards(html) {
  const cards = [];
  const cardRe = /<article class="update-card">([\s\S]*?)<\/article>/g;
  let m;
  while ((m = cardRe.exec(html))) {
    const block = m[1];
    const title = (block.match(/<h2>([\s\S]*?)<\/h2>/) || [])[1];
    const desc = (block.match(/<p>([\s\S]*?)<\/p>/) || [])[1];
    const href = (block.match(/class="update-link" href="([^"]+)"/) || [])[1];
    if (title && href) {
      cards.push({
        title: title.replace(/<[^>]+>/g, "").trim(),
        desc: (desc || "").replace(/<[^>]+>/g, "").trim(),
        href,
      });
    }
  }
  return cards;
}

function getBeforeContent() {
  const before = process.env.GITHUB_EVENT_BEFORE;
  if (!before || /^0+$/.test(before)) return ""; // first push / new branch
  try {
    return execSync(`git show ${before}:latest-updates.html`, { encoding: "utf8" });
  } catch {
    return ""; // file/commit not found (e.g. force-push) - treat everything as new is too noisy, so skip
  }
}

async function main() {
  const afterContent = execSync("git show HEAD:latest-updates.html", { encoding: "utf8" });
  const beforeContent = getBeforeContent();

  const beforeTitles = new Set(extractCards(beforeContent).map((c) => c.title));
  const newCards = extractCards(afterContent).filter((c) => !beforeTitles.has(c.title));

  if (newCards.length === 0) {
    console.log("No new latest-updates.html cards - nothing to notify.");
    return;
  }

  const serviceAccountJson = process.env.FCM_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error("FCM_SERVICE_ACCOUNT_JSON secret is not set");
  }
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
  });

  for (const card of newCards) {
    const topic = topicFor(card.href);
    if (!topic) {
      console.log(`Skipping "${card.title}" - href "${card.href}" doesn't match a notification topic.`);
      continue;
    }
    const url = `https://taleemaateislam.com/${card.href}`;
    try {
      await admin.messaging().send({
        topic,
        notification: { title: card.title, body: card.desc || undefined },
        data: { url },
        android: { notification: { channelId: "fcm_default_channel" } },
      });
      console.log(`Sent to topic "${topic}": ${card.title}`);
    } catch (err) {
      console.error(`Failed to send to topic "${topic}" for "${card.title}":`, err.message || err);
      process.exitCode = 1;
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
