import { useEffect } from "react";

const PageTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};
export default PageTitle;
