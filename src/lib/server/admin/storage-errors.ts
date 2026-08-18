function nestedErrorText(error: unknown) {
  const messages: string[] = [];
  const seen = new Set<object>();
  let current: unknown = error;

  for (let depth = 0; depth < 8 && current; depth += 1) {
    if (current instanceof Error) {
      messages.push(current.name, current.message);
    } else if (typeof current === "object") {
      if (seen.has(current)) break;
      seen.add(current);
      const record = current as { message?: unknown; code?: unknown };
      if (typeof record.message === "string") messages.push(record.message);
      if (typeof record.code === "string") messages.push(record.code);
    } else {
      messages.push(String(current));
    }

    if (typeof current !== "object") break;
    const cause = (current as { cause?: unknown }).cause;
    if (!cause || cause === current) break;
    current = cause;
  }

  return messages.join(" ");
}

export function isMissingTableError(error: unknown, tableName: string) {
  const message = nestedErrorText(error);
  return (
    /(?:no such table|does not exist|not found)/i.test(message) &&
    message.toLowerCase().includes(tableName.toLowerCase())
  );
}

export function getStorageErrorText(error: unknown) {
  return nestedErrorText(error);
}
