import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { config } from "../config.js";
import type { Bug, Severity } from "../types.js";

const ENDPOINT = "https://api.linear.app/graphql";

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: config.linearApiKey },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new Error("Linear GraphQL: " + json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) throw new Error("Linear GraphQL: empty response");
  return json.data;
}

// Severity -> Linear priority (1 Urgent, 2 High, 3 Normal, 4 Low).
const PRIORITY: Record<Severity, number> = { blocker: 1, high: 2, medium: 3, low: 4 };

// Brand-ish label colors (see packages/theme).
const LABEL_COLOR: Record<string, string> = {
  "qa-bot": "#c2f53f",
  blocker: "#ff5c52",
  high: "#ffb547",
  medium: "#7e9a2e",
  low: "#8a9a93",
};

const labelCache = new Map<string, string>();

/** Find or create a team label; returns its id (or undefined if it can't be resolved). */
async function ensureLabel(name: string): Promise<string | undefined> {
  if (labelCache.has(name)) return labelCache.get(name);
  try {
    const data = await gql<{ team: { labels: { nodes: { id: string; name: string }[] } } }>(
      `query($id:String!){ team(id:$id){ labels(first:250){ nodes{ id name } } } }`,
      { id: config.linearTeamId },
    );
    const found = data.team.labels.nodes.find((l) => l.name.toLowerCase() === name.toLowerCase());
    if (found) {
      labelCache.set(name, found.id);
      return found.id;
    }
    const created = await gql<{ issueLabelCreate: { issueLabel: { id: string } } }>(
      `mutation($in:IssueLabelCreateInput!){ issueLabelCreate(input:$in){ issueLabel{ id } } }`,
      { in: { name, color: LABEL_COLOR[name] ?? "#8a9a93", teamId: config.linearTeamId } },
    );
    const id = created.issueLabelCreate.issueLabel.id;
    labelCache.set(name, id);
    return id;
  } catch (e) {
    console.warn(`   (label "${name}" skipped: ${e instanceof Error ? e.message : e})`);
    return undefined;
  }
}

/** Upload a PNG to Linear's asset store and return the embeddable asset URL. */
async function uploadScreenshot(path: string): Promise<string | undefined> {
  try {
    const bytes = await readFile(path);
    const data = await gql<{
      fileUpload: {
        success: boolean;
        uploadFile: { uploadUrl: string; assetUrl: string; headers: { key: string; value: string }[] };
      };
    }>(
      `mutation($ct:String!,$fn:String!,$sz:Int!){
        fileUpload(contentType:$ct, filename:$fn, size:$sz){
          success uploadFile{ uploadUrl assetUrl headers{ key value } }
        }
      }`,
      { ct: "image/png", fn: basename(path), sz: bytes.byteLength },
    );
    const uf = data.fileUpload.uploadFile;
    const headers: Record<string, string> = { "Content-Type": "image/png" };
    for (const h of uf.headers) headers[h.key] = h.value;
    const put = await fetch(uf.uploadUrl, { method: "PUT", headers, body: bytes });
    if (!put.ok) throw new Error(`upload PUT ${put.status}`);
    return uf.assetUrl;
  } catch (e) {
    console.warn(`   (screenshot upload skipped: ${e instanceof Error ? e.message : e})`);
    return undefined;
  }
}

export interface CreatedIssue {
  identifier: string;
  url: string;
}

export async function createBugIssue(bug: Bug): Promise<CreatedIssue> {
  const labelIds = (await Promise.all([ensureLabel("qa-bot"), ensureLabel(bug.severity)])).filter(
    Boolean,
  ) as string[];

  let imageMd = "";
  if (bug.screenshotPath) {
    const asset = await uploadScreenshot(bug.screenshotPath);
    if (asset) imageMd = `\n\n![screenshot](${asset})`;
  }

  const description =
    `${bug.detail}\n\n` +
    `---\n` +
    `- **Check:** \`${bug.check}\`\n` +
    `- **Severity:** ${bug.severity}\n` +
    `- **URL:** ${bug.url}\n` +
    (bug.viewport ? `- **Viewport:** ${bug.viewport}\n` : "") +
    `- **Found:** ${new Date().toISOString()}\n` +
    `\n_Filed automatically by the SIGNAL QA agent._` +
    imageMd;

  const data = await gql<{ issueCreate: { issue: { identifier: string; url: string } } }>(
    `mutation($in:IssueCreateInput!){ issueCreate(input:$in){ issue{ identifier url } } }`,
    {
      in: {
        teamId: config.linearTeamId,
        title: `[QA] ${bug.title}`,
        description,
        priority: PRIORITY[bug.severity],
        labelIds,
      },
    },
  );
  return data.issueCreate.issue;
}
