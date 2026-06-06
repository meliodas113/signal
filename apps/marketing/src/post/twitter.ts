import { readFile } from "node:fs/promises";
import { TwitterApi } from "twitter-api-v2";
import { config, hasTwitter } from "../config.js";

export interface PostOutcome {
  tweet_id: string;
  url: string;
  with_image: boolean;
}

/**
 * The Publisher. Posts a tweet with an attached image via the X API.
 *
 * Note on tiers: media upload runs through v1.1 media/upload, which on the
 * FREE tier is often unavailable. If image upload fails we fall back to a
 * text-only tweet rather than skipping the slot, and report which happened.
 */
export async function publish(opts: {
  text: string;
  imagePath: string;
  altText: string;
}): Promise<PostOutcome> {
  if (!hasTwitter()) {
    throw new Error("X credentials missing — set X_API_KEY/SECRET and X_ACCESS_TOKEN/SECRET in .env");
  }

  const client = new TwitterApi({
    appKey: config.x.apiKey,
    appSecret: config.x.apiSecret,
    accessToken: config.x.accessToken,
    accessSecret: config.x.accessSecret,
  });
  const rw = client.readWrite;

  let mediaId: string | undefined;
  try {
    const buf = await readFile(opts.imagePath);
    mediaId = await rw.v1.uploadMedia(buf, { mimeType: "image/png" });
    if (mediaId) {
      try {
        await rw.v1.createMediaMetadata(mediaId, { alt_text: { text: opts.altText.slice(0, 1000) } });
      } catch {
        /* alt text is best-effort */
      }
    }
  } catch (err) {
    console.warn(
      `[publish] media upload failed (likely free-tier limitation) — posting text only. ${
        (err as Error).message
      }`,
    );
    mediaId = undefined;
  }

  const res = await rw.v2.tweet(
    opts.text,
    mediaId ? { media: { media_ids: [mediaId] } } : undefined,
  );

  const id = res.data.id;
  const handle = config.handle || "i";
  return {
    tweet_id: id,
    url: `https://x.com/${handle}/status/${id}`,
    with_image: Boolean(mediaId),
  };
}
