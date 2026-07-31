import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "site", "dist");
const port = Number(process.env.PORT || 4173);
const base = "/csharp-learn-with-ai/";
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8" };

createServer(async (request, response) => {
  try {
    let pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
    if (pathname === "/") { response.writeHead(302, { Location: base }); response.end(); return; }
    if (!pathname.startsWith(base)) throw new Error("outside base path");
    let relative = decodeURIComponent(pathname.slice(base.length));
    let target = path.resolve(root, relative || "index.html");
    if (!target.startsWith(root)) throw new Error("invalid path");
    if ((await stat(target)).isDirectory()) target = path.join(target, "index.html");
    const body = await readFile(target);
    response.writeHead(200, { "Content-Type": types[path.extname(target)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(await readFile(path.join(root, "404.html")));
  }
}).listen(port, "127.0.0.1", () => console.log(`Course site: http://127.0.0.1:${port}${base}`));

