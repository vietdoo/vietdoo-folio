export type SpeechLanguage = "en" | "vi";
export type SpeechPlayerState = "idle" | "playing" | "paused";

type SpeechController = {
  stop: () => void;
  destroy: () => void;
};

const MAX_CHUNK_LENGTH = 720;
const activeControllers = new Set<SpeechController>();
let globalListenersBound = false;

function getSynthesis(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  return window.speechSynthesis;
}

function getPreferredLocale(language: SpeechLanguage): string {
  return language === "vi" ? "vi-VN" : "en-US";
}

function getVoices(synthesis: SpeechSynthesis): SpeechSynthesisVoice[] {
  return synthesis.getVoices().filter((voice) => voice && voice.lang);
}

export function chooseVoice(
  voices: SpeechSynthesisVoice[],
  language: SpeechLanguage,
): SpeechSynthesisVoice | undefined {
  const preferred = getPreferredLocale(language).toLowerCase();
  const candidates = language === "vi" ? ["vi-vn", "vi"] : ["en-us", "en-gb", "en"];

  return (
    voices.find((voice) => voice.lang.toLowerCase() === preferred) ||
    voices.find((voice) => candidates.includes(voice.lang.toLowerCase())) ||
    voices.find((voice) => candidates.some((prefix) => voice.lang.toLowerCase().startsWith(prefix)))
  );
}

