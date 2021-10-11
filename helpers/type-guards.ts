import { Tokens } from "marked";

import { GithubCollaborator } from "~/types/api";
import { ExtensionDocData } from "~/types/extensions";
import { TokenListItem, TokenText } from "~/types/marked";

export const isString = (x: any): x is string => {
  return typeof x === "string";
};

export const isCollaborator = (x: any): x is GithubCollaborator => {
  return x?.login != null;
};

export const isHeading = (token: any): token is Tokens.Heading => {
  return token.type === "heading";
};

export const isList = (token: any): token is Tokens.List => {
  return token?.type === "list";
};

export const isTextWithTokens = (token: any): token is TokenText => {
  return token?.type === "text" && token?.tokens != null;
};

export const isLink = (token: any): token is Tokens.Link => {
  return token?.type === "link" && token?.tokens != null;
};

export const isListItemWithTokens = (token: any): token is TokenListItem => {
  return token?.type === "list_item" && token?.tokens != null;
};

export const extensionDataIsComplete = (data: {
  [key: string]: any;
}): data is ExtensionDocData => {
  return !!data.title && !!data.summary && data.tags;
};
