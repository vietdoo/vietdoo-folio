import { afterEach, describe, expect, it, vi } from "vitest";
import {
  inferCapabilities,
  resetRouterHealth,
  smartComplete,
} from "../src/lib/server/ai/smart-router";

const successPayload = (content: string) =>
  new Response(
    JSON.stringify({
      choices: [{ message: { role: "assistant", content } }],
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );

describe("smart router", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    resetRouterHealth();
  });

  it("infers multimodal capabilities from message parts", () => {
    expect(
      inferCapabilities([
        {
          role: "user",
          content: [
            { type: "text", text: "Describe this" },
            {
              type: "image_url",
              image_url: { url: "data:image/png;base64,abc" },
            },
            {
              type: "video_url",
              video_url: { url: "data:video/mp4;base64,abc" },
            },
          ],
        },
      ]),
    ).toEqual(["text", "image", "video"]);
  });

  it("uses the highest-priority configured route", async () => {
    vi.stubEnv("ORCAROUTER_API_KEY", "test-orca");
    vi.stubEnv("OPENROUTER_API_KEY", "test-openrouter");
    const fetchMock = vi.fn().mockResolvedValue(successPayload("orca-ok"));
    vi.stubGlobal("fetch", fetchMock);

    const result = await smartComplete({
      messages: [{ role: "user", content: "Hello" }],
      requiredCapabilities: ["text"],
    });

    expect(result.content).toBe("orca-ok");
    expect(result.usedFallback).toBe(false);
    expect(result.attemptedProviders).toEqual(["orcarouter"]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fails over to OpenRouter after a retryable provider failure", async () => {
    vi.stubEnv("ORCAROUTER_API_KEY", "test-orca");
    vi.stubEnv("OPENROUTER_API_KEY", "test-openrouter");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: "down" } }), {
          status: 503,
        }),
      )
      .mockResolvedValueOnce(successPayload("openrouter-ok"));
    vi.stubGlobal("fetch", fetchMock);

    const result = await smartComplete({
      messages: [{ role: "user", content: "Hello" }],
      requiredCapabilities: ["text"],
    });

    expect(result.content).toBe("openrouter-ok");
    expect(result.usedFallback).toBe(true);
    expect(result.attemptedProviders).toEqual(["orcarouter", "openrouter"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
