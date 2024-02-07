"use client";

import { IndexIcon } from "../icons";
import { MenuCloseIcon } from "../icons/menu-close";
import { SidebarNav, Section } from "../sidebar-nav/sidebar-nav";
import { Label } from "../typography/label";
import clsx from "clsx";
import { useState } from "react";

export const MobileNav = ({ sections }: { sections: Section[] }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div
      className={clsx(
        "fixed bottom-0 w-full p-16 max-h-[80vh]",
        "bg-white bg-opacity-75 backdrop-blur-lg dark:bg-black dark:bg-opacity-75",
        "overflow-auto z-50"
      )}
    >
      <header className="mb-32 flex justify-between">
        <div onClick={toggleMenu} className="cursor-pointer flex">
          <IndexIcon className="mr-8 text-g-700 dark:text-g-50" />
          <Label className="text-g-900 dark:text-g-50">Index</Label>
        </div>

        {menuVisible && (
          <MenuCloseIcon
            onClick={toggleMenu}
            className="cursor-pointer text-g-700 dark:text-g-50"
          />
        )}
      </header>

      {menuVisible && <SidebarNav sections={sections} />}
    </div>
  );
};
