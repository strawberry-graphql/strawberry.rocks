export const getIntegrationFromSlug = (slug: string) => {
  const django = slug === "django" || slug?.startsWith("django/");

  const integration = django ? "django" : undefined;

  return integration;
};
