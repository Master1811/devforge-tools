// Singleton Web Worker manager for heavy transforms
// Keeps UI at 60fps by offloading CPU-intensive work

let worker: Worker | null = null;
let idCounter = 0;
const pending = new Map<string, { resolve: (v: unknown) => void; reject: (e: Error) => void; timer: ReturnType<typeof setTimeout> }>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL("../workers/transform.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<{ id: string; result: unknown; error: string | null }>) => {
      const { id, result, error } = e.data;
      const p = pending.get(id);
      if (p) {
        clearTimeout(p.timer);
        pending.delete(id);
        if (error) p.reject(new Error(error));
        else p.resolve(result);
      }
    };
    worker.onerror = (e) => {
      console.error("Worker error:", e);
    };
  }
  return worker;
}

export function runInWorker<T>(task: { type: string; payload: unknown }): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = String(++idCounter);
    const timer = setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        reject(new Error("Worker timeout"));
      }
    }, 30000);
    pending.set(id, { resolve: resolve as (v: unknown) => void, reject, timer });
    getWorker().postMessage({ id, task });
  });
}

export function terminateWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
    pending.clear();
  }
}