function sentenceUnits(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((paragraph) => paragraph.match(/[^.!?。！？]+[.!?。！？]+|[^.!?。！？]+$/g) || [])
    .map((sentence) => sentence.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function splitSpeechText(text: string, maxLength = MAX_CHUNK_LENGTH): string[] {
  const chunks: string[] = [];
  let current = "";

  const pushCurrent = () => {
    if (current.trim()) {
      chunks.push(current.trim());
      current = "";
    }
  };

  for (const unit of sentenceUnits(text)) {
    if (unit.length <= maxLength) {
      if ((current + " " + unit).trim().length <= maxLength) {
        current = `${current} ${unit}`.trim();
      } else {
        pushCurrent();
        current = unit;
      }
      continue;
    }

    pushCurrent();
    const words = unit.split(/\s+/);
    for (const word of words) {
      if ((current + " " + word).trim().length <= maxLength) {
        current = `${current} ${word}`.trim();
      } else {
        pushCurrent();
        current = word;
      }
    }
  }

  pushCurrent();
  return chunks;
}

export function extractReadableArticleText(article: HTMLElement): string {
  const clone = article.cloneNode(true) as HTMLElement;
  clone
    .querySelectorAll(
      'pre, code, img, picture, svg, video, audio, script, style, nav, button, [hidden], [aria-hidden="true"], [data-tts-ignore], [data-share-section]',
    )
    .forEach((element) => element.remove());

  const text = clone.innerText || clone.textContent || "";
  return text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function setButtonIcon(button: HTMLButtonElement, state: SpeechPlayerState) {
  const playIcon = button.querySelector<SVGElement>("[data-tts-icon-play]");
  const pauseIcon = button.querySelector<SVGElement>("[data-tts-icon-pause]");
  if (playIcon) playIcon.style.display = state !== "idle" && state !== "paused" ? "none" : "block";
  if (pauseIcon) pauseIcon.style.display = state === "playing" ? "block" : "none";
}

function bindGlobalListeners() {
  if (globalListenersBound || typeof document === "undefined") return;
  globalListenersBound = true;

  const stopAll = () => activeControllers.forEach((controller) => controller.stop());
  window.addEventListener("pagehide", stopAll);
  window.addEventListener("beforeunload", stopAll);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") stopAll();
  });
  document.addEventListener("astro:before-preparation", stopAll);
  window.addEventListener("blog-lang-change", stopAll);
}

function currentBlogLanguage(): SpeechLanguage {
  const documentLanguage = document.documentElement.lang;
  if (documentLanguage === "vi" || documentLanguage.startsWith("vi-")) return "vi";
  try {
    return localStorage.getItem("portfolio:blog-lang") === "vi" ? "vi" : "en";
  } catch {
    return "en";
  }
}

function setupPlayer(player: HTMLElement): SpeechController | null {
  if (player.dataset.ttsReady === "true") return null;
  player.dataset.ttsReady = "true";

  const synthesis = getSynthesis();
  const language = player.dataset.ttsLang as SpeechLanguage;
  const targetId = player.dataset.ttsTarget;
  const article = targetId ? document.getElementById(targetId) : null;
  const toggle = player.querySelector<HTMLButtonElement>("[data-tts-toggle]");
  const stop = player.querySelector<HTMLButtonElement>("[data-tts-stop]");
  const status = player.querySelector<HTMLElement>("[data-tts-status]");
  const progress = player.querySelector<HTMLElement>("[data-tts-progress]");
  const progressBar = player.querySelector<HTMLElement>("[data-tts-progress-bar]");
  const time = player.querySelector<HTMLElement>("[data-tts-time]");
  const languageButtons = player.querySelectorAll<HTMLButtonElement>("[data-tts-switch-language]");

  let state: SpeechPlayerState = "idle";
  let chunks: string[] = [];
  let chunkIndex = 0;
  let voiceList = synthesis ? getVoices(synthesis) : [];

  const labels = {
    unsupported: language === "vi" ? "Trình duyệt này chưa hỗ trợ đọc bài viết." : "This browser does not support article narration.",
    empty: language === "vi" ? "Chưa có nội dung để đọc." : "There is no readable article text.",
    ready: language === "vi" ? "Sẵn sàng đọc" : "Ready to read",
    paused: language === "vi" ? "Đã tạm dừng" : "Paused",
    reading: language === "vi" ? "Đang đọc" : "Reading",
    finished: language === "vi" ? "Đã đọc xong" : "Finished",
    error: language === "vi" ? "Không thể phát giọng đọc trên thiết bị này." : "The voice could not be played on this device.",
    estimate: language === "vi" ? "~{minutes} phút" : "~{minutes} min",
  };

  const estimateMinutes = () => Math.max(1, Math.ceil((extractReadableArticleText(article as HTMLElement).split(/\s+/).length / 150)));

  const updateLanguageButtons = () => {
    const activeLanguage = currentBlogLanguage();
    languageButtons.forEach((button) => {
      const active = button.dataset.ttsSwitchLanguage === activeLanguage;
      button.setAttribute("aria-pressed", String(active));
      button.dataset.active = String(active);
    });
  };

  const updateProgress = () => {
    const completed = chunks.length ? Math.min(chunkIndex, chunks.length) : 0;
    const percentage = chunks.length ? Math.round((completed / chunks.length) * 100) : 0;
    if (progress) {
      progress.setAttribute("aria-valuenow", String(percentage));
      progress.style.setProperty("--tts-progress", `${percentage}%`);
    }
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (time) {
      time.textContent = chunks.length
        ? `${completed}/${chunks.length}`
        : labels.estimate.replace("{minutes}", String(article ? estimateMinutes() : 1));
    }
  };

  const updateState = (nextState: SpeechPlayerState, message?: string) => {
    state = nextState;
    player.dataset.ttsState = nextState;
    if (toggle) {
      toggle.setAttribute("aria-label", nextState === "playing" ? (language === "vi" ? "Tạm dừng đọc" : "Pause narration") : language === "vi" ? "Đọc bài viết" : "Read article");
      setButtonIcon(toggle, nextState);
    }
    if (status) {
      status.textContent = message || (nextState === "playing" ? labels.reading : nextState === "paused" ? labels.paused : labels.ready);
    }
  };

  const stopPlayback = () => {
    synthesis?.cancel();
    chunks = [];
    chunkIndex = 0;
    updateProgress();
    updateState("idle");
  };

  if (!synthesis || !article || !toggle || !stop || !status) {
    player.dataset.ttsUnavailable = "true";
    if (status) status.textContent = !synthesis ? labels.unsupported : labels.empty;
    toggle?.setAttribute("disabled", "true");
    stop?.setAttribute("disabled", "true");
    languageButtons.forEach((button) => button.setAttribute("disabled", "true"));
    return null;
  }

  const speakCurrentChunk = () => {
    if (state !== "playing" || !chunks[chunkIndex]) return;
    const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
    utterance.lang = getPreferredLocale(language);
    utterance.rate = 1;
    utterance.pitch = 1;
    const voice = chooseVoice(voiceList, language);
    if (voice) utterance.voice = voice;
    status.textContent = `${labels.reading} · ${chunkIndex + 1}/${chunks.length}`;
    updateProgress();

    utterance.onend = () => {
      if (state !== "playing") return;
      chunkIndex += 1;
      if (chunkIndex >= chunks.length) {
        updateProgress();
        updateState("idle", labels.finished);
        return;
      }
      window.setTimeout(speakCurrentChunk, 0);
    };

    utterance.onerror = (event) => {
      if (event.error === "canceled" || event.error === "interrupted") return;
      stopPlayback();
      updateState("idle", labels.error);
    };

    synthesis.speak(utterance);
  };

  const startPlayback = () => {
    const text = extractReadableArticleText(article);
    chunks = splitSpeechText(text);
    chunkIndex = 0;
    if (!chunks.length) {
      updateState("idle", labels.empty);
      return;
    }
    synthesis.cancel();
    updateProgress();
    updateState("playing");
    speakCurrentChunk();
  };

  toggle.addEventListener("click", () => {
    if (state === "playing") {
      synthesis.pause();
      updateState("paused");
    } else if (state === "paused") {
      synthesis.resume();
      updateState("playing");
      status.textContent = `${labels.reading} · ${chunkIndex + 1}/${chunks.length}`;
    } else {
      startPlayback();
    }
  });

  stop.addEventListener("click", stopPlayback);
  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextLanguage = button.dataset.ttsSwitchLanguage;
      if (nextLanguage === "en" || nextLanguage === "vi") {
        window.dispatchEvent(new CustomEvent("blog-lang-change", { detail: { lang: nextLanguage } }));
      }
    });
  });

  const refreshVoices = () => {
    voiceList = getVoices(synthesis);
  };
  synthesis.addEventListener?.("voiceschanged", refreshVoices);
  refreshVoices();
  updateLanguageButtons();
  updateProgress();
  updateState("idle");

  const controller: SpeechController = {
    stop: stopPlayback,
    destroy: () => {
      stopPlayback();
      synthesis.removeEventListener?.("voiceschanged", refreshVoices);
      activeControllers.delete(controller);
    },
  };
  activeControllers.add(controller);
  return controller;
}

export function setupSpeechPlayers(root: ParentNode = document): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  bindGlobalListeners();
  root.querySelectorAll<HTMLElement>("[data-tts-player]").forEach(setupPlayer);
}
