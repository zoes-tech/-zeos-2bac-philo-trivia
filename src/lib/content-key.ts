/** Question ids are only unique inside a module. */
export function contentKey(moduleId: string, questionId: string): string {
  return `${moduleId}:${questionId}`;
}

export function parseContentKey(
  key: string,
): { moduleId: string; questionId: string } | null {
  const separator = key.indexOf(":");
  if (separator <= 0) return null;

  return {
    moduleId: key.slice(0, separator),
    questionId: key.slice(separator + 1),
  };
}
