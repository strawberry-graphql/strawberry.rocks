/** @jsx jsx */
import algoliasearch from "algoliasearch/lite";
import { scrollIntoViewIfNeeded } from "helpers/scroll";
import { useMouseTrap } from "helpers/use-mousetrap";
import { useToggle } from "helpers/use-toggle";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  InstantSearch,
  connectSearchBox,
  connectHits,
} from "react-instantsearch-dom";
import { Box, Button, Flex, Input, jsx } from "theme-ui";

import Link from "next/link";
import { Router } from "next/router";

import { SearchIcon } from "./icons/search";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_PUBLIC_API_KEY
);

type HitProps = {
  sectionTitle: string;
  title: string;
  slug: string;
  selected?: boolean;
  setSelected: () => void;
};

const Hit = ({
  sectionTitle,
  title,
  slug,
  selected,
  setSelected,
}: HitProps) => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (selected && ref.current) {
      scrollIntoViewIfNeeded(ref.current);
    }
  }, [selected]);

  return (
    <Link href={`/docs/${slug}`} passHref>
      <Box
        ref={ref}
        as="a"
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: selected ? "muted" : "",
          display: "block",
          textDecoration: "none",
        }}
        onMouseEnter={setSelected}
      >
        <Box sx={{ fontSize: 1 }}>{sectionTitle}</Box>
        <Box sx={{ fontWeight: "bold" }}>{title}</Box>
      </Box>
    </Link>
  );
};

const Hits = connectHits(({ hits, selected, setSelected }) => {
  return (
    <Box as="ol" sx={{ overflow: "scroll", p: 3, scrollMargin: 20 }}>
      {hits.map((hit: HitProps & { objectID: string }, index) => (
        <Hit
          key={hit.objectID}
          {...hit}
          selected={index === selected}
          setSelected={() => setSelected(index)}
        />
      ))}
    </Box>
  );
});

const SearchBox = connectSearchBox(
  ({ currentRefinement, refine, selectNext, selectPrevious }) => {
    return (
      <Flex
        sx={{
          borderBottom: "primary",
          alignItems: "center",
          mt: 3,
          mx: 3,
          flex: "0 0 30px",
        }}
      >
        <SearchIcon sx={{ width: 30, height: 30 }} />
        <Input
          id="search-input"
          className="mousetrap"
          sx={{ border: "none", outline: "none", px: 0, py: 2 }}
          type="search"
          placeholder="Search docs"
          value={currentRefinement}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              selectPrevious();
            } else if (event.key === "ArrowDown") {
              selectNext();
            }
          }}
          onChange={(event) => refine(event.currentTarget.value)}
        />
      </Flex>
    );
  }
);

const SearchModal = ({ close }: { close: () => void }) => {
  const [selected, setSelected] = useState<number | undefined>(undefined);

  const selectNext = () => setSelected(selected + 1);
  const selectPrevious = () => setSelected(Math.max(0, selected - 1));

  return (
    <Box
      onClick={close}
      sx={{
        position: "fixed",
        background: "rgba(0, 0, 0, 0.3)",
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Flex
        as="form"
        onClick={(e) => e.stopPropagation()}
        sx={{
          flexDirection: "column",
          position: "fixed",
          border: "primary",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          width: "80%",
          maxWidth: 700,
          maxHeight: 500,
          height: "80vh",
          backgroundColor: "background",
        }}
        role="search"
        onSubmit={(e) => e.preventDefault()}
        {...{ noValidate: true, action: "" }}
      >
        <SearchBox selectNext={selectNext} selectPrevious={selectPrevious} />
        <Hits
          hitComponent={Hit}
          selected={selected}
          setSelected={setSelected}
        />
      </Flex>
    </Box>
  );
};

export const Search = () => {
  const [isOpen, toggleOpen, setOpen] = useToggle(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    Router.events.on("routeChangeStart", close);

    return () => Router.events.on("routeChangeStart", close);
  });

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
  }, [isOpen]);

  useMouseTrap("mod+k", toggleOpen);
  useMouseTrap("esc", close);

  useEffect(() => {
    if (isOpen) {
      (document.querySelector("#search-input") as HTMLInputElement).focus();
    }
  }, [isOpen]);

  return (
    <InstantSearch indexName="docs" searchClient={searchClient}>
      <Button
        sx={{
          display: "flex",
          background: "None",
          color: "text",
          cursor: "pointer",
        }}
        onClick={toggleOpen}
      >
        <SearchIcon sx={{ width: 30, height: 30 }} /> Search docs
      </Button>
      {isOpen && <SearchModal close={() => setOpen(false)} />}
    </InstantSearch>
  );
};
