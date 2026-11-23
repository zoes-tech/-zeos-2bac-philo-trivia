export const PLAY_ANCHOR = "play";
export const DASHBOARD_ANCHOR = "dashboard";
export const MODULE_QUERY_PARAM = "module";

export function playHref(moduleId?: string): string {
  return moduleId
    ? `/?${MODULE_QUERY_PARAM}=${encodeURIComponent(moduleId)}#${PLAY_ANCHOR}`
    : `#${PLAY_ANCHOR}`;
}
