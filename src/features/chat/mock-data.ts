import type { UIMessage } from "ai";

export const mockMessages: UIMessage[] = [
  {
    id: "msg_001",
    role: "system",
    parts: [
      {
        type: "text",
        text: `You are **Atlas**, a senior full-stack engineering assistant.

## Guidelines

- Prefer TypeScript over JavaScript in all examples
- Use GitHub-flavored markdown for formatting
- Always wrap code in fenced blocks with a language tag
- Be concise, but thorough when the topic demands it

> **Note:** If you're unsure about something, say so rather than guessing.`,
      },
    ],
  },
  {
    id: "msg_002",
    role: "user",
    parts: [
      {
        type: "text",
        text: `Hey! I'm building a **React + Node** app and want to add real-time updates. What are my options? I've heard of WebSockets and SSE but I'm not sure when to use which.`,
      },
    ],
  },
  {
    id: "msg_003",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: `Great question! There are three main approaches, and the right one depends on your data flow. Let me break it down.

## The Options

| Approach | Direction | Protocol | Auto-reconnect | Best for |
| --- | :---: | --- | :---: | --- |
| **WebSockets** | Bidirectional | \`ws://\` / \`wss://\` | ❌ (manual) | Chat, games, collaboration |
| **Server-Sent Events** | Server → Client | HTTP | ✅ | Feeds, notifications, LLM streaming |
| **Long polling** | Simulated push | HTTP | ✅ | Legacy environments |

## Quick Decision Guide

1. **Does the client need to send lots of messages back?**
   - Yes → use **WebSockets**
   - No → continue to step 2
2. **Is it a one-way stream from server to client?**
   - Yes → use **SSE** (simpler, works over plain HTTP)
3. **Are you stuck behind an ancient proxy?**
   - Yes → fall back to **long polling**

### A Minimal SSE Example

Here's a bare-bones server using Express:

\`\`\`ts
import express from "express";

const app = express();

app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  let counter = 0;
  const interval = setInterval(() => {
    res.write(\`data: \${JSON.stringify({ tick: counter++ })}\\n\\n\`);
  }, 1000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});

app.listen(3000, () => console.log("Listening on :3000"));
\`\`\`

And the client side, using the built-in \`EventSource\`:

\`\`\`tsx
import { useEffect, useState } from "react";

export function useTicker() {
  const [tick, setTick] = useState<number | null>(null);

  useEffect(() => {
    const source = new EventSource("/events");

    source.onmessage = (event) => {
      const payload = JSON.parse(event.data) as { tick: number };
      setTick(payload.tick);
    };

    source.onerror = () => {
      console.warn("SSE connection lost, browser will retry...");
    };

    return () => source.close();
  }, []);

  return tick;
}
\`\`\`

> **Tip:** \`EventSource\` handles reconnection for you, including sending the \`Last-Event-ID\` header so the server can resume from where it left off.

Want me to show the WebSocket version too?`,
      },
    ],
  },
  {
    id: "msg_004",
    role: "user",
    parts: [
      {
        type: "text",
        text: `Yes please! Also, I'll need auth on the socket connection. How do I handle that?`,
      },
    ],
  },
  {
    id: "msg_005",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: `Auth on WebSockets is a classic gotcha, because the browser \`WebSocket\` API **doesn't let you set custom headers**. Here are the common patterns:

- **Query string token** — easy, but tokens can end up in server logs ⚠️
- **Cookie-based auth** — works automatically if same-origin
- **First-message auth** — connect, then send \`{ type: "auth", token }\` as the first frame
- **Ticket pattern** — exchange your JWT for a short-lived, single-use ticket via HTTP, then connect with that

The **ticket pattern** is my recommendation. Let's implement it.

### Server (using \`ws\`)

\`\`\`ts
import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "node:crypto";
import type { IncomingMessage } from "node:http";

type Ticket = { userId: string; expiresAt: number };
const tickets = new Map<string, Ticket>();

// Called from an authenticated HTTP endpoint
export function issueTicket(userId: string): string {
  const ticket = randomUUID();
  tickets.set(ticket, { userId, expiresAt: Date.now() + 30_000 });
  return ticket;
}

function consumeTicket(ticket: string | null): string | null {
  if (!ticket) return null;
  const entry = tickets.get(ticket);
  tickets.delete(ticket); // single-use
  if (!entry || entry.expiresAt < Date.now()) return null;
  return entry.userId;
}

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket: WebSocket, req: IncomingMessage) => {
  const url = new URL(req.url ?? "", "http://localhost");
  const userId = consumeTicket(url.searchParams.get("ticket"));

  if (!userId) {
    socket.close(4401, "Unauthorized");
    return;
  }

  console.log(\`User \${userId} connected\`);

  socket.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    // broadcast to everyone else
    for (const client of wss.clients) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ from: userId, ...msg }));
      }
    }
  });
});
\`\`\`

### Client hook with reconnection

Unlike SSE, you have to build reconnection yourself. Here's a hook with exponential backoff:

\`\`\`tsx
import { useCallback, useEffect, useRef, useState } from "react";

type Status = "connecting" | "open" | "closed";

export function useSocket(url: string, getTicket: () => Promise<string>) {
  const [status, setStatus] = useState<Status>("connecting");
  const socketRef = useRef<WebSocket | null>(null);
  const attemptRef = useRef(0);

  const connect = useCallback(async () => {
    setStatus("connecting");
    const ticket = await getTicket();
    const ws = new WebSocket(\`\${url}?ticket=\${ticket}\`);
    socketRef.current = ws;

    ws.onopen = () => {
      attemptRef.current = 0;
      setStatus("open");
    };

    ws.onclose = () => {
      setStatus("closed");
      const delay = Math.min(1000 * 2 ** attemptRef.current++, 30_000);
      setTimeout(connect, delay);
    };
  }, [url, getTicket]);

  useEffect(() => {
    connect();
    return () => socketRef.current?.close();
  }, [connect]);

  const send = useCallback((data: unknown) => {
    socketRef.current?.send(JSON.stringify(data));
  }, []);

  return { status, send };
}
\`\`\`

Here's the overall flow:

\`\`\`mermaid
sequenceDiagram
    participant C as Client
    participant A as HTTP API
    participant W as WS Server
    C->>A: POST /ws-ticket (with JWT)
    A-->>C: { ticket }
    C->>W: Connect ws://...?ticket=abc
    W->>W: Validate & consume ticket
    W-->>C: Connection accepted
\`\`\`

Let me know if you want to add **rooms** or **presence** next!`,
      },
    ],
  },
  {
    id: "msg_006",
    role: "user",
    parts: [
      {
        type: "text",
        text: `This is super helpful. Now unrelated: I have a Python script that's really slow. Can you review it?

\`\`\`python
def find_duplicates(items):
    dupes = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j] and items[i] not in dupes:
                dupes.append(items[i])
    return dupes
\`\`\`

It takes forever on lists with 100k+ items.`,
      },
    ],
  },
  {
    id: "msg_007",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: `I can see why! Let's analyze it.

## Complexity Analysis

Your current implementation has:

- **Nested loops** → \`O(n²)\` comparisons
- **\`items[i] not in dupes\`** → another \`O(k)\` scan per match, where \`k\` is the number of duplicates found

For 100,000 items, that's roughly **5 billion comparisons**. 🐌

## The Fix

Use a \`set\` for \`O(1)\` average lookups:

\`\`\`python
def find_duplicates(items):
    seen = set()
    dupes = set()
    for item in items:
        if item in seen:
            dupes.add(item)
        else:
            seen.add(item)
    return list(dupes)
\`\`\`

Or, if you want something more idiomatic, use \`collections.Counter\`:

\`\`\`python
from collections import Counter

def find_duplicates(items):
    return [item for item, count in Counter(items).items() if count > 1]
\`\`\`

### Diff

\`\`\`diff
- def find_duplicates(items):
-     dupes = []
-     for i in range(len(items)):
-         for j in range(i + 1, len(items)):
-             if items[i] == items[j] and items[i] not in dupes:
-                 dupes.append(items[i])
-     return dupes
+ from collections import Counter
+
+ def find_duplicates(items):
+     return [item for item, count in Counter(items).items() if count > 1]
\`\`\`

## Benchmarks

| Input size | Original | \`set\` version | \`Counter\` version |
| ---: | ---: | ---: | ---: |
| 1,000 | 12 ms | 0.1 ms | 0.2 ms |
| 10,000 | 1.2 s | 1 ms | 2 ms |
| 100,000 | ~2 min | 11 ms | 18 ms |
| 1,000,000 | 🔥 | 120 ms | 190 ms |

*Timings are illustrative, so run your own with \`timeit\`.*

## Caveats

- Items must be **hashable**. If you have lists or dicts, convert them first (e.g. \`tuple(item)\` or \`json.dumps(item, sort_keys=True)\`).
- The result order isn't guaranteed with the \`set\` version. If order matters, use a \`dict\` instead, since dicts preserve insertion order in Python 3.7+.

Anything else you'd like me to look at?`,
      },
    ],
  },
  {
    id: "msg_008",
    role: "user",
    parts: [
      {
        type: "text",
        text: `Nice. Can you give me a checklist for shipping my app to production? And maybe a Dockerfile and a quick bash script for deploying?`,
      },
    ],
  },
  {
    id: "msg_009",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: `Absolutely. Here's a production readiness checklist, followed by the Docker and deploy pieces.

# 🚀 Production Readiness Checklist

## Security

- [x] HTTPS enforced everywhere
- [x] Secrets stored in a secrets manager (not in \`.env\` files in git!)
- [x] Dependencies audited with \`npm audit\`
- [ ] Rate limiting on public endpoints
- [ ] CORS locked down to known origins
- [ ] CSP headers configured

## Reliability

- [x] Health check endpoint (\`/healthz\`)
- [ ] Graceful shutdown on \`SIGTERM\`
- [ ] Database connection pooling
- [ ] Retry logic with backoff for external calls
  - [ ] Idempotency keys for payment operations
  - [ ] Circuit breaker for flaky third parties

## Observability

- [x] Structured JSON logging
- [ ] Error tracking (Sentry or similar)
- [ ] Metrics dashboard
  - [ ] p50 / p95 / p99 latency
  - [ ] Error rate
  - [ ] Saturation (CPU, memory, connections)
- [ ] Alerting with on-call rotation

---

## Dockerfile

A multi-stage build keeps the final image small:

\`\`\`dockerfile
# ---- Build stage ----
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build && pnpm prune --prod

# ---- Runtime stage ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/package.json ./

USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget -qO- http://localhost:3000/healthz || exit 1

CMD ["node", "dist/server.js"]
\`\`\`

## Deploy script

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

IMAGE="registry.example.com/my-app"
TAG="$(git rev-parse --short HEAD)"

echo "🔨 Building $IMAGE:$TAG"
docker build -t "$IMAGE:$TAG" -t "$IMAGE:latest" .

echo "📦 Pushing..."
docker push "$IMAGE:$TAG"
docker push "$IMAGE:latest"

echo "🚢 Deploying to production"
ssh deploy@prod.example.com <<EOF
  docker pull $IMAGE:$TAG
  docker stop my-app || true
  docker rm my-app || true
  docker run -d \\
    --name my-app \\
    --restart unless-stopped \\
    -p 3000:3000 \\
    --env-file /etc/my-app/env \\
    $IMAGE:$TAG
EOF

echo "✅ Deployed $TAG"
\`\`\`

### A Few Notes

1. The \`set -euo pipefail\` line makes the script **fail fast** on errors, unset variables, and broken pipes.
2. In a real setup, prefer **zero-downtime** strategies (blue/green or rolling) over \`stop && run\`.
3. Consider Kubernetes, Fly.io, or Railway if you outgrow a single host.[^1]

[^1]: For a small app, a single VPS with Docker Compose is often plenty. Don't over-engineer early.

Want a \`docker-compose.yml\` with Postgres and Redis next?`,
      },
    ],
  },
  {
    id: "msg_010",
    role: "user",
    parts: [
      {
        type: "text",
        text: `Last one: can you explain how to type a generic \`useFetch\` hook in TypeScript? Also what's the difference between \`interface\` and \`type\`?`,
      },
    ],
  },
  {
    id: "msg_011",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: `Two great TypeScript questions. I'll start with the hook, then cover \`interface\` vs \`type\`.

## Generic \`useFetch\`

The trick is to model the request state as a **discriminated union**, so consumers can't access \`data\` unless the status is \`"success"\`:

\`\`\`ts
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export function useFetch<T>(url: string | null): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ status: "idle" });

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    setState({ status: "loading" });

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json() as Promise<T>;
      })
      .then((data) => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setState({
          status: "error",
          error: error instanceof Error ? error : new Error(String(error)),
        });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}
\`\`\`

Usage with full type narrowing:

\`\`\`tsx
interface User {
  id: number;
  name: string;
  email: string;
}

function Profile({ id }: { id: number }) {
  const state = useFetch<User>(\`/api/users/\${id}\`);

  switch (state.status) {
    case "idle":
    case "loading":
      return <Spinner />;
    case "error":
      return <p role="alert">{state.error.message}</p>;
    case "success":
      // \`state.data\` is fully typed as \`User\` here ✨
      return <h1>{state.data.name}</h1>;
  }
}
\`\`\`

## \`interface\` vs \`type\`

They overlap a lot, but they're not identical:

| Feature | \`interface\` | \`type\` |
| --- | :---: | :---: |
| Object shapes | ✅ | ✅ |
| Extending | \`extends\` | \`&\` intersection |
| Declaration merging | ✅ | ❌ |
| Unions | ❌ | ✅ |
| Primitives / tuples | ❌ | ✅ |
| Mapped / conditional types | ❌ | ✅ |
| \`implements\` in classes | ✅ | ✅ (object types only) |

### Declaration merging

\`\`\`ts
interface Window {
  analytics: { track(event: string): void };
}

// Elsewhere in your codebase, this *merges* rather than conflicts:
interface Window {
  featureFlags: Record<string, boolean>;
}

window.analytics.track("page_view"); // ✅
window.featureFlags["beta"];         // ✅
\`\`\`

### Things only \`type\` can do

\`\`\`ts
type ID = string | number;                       // union
type Point = [x: number, y: number];             // tuple
type Getters<T> = {                              // mapped type
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
type ApiResponse<T> = T extends Array<infer U>   // conditional type
  ? { items: U[]; total: number }
  : { item: T };
\`\`\`

### My rule of thumb

> Use \`interface\` for **public object shapes** that others might extend (libraries, component props). Use \`type\` for **everything else** (unions, utilities, and derived types). Above all, be consistent within your codebase.

---

That covers everything you asked about. Happy building! 🎉`,
      },
    ],
  },
];
