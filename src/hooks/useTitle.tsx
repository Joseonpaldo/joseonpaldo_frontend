import { TitleContext } from "contexts/TitleContext";
import { useContext, useEffect } from "react";

const useTitle = (text: string) => {
  const { title, setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle(text)
    const titleElement = document.querySelector("title");
    if (titleElement) {
      titleElement.textContent = text;
    }
  }, [text, setTitle]);

  return title;
};

export default useTitle;
