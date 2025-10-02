import { createClient } from "@clickhouse/client";

interface DownloadResult {
  downloads: number;
}

export const fetchDownloads = async () => {
  if (process.env.LOCAL === "true") {
    return { lastMonth: 999_999, lastWeek: 250_000 };
  }

  // ClickHouse public instance configuration
  const CLICKHOUSE_HOST =
    process.env.CLICKHOUSE_HOST || "https://sql-clickhouse.clickhouse.com";
  const CLICKHOUSE_USER = process.env.CLICKHOUSE_USERNAME || "demo";

  const clickhouse = createClient({
    url: CLICKHOUSE_HOST, // Using 'url' instead of deprecated 'host'
    username: CLICKHOUSE_USER,
    database: "pypi",
    clickhouse_settings: {
      allow_experimental_analyzer: 0,
    },
  });

  try {
    // Query for last week downloads
    const weekResult = await clickhouse.query({
      query: `
        SELECT sum(count) as downloads
        FROM pypi_downloads_per_day_by_version
        WHERE project = {project:String}
          AND date >= today() - INTERVAL 7 DAY
      `,
      query_params: {
        project: "strawberry-graphql",
      },
      format: "JSONEachRow",
    });

    // Query for last month downloads
    const monthResult = await clickhouse.query({
      query: `
        SELECT sum(count) as downloads
        FROM pypi_downloads_per_day_by_version
        WHERE project = {project:String}
          AND date >= today() - INTERVAL 30 DAY
      `,
      query_params: {
        project: "strawberry-graphql",
      },
      format: "JSONEachRow",
    });

    const weekData = await weekResult.json<DownloadResult>();
    const monthData = await monthResult.json<DownloadResult>();

    return {
      lastWeek: weekData[0]?.downloads || 0,
      lastMonth: monthData[0]?.downloads || 0,
    };
  } catch (error) {
    console.error("Failed to fetch download stats from ClickHouse:", error);
    // Return static fallback values
    return { lastMonth: 800_000, lastWeek: 200_000 };
  } finally {
    await clickhouse.close();
  }
};
