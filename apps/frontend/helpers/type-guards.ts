import type { Tokens } from "marked";

import { ExtensionDocData } from "~/types/extensions";
import { Blob } from "~/types/graphql/graphql";
import { TokenListItem, TokenText } from "~/types/marked";

export const isString = (x: any): x is string => {
  return typeof x === "string";
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

export const isListItemWithTokens = (token: any): token is any => {
  return token?.type === "list_item" && token?.tokens != null;
};

export const extensionDataIsComplete = (data: {
  [key: string]: any;
}): data is ExtensionDocData => {
  return !!data.title && !!data.summary && data.tags;
};

export const isBlob = (obj: any): obj is Blob => {
  if (!obj) {
    return false;
  }

  return Object.keys(obj).length > 0 && obj.__typename === "Blob";
};

export const isTree = (obj: any) => {
  return Object.keys(obj).length > 0 && obj.__typename === "Tree";
};
