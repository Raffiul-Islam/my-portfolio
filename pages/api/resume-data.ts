import { readFile } from "node:fs/promises";
import path from "node:path";
import type { NextApiRequest, NextApiResponse } from "next";

type ResumeDataResponse =
  | { data: string }
  | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResumeDataResponse>,
) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  const variant = request.query.variant ?? "corporate";
  if (variant !== "corporate" && variant !== "software-farm") {
    response.status(400).json({ error: "Invalid resume variant." });
    return;
  }

  try {
    const filename = variant === "corporate"
      ? "Resume_Raffiul_Islam_With_Photo.pdf"
      : "Resume_Raffiul_Islam_Without_Photo.pdf";
    const filePath = path.join(process.cwd(), "public", filename);
    const file = await readFile(filePath);

    response.setHeader("Cache-Control", "no-store");
    response.status(200).json({ data: file.toString("base64") });
  } catch {
    response.status(500).json({ error: "Unable to read the resume PDF." });
  }
}
