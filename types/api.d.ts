export type GithubCollaborator = {
  name: string;
  url: string;
  avatarUrl: string;
};

export type PagePath = {
  params: { slug: string[] };
}[];
