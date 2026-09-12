import { Route, Routes } from "react-router-dom";

import WeddingLayout from "./components/layout/WeddingLayout";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import RsvpConfirmationPage from "./pages/RsvpConfirmationPage";
import RsvpPage from "./pages/RsvpPage";

function App() {
  return (
    <Routes>
      <Route element={<WeddingLayout />}>
        <Route
          index
          element={<HomePage />}
        />

        <Route
          path="rsvp"
          element={<RsvpPage />}
        />

        <Route
          path="rsvp/confirmation"
          element={<RsvpConfirmationPage />}
        />

        <Route
          path="theme"
          element={
            <PlaceholderPage
              title="Theme and Attire"
              message="Theme and attire guidance is being prepared."
            />
          }
        />

        <Route
          path="story"
          element={
            <PlaceholderPage
              title="Our Story"
              message="Our Story page content is being prepared."
            />
          }
        />

        <Route
          path="read-listen-watch"
          element={
            <PlaceholderPage
              title="Read, Listen, and Watch"
              message="Themed reading, listening, and viewing resources are being prepared."
            />
          }
        />

        <Route
          path="venues"
          element={
            <PlaceholderPage
              title="Venues"
              message="Venue information is being prepared."
            />
          }
        />

        <Route
          path="travel"
          element={
            <PlaceholderPage
              title="Travel"
              message="Travel information is being prepared."
            />
          }
        />

        <Route
          path="schedule"
          element={
            <PlaceholderPage
              title="Schedule"
              message="Wedding schedule information is being prepared."
            />
          }
        />

        <Route
          path="faq"
          element={
            <PlaceholderPage
              title="FAQ"
              message="Frequently asked questions are being prepared."
            />
          }
        />

        <Route
          path="gallery"
          element={
            <PlaceholderPage
              title="Gallery"
              message="The wedding gallery will be available here when appropriate."
            />
          }
        />

        <Route
          path="privacy"
          element={
            <PlaceholderPage
              title="Privacy"
              message="Wedding website privacy information is being prepared."
            />
          }
        />

        <Route
          path="not-found"
          element={<NotFoundPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;