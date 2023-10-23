/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

import * as types from "./graphql";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  query FetchRelease($version: String!) {\n    repository(owner: "strawberry-graphql", name: "strawberry") {\n      release(tagName: $version) {\n        author {\n          name\n        }\n        description\n        mentions(first: 10) {\n          nodes {\n            login\n          }\n        }\n        name\n      }\n    }\n  }\n':
    types.FetchReleaseDocument,
  "\n  query pullRequest($owner: String!, $repo: String!, $pull_number: Int!) {\n    repository(owner: $owner, name: $repo) {\n      pullRequest(number: $pull_number) {\n        state\n        number\n        headRepositoryOwner {\n          login\n        }\n        repository {\n          name\n        }\n        headRefName\n        url\n        labels(first: 10) {\n          nodes {\n            name\n          }\n        }\n      }\n    }\n  }\n":
    types.PullRequestDocument,
  "\n  query file($owner: String!, $repo: String!, $filename: String!) {\n    repository(owner: $owner, name: $repo) {\n      object(expression: $filename) {\n        ... on Blob {\n          __typename\n          text\n        }\n      }\n    }\n  }\n":
    types.FileDocument,
  "\n  query latestRelease($owner: String!, $repo: String!) {\n    repository(owner: $owner, name: $repo) {\n      latestRelease {\n        tagName\n      }\n    }\n  }\n":
    types.LatestReleaseDocument,
  "\n  query codeOfConduct($owner: String!, $repo: String!) {\n    repository(owner: $owner, name: $repo) {\n      codeOfConduct {\n        body\n      }\n      latestRelease {\n        tagName\n      }\n    }\n  }\n":
    types.CodeOfConductDocument,
  "\n  query docPage(\n    $owner: String!\n    $repo: String!\n    $filename: String!\n    $tablecontent: String!\n  ) {\n    repository(owner: $owner, name: $repo) {\n      object(expression: $filename) {\n        ... on Blob {\n          __typename\n          text\n        }\n      }\n      tableOfContents: object(expression: $tablecontent) {\n        ... on Blob {\n          __typename\n          text\n        }\n      }\n    }\n  }\n":
    types.DocPageDocument,
  "\n  query extensionsPage($owner: String!, $repo: String!, $filename: String!) {\n    repository(owner: $owner, name: $repo) {\n      object(expression: $filename) {\n        ... on Tree {\n          __typename\n          entries {\n            __typename\n            name\n            path\n            type\n            object {\n              ... on Blob {\n                __typename\n                text\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.ExtensionsPageDocument,
  '\n  query sponsors {\n    organization(login: "strawberry-graphql") {\n      sponsors(first: 100) {\n        nodes {\n          __typename\n          ... on User {\n            login\n            name\n            avatarUrl\n          }\n          ... on Organization {\n            login\n            name\n            avatarUrl\n          }\n        }\n      }\n    }\n  }\n':
    types.SponsorsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query FetchRelease($version: String!) {\n    repository(owner: "strawberry-graphql", name: "strawberry") {\n      release(tagName: $version) {\n        author {\n          name\n        }\n        description\n        mentions(first: 10) {\n          nodes {\n            login\n          }\n        }\n        name\n      }\n    }\n  }\n'
): (typeof documents)['\n  query FetchRelease($version: String!) {\n    repository(owner: "strawberry-graphql", name: "strawberry") {\n      release(tagName: $version) {\n        author {\n          name\n        }\n        description\n        mentions(first: 10) {\n          nodes {\n            login\n          }\n        }\n        name\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query pullRequest($owner: String!, $repo: String!, $pull_number: Int!) {\n    repository(owner: $owner, name: $repo) {\n      pullRequest(number: $pull_number) {\n        state\n        number\n        headRepositoryOwner {\n          login\n        }\n        repository {\n          name\n        }\n        headRefName\n        url\n        labels(first: 10) {\n          nodes {\n            name\n          }\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query pullRequest($owner: String!, $repo: String!, $pull_number: Int!) {\n    repository(owner: $owner, name: $repo) {\n      pullRequest(number: $pull_number) {\n        state\n        number\n        headRepositoryOwner {\n          login\n        }\n        repository {\n          name\n        }\n        headRefName\n        url\n        labels(first: 10) {\n          nodes {\n            name\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query file($owner: String!, $repo: String!, $filename: String!) {\n    repository(owner: $owner, name: $repo) {\n      object(expression: $filename) {\n        ... on Blob {\n          __typename\n          text\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query file($owner: String!, $repo: String!, $filename: String!) {\n    repository(owner: $owner, name: $repo) {\n      object(expression: $filename) {\n        ... on Blob {\n          __typename\n          text\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query latestRelease($owner: String!, $repo: String!) {\n    repository(owner: $owner, name: $repo) {\n      latestRelease {\n        tagName\n      }\n    }\n  }\n"
): (typeof documents)["\n  query latestRelease($owner: String!, $repo: String!) {\n    repository(owner: $owner, name: $repo) {\n      latestRelease {\n        tagName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query codeOfConduct($owner: String!, $repo: String!) {\n    repository(owner: $owner, name: $repo) {\n      codeOfConduct {\n        body\n      }\n      latestRelease {\n        tagName\n      }\n    }\n  }\n"
): (typeof documents)["\n  query codeOfConduct($owner: String!, $repo: String!) {\n    repository(owner: $owner, name: $repo) {\n      codeOfConduct {\n        body\n      }\n      latestRelease {\n        tagName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query docPage(\n    $owner: String!\n    $repo: String!\n    $filename: String!\n    $tablecontent: String!\n  ) {\n    repository(owner: $owner, name: $repo) {\n      object(expression: $filename) {\n        ... on Blob {\n          __typename\n          text\n        }\n      }\n      tableOfContents: object(expression: $tablecontent) {\n        ... on Blob {\n          __typename\n          text\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query docPage(\n    $owner: String!\n    $repo: String!\n    $filename: String!\n    $tablecontent: String!\n  ) {\n    repository(owner: $owner, name: $repo) {\n      object(expression: $filename) {\n        ... on Blob {\n          __typename\n          text\n        }\n      }\n      tableOfContents: object(expression: $tablecontent) {\n        ... on Blob {\n          __typename\n          text\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query extensionsPage($owner: String!, $repo: String!, $filename: String!) {\n    repository(owner: $owner, name: $repo) {\n      object(expression: $filename) {\n        ... on Tree {\n          __typename\n          entries {\n            __typename\n            name\n            path\n            type\n            object {\n              ... on Blob {\n                __typename\n                text\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query extensionsPage($owner: String!, $repo: String!, $filename: String!) {\n    repository(owner: $owner, name: $repo) {\n      object(expression: $filename) {\n        ... on Tree {\n          __typename\n          entries {\n            __typename\n            name\n            path\n            type\n            object {\n              ... on Blob {\n                __typename\n                text\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query sponsors {\n    organization(login: "strawberry-graphql") {\n      sponsors(first: 100) {\n        nodes {\n          __typename\n          ... on User {\n            login\n            name\n            avatarUrl\n          }\n          ... on Organization {\n            login\n            name\n            avatarUrl\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query sponsors {\n    organization(login: "strawberry-graphql") {\n      sponsors(first: 100) {\n        nodes {\n          __typename\n          ... on User {\n            login\n            name\n            avatarUrl\n          }\n          ... on Organization {\n            login\n            name\n            avatarUrl\n          }\n        }\n      }\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
