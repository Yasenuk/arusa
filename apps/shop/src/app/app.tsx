import { RouterProvider } from "react-router-dom";
import router from "./router";

import { isPageLoad } from '@org/utils/index';

// isWebp() видалено — <picture> з <source type="image/avif/webp">
// вирішує підтримку форматів нативно без JS детекції
isPageLoad();

export function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
