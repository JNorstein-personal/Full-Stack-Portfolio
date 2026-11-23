import { createBrowserRouter } from "react-router";
import Home from "../Home";
import Blog from "../Blog";
import Podcast from "../Podcast";
import Titles from "../Titles";
import Creators from "../Creators";
import Wiki from "../Wiki";
import About from "../About";
import Community from "../Community";
import Merch from "../Merch";
import Comingsoon from "../Comingsoon";
import Layout from "./Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "blog", element: <Blog /> },
      { path: "podcast", element: <Podcast /> },
      { path: "titles", element: <Titles /> },
      { path: "creators", element: <Creators /> },
      { path: "wiki", element: <Wiki /> },
      { path: "about", element: <About /> },
      { path: "community", element: <Community /> },
      { path: "merch", element: <Merch /> },
      { path: "comingsoon", element: <Comingsoon /> },
    ],
  },
]);
