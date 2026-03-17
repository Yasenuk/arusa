import { RouterProvider } from "react-router-dom";
import router from "./router";

import { isPageLoad, isWebp } from '@org/utils/index';

isWebp();
isPageLoad();

export function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;