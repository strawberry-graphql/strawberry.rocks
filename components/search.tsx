/** @jsx jsx */
import algoliasearch from "algoliasearch/lite";
import { useToggle } from "helpers/use-toggle";
import Mousetrap from "mousetrap";
import { useCallback, useEffect } from "react";
import {
  InstantSearch,
  connectSearchBox,
  connectHits,
} from "react-instantsearch-dom";
import { Box, Button, Flex, Input, jsx } from "theme-ui";

import { SearchIcon } from "./icons/search";

const searchClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_PUBLIC_API_KEY
);

type HitProps = {
  sectionTitle: string;
  title: string;
  slug: string;
};

const Hit = ({ sectionTitle, title }: HitProps) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ fontSize: 1 }}>{sectionTitle}</Box>
    <Box sx={{ fontWeight: "bold" }}>{title}</Box>
  </Box>
);

const Hits = connectHits(({ hits }) => {
  return (
    <Box as="ol" sx={{ overflow: "scroll", p: 3 }}>
      {hits.map((hit: HitProps & { objectID: string }) => (
        <Hit key={hit.objectID} {...hit} />
      ))}
    </Box>
  );
});

const SearchBox = connectSearchBox(({ currentRefinement, refine }) => {
  return (
    <Flex
      as="form"
      role="search"
      {...{ noValidate: true, action: "" }}
      sx={{
        borderBottom: "primary",
        alignItems: "center",
        mt: 3,
        mx: 3,
      }}
    >
      <SearchIcon sx={{ width: 30, height: 30 }} />
      <Input
        id="search-input"
        sx={{ border: "none", outline: "none", px: 0, py: 2 }}
        type="search"
        placeholder="Search docs"
        value={currentRefinement}
        onChange={(event) => refine(event.currentTarget.value)}
      />
    </Flex>
  );
});

const SearchModal = () => (
  <Flex
    sx={{
      flexDirection: "column",
      position: "fixed",
      border: "primary",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 100,
      width: "80%",
      height: "80vh",
      backgroundColor: "background",
    }}
  >
    <SearchBox />
    <Hits hitComponent={Hit} />
  </Flex>
);

export const Search = () => {
  const [isOpen, toggleOpen, setOpen] = useToggle(false);

  const close = useCallback(() => setOpen(false), []);
  const open = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    Mousetrap.bind("command+k", open);
    Mousetrap.bind("esc", close);

    return () => {
      Mousetrap.unbind("command+k");
      Mousetrap.unbind("esc");
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      (document.querySelector("#search-input") as HTMLInputElement).focus();
    }
  }, [isOpen]);

  return (
    <InstantSearch indexName="docs" searchClient={searchClient}>
      <Button onClick={toggleOpen}>Open</Button>
      {isOpen && <SearchModal />}
    </InstantSearch>
  );
};
