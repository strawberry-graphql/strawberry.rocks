import { GithubCollaborator } from "~/types/api";

export const isString = (x: any): x is string => {
  return typeof x === "string";
};

export const isCollaborator = (x: any): x is GithubCollaborator => {
  return x?.login != null;
};
