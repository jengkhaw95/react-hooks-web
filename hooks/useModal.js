import { useState } from "react";

// This hook filter toggle/set modal component (as modalShown) with setModal
export default function useModal() {
  const [modalShown, setModalShown] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const setModal = (i = false) => {
    setModalShown(!modalShown);
    if (i) {
      setModalContent(i);
    }
  };

  return { modalShown, setModal, modalContent };
}
