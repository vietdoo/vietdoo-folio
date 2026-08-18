import { describe, expect, it } from "vitest";
import { isMissingTableError } from "../src/lib/server/admin/storage-errors";

describe("storage error classification", () => {
  it("detects a missing table reported in a nested LibSQL cause", () => {
    const nestedCause = new Error("SQLite error: no such table: AiRequestLog");
    const queryError = new Error('Failed query: select count(*) from "AiRequestLog"', {
      cause: nestedCause,
    });

    expect(isMissingTableError(queryError, "AiRequestLog")).toBe(true);
  });

  it("detects the model config table independently", () => {
    const queryError = new Error('Failed query: select * from "AiModelConfig"', {
      cause: new Error("SQLite error: no such table: AiModelConfig"),
    });

    expect(isMissingTableError(queryError, "AiModelConfig")).toBe(true);
    expect(isMissingTableError(queryError, "AiRequestLog")).toBe(false);
  });

  it("does not classify unrelated database failures as a missing table", () => {
    const queryError = new Error("SQLite error: network request failed");

    expect(isMissingTableError(queryError, "AiRequestLog")).toBe(false);
  });
});
