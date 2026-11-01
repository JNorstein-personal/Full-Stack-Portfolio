import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import WeddingLayout from "./components/layout/WeddingLayout";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import PrivacyPage from "./pages/PrivacyPage";
import ReadListenWatchPage from "./pages/ReadListenWatchPage";
import RsvpConfirmationPage from "./pages/RsvpConfirmationPage";
import RsvpPage from "./pages/RsvpPage";
import ScheduleMenuPage from "./pages/ScheduleMenuPage";
import StoryPage from "./pages/StoryPage";
import ThemePage from "./pages/ThemePage";
import TravelPage from "./pages/TravelPage";
import VenuePage from "./pages/VenuePage";

const DesignSystemPage = import.meta.env.DEV
  ? lazy(() => import("./pages/DesignSystemPage"))
  : null;

function App() {
  return (
    <Routes>
      <Route element={<WeddingLayout />}>
        <Route index element={<HomePage />} />

        <Route path="rsvp" element={<RsvpPage />} />

        <Route path="rsvp/confirmation" element={<RsvpConfirmationPage />} />

        <Route path="theme" element={<ThemePage />} />

        <Route path="story" element={<StoryPage />} />

        <Route path="read-listen-watch" element={<ReadListenWatchPage />} />

        <Route path="venue" element={<VenuePage />} />

        <Route path="travel" element={<TravelPage />} />

        <Route path="schedule-menu" element={<ScheduleMenuPage />} />

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

        <Route path="privacy" element={<PrivacyPage />} />

        {import.meta.env.DEV && DesignSystemPage && (
          <Route
            path="dev/design-system"
            element={
              <Suspense fallback={null}>
                <DesignSystemPage />
              </Suspense>
            }
          />
        )}

        <Route path="not-found" element={<NotFoundPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
