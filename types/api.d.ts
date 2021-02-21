export type GithubCollaborator = {
  name: string | null;
  login: string;
  url: string;
};

export type TableOfContentsPath = {
  params: { slug: string[] };
}[];
