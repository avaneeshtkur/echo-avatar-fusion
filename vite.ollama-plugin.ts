import type { Plugin } from "vite";
import { spawn } from "node:child_process";

const DEFAULT_IMAGE_MODEL = "x/z-image-turbo";

async function fetchOllamaTags(): Promise<string[]> {
  try {
    const res = await fetch("http://127.0.0.1:11434/api/tags");
    if (!res.ok) return [];
    const data = (await res.json()) as { models?: { name: string }[] };
    return (data.models ?? []).map((m) => m.name);
  } catch {
    return [];
  }
}

function isImageModel(name: string): boolean {
  return /flux|z-image|stable-diffusion|sdxl|dall|image/i.test(name) || name.startsWith("x/");
}

export function ollamaLocalPlugin(): Plugin {
  let pullInProgress = false;

  return {
    name: "ollama-local",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/local/")) {
          next();
          return;
        }

        if (req.url === "/api/local/ollama-status") {
          const models = await fetchOllamaTags();
          const imageModels = models.filter(isImageModel);
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              running: models.length > 0,
              models,
              imageModels,
              hasImageModel: imageModels.length > 0,
              recommendedModel: DEFAULT_IMAGE_MODEL,
              pullInProgress,
            })
          );
          return;
        }

        if (req.url === "/api/local/ollama-pull" && req.method === "POST") {
          if (pullInProgress) {
            res.statusCode = 409;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: false, error: "Pull already in progress" }));
            return;
          }

          pullInProgress = true;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, message: `Pulling ${DEFAULT_IMAGE_MODEL}…` }));

          const proc = spawn("ollama", ["pull", DEFAULT_IMAGE_MODEL], {
            stdio: "inherit",
          });
          proc.on("close", (code) => {
            pullInProgress = false;
            console.log(
              code === 0
                ? `[ollama] ${DEFAULT_IMAGE_MODEL} ready for image generation`
                : `[ollama] pull failed with code ${code}`
            );
          });
          return;
        }

        next();
      });
    },
  };
}
