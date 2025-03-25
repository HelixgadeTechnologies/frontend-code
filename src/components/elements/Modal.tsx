import { ReactNode } from "react";

interface ModalType {
  close?: () => void;
  body: ReactNode;
}

const Modal = ({ body }: ModalType) => {
  return (
    <div className="z-50 flex items-center justify-center w-full h-full fixed top-0 left-0 right-0 bg-dark-1/10">
      <div>{body}</div>
    </div>
  );
};

export default Modal;
