export type GithubCollaborator = {
  name: string | null;
  login: string;
  url: string;
};

export type PagePath = {
  params: { slug: string[] };
}[];
