import { MenuCloseIcon } from "../icons/menu-close";
import { Caption } from "../typography/caption";
import { Dialog } from "@headlessui/react";
import { useState } from "react";

export const Modal = ({
  children,
  open,
  title,
  label,
  onClose,
  naked = false,
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title?: string;
  label?: string;
  naked?: boolean;
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="z-50 fixed inset-0 bg-black/30 pt-80"
    >
      <div className="absolute inset-0" aria-hidden="true" onClick={onClose} />

      {naked ? (
        <div className="relative z-10 mx-auto max-w-screen-sm">{children}</div>
      ) : (
        <div className="relative z-10 flex items-center justify-center p-24">
          <Dialog.Panel className="mx-auto max-w-screen-sm rounded-[16px] bg-white p-24 pr-64 pb-48 relative">
            {label && <Caption className="text-g-500">{label}</Caption>}
            {title && (
              <Dialog.Title className="typography-heading-4">
                {title}
              </Dialog.Title>
            )}

            {children}

            <MenuCloseIcon
              className="absolute top-24 right-24"
              onClick={onClose}
            />
          </Dialog.Panel>
        </div>
      )}
    </Dialog>
  );
};
