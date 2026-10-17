// "local" installs a wheel built from a local Strawberry checkout, see
// plugins/local-strawberry.ts. Only available in the dev server.
export const LOCAL_STRAWBERRY_VERSION = "local";

export const DEFAULT_STRAWBERRY_VERSION = __LOCAL_STRAWBERRY__
  ? LOCAL_STRAWBERRY_VERSION
  : "latest";
