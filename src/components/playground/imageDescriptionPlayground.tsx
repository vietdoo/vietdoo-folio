import { createSignal, Show } from "solid-js";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.readAsDataURL(file);
  });
}

export default function ImageDescriptionPlayground() {
  const [imageData, setImageData] = createSignal("");
  const [fileName, setFileName] = createSignal("");
  const [fileSize, setFileSize] = createSignal(0);
  const [prompt, setPrompt] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [error, setError] = createSignal("");
  const [isDragging, setIsDragging] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [copied, setCopied] = createSignal(false);

  const setSelectedFile = async (file?: File) => {
    if (!file) return;
    setError("");
    setDescription("");
    setCopied(false);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please choose a PNG, JPEG, WebP, or GIF image.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError("Images must be 8 MB or smaller.");
      return;
    }

    try {
      setImageData(await readAsDataUrl(file));
      setFileName(file.name);
      setFileSize(file.size);
    } catch {
      setError("Could not read this image. Please try another file.");
    }
  };

  const handleFileInput = (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    void setSelectedFile(input.files?.[0]);
    input.value = "";
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    void setSelectedFile(event.dataTransfer?.files?.[0]);
  };

  const clearImage = () => {
    setImageData("");
    setFileName("");
    setFileSize(0);
    setDescription("");
    setError("");
    setCopied(false);
  };

  const analyzeImage = async () => {
    if (!imageData() || isLoading()) return;
    setIsLoading(true);
    setError("");
    setDescription("");
    setCopied(false);

    try {
      const response = await fetch("/api/image-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData(), prompt: prompt().trim() }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "The image could not be described.");
      }

      setDescription(payload.description || "No description was returned.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyDescription = async () => {
    if (!description()) return;
    try {
      await navigator.clipboard.writeText(description());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Clipboard access is unavailable in this browser.");
    }
  };

  return (
    <div class="w-full max-w-4xl mx-auto flex flex-col gap-6 text-darkslate-100 p-2 md:p-4 font-sans">
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-bold text-white tracking-tight">
          Image describer
        </h1>
        <p class="text-xs text-darkslate-300">
          Upload one image and get a clear description powered by
          Qwen3.8-27B-Free.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)] gap-4 items-start">
        <section class="flex flex-col gap-4 bg-darkslate-600/30 border border-darkslate-500 rounded-xl p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold text-white">Source image</h2>
              <p class="text-[11px] text-darkslate-400 mt-1">
                PNG, JPEG, WebP, or GIF up to 8 MB
              </p>
            </div>
            <Show when={imageData()}>
              <button
                type="button"
                onClick={clearImage}
                class="text-xs text-darkslate-300 hover:text-white transition-colors"
              >
                Remove
              </button>
            </Show>
          </div>

          <label
            class={`relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-5 py-6 text-center transition-colors ${
              isDragging()
                ? "border-primary-400 bg-primary-500/10"
                : "border-darkslate-400 bg-darkslate-800/70 hover:border-primary-400/80 hover:bg-darkslate-800"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept={ACCEPTED_TYPES.join(",")}
              class="sr-only"
              onChange={handleFileInput}
            />
            <Show
              when={imageData()}
              fallback={
                <>
                  <span class="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-darkslate-400 text-xl text-darkslate-200">
                    ↑
                  </span>
                  <span class="text-sm font-medium text-darkslate-100">
                    Drop an image here or browse
                  </span>
                  <span class="mt-1 text-xs text-darkslate-400">
                    The image stays in your browser until you analyze it.
                  </span>
                </>
              }
            >
              <img
                src={imageData()}
                alt={fileName() || "Selected image preview"}
                class="max-h-[250px] w-full rounded-md object-contain"
              />
            </Show>
          </label>

          <Show when={fileName()}>
            <div class="flex items-center justify-between gap-3 text-xs text-darkslate-300">
              <span class="truncate">{fileName()}</span>
              <span class="shrink-0 font-mono text-darkslate-400">
                {formatBytes(fileSize())}
              </span>
            </div>
          </Show>

          <div class="flex flex-col gap-1.5">
            <label
              for="image-description-prompt"
              class="text-xs font-semibold text-darkslate-200"
            >
              Optional instruction
            </label>
            <textarea
              id="image-description-prompt"
              rows="3"
              value={prompt()}
              onInput={(event) => setPrompt(event.currentTarget.value)}
              placeholder="For example: focus on the text in the screenshot"
              class="resize-none rounded-lg border border-darkslate-500 bg-darkslate-800 px-3 py-2 text-sm text-white placeholder:text-darkslate-500 focus:border-primary-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={analyzeImage}
            disabled={!imageData() || isLoading()}
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Show when={isLoading()} fallback="Describe image">
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Analyzing…
            </Show>
          </button>
        </section>

        <section class="min-h-[280px] rounded-xl border border-darkslate-500 bg-darkslate-600/30 p-4">
          <div class="flex items-center justify-between gap-3 border-b border-darkslate-500 pb-3">
            <div>
              <h2 class="text-sm font-semibold text-white">Description</h2>
              <p class="text-[11px] text-darkslate-400 mt-1">
                Your result will appear here.
              </p>
            </div>
            <Show when={description()}>
              <button
                type="button"
                onClick={copyDescription}
                class="rounded-md border border-darkslate-400 px-2.5 py-1 text-[11px] font-medium text-darkslate-200 transition hover:border-primary-400 hover:text-white"
              >
                {copied() ? "Copied" : "Copy"}
              </button>
            </Show>
          </div>

          <Show
            when={description()}
            fallback={
              <div class="flex min-h-[225px] items-center justify-center text-center text-xs leading-relaxed text-darkslate-400">
                <p>
                  {isLoading()
                    ? "Reading the image…"
                    : "Upload an image to get started."}
                </p>
              </div>
            }
          >
            <p class="whitespace-pre-wrap pt-4 text-sm leading-7 text-darkslate-100">
              {description()}
            </p>
          </Show>
        </section>
      </div>

      <Show when={error()}>
        <div
          role="alert"
          class="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2.5 text-xs leading-relaxed text-red-200"
        >
          {error()}
        </div>
      </Show>

      <p class="text-[11px] leading-relaxed text-darkslate-400">
        Model:{" "}
        <span class="font-mono text-darkslate-300">qwen/qwen3.8-27b-free</span>.
        Free access may be rate-limited by the provider.
      </p>
    </div>
  );
}
