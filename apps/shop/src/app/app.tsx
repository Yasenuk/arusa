import { RouterProvider } from "react-router-dom";
import router from "./router";

import { isPageLoad } from '@org/utils/index';

isPageLoad();

export function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
