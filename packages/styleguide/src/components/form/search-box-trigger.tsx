"use client";

import { Modal } from "../modal/modal";
import { SearchBox } from "../search-box/search-box";
import { SearchInput } from "./search-input";
import { useCallback, useEffect, useState } from "react";

export const SearchBoxTrigger = ({
  triggerOnly = false,
  onChange,
  onActiveOptionChange,
}: {
  triggerOnly?: boolean;
  onChange?: (url: string) => void;
  onActiveOptionChange?: (url: string | null) => void;
}) => {
  const [searchBoxOpen, setSearchBoxOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const cmdAndKPressed =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (cmdAndKPressed) {
        event.preventDefault();
        setSearchBoxOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleOnChange = useCallback(
    (url: string) => {
      onChange?.(url);
      setSearchBoxOpen(false);
    },
    [onChange]
  );

  return (
    <>
      {triggerOnly ? null : (
        <SearchInput
          placeholder="Search"
          onClick={(e) => {
            e.preventDefault();

            setSearchBoxOpen(true);
          }}
        />
      )}

      <Modal open={searchBoxOpen} onClose={() => setSearchBoxOpen(false)} naked>
        <SearchBox
          onChange={handleOnChange}
          onActiveOptionChange={onActiveOptionChange}
        />
      </Modal>
    </>
  );
};
