import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import Courses from "./pages/Courses";
import Quiz from "./pages/Quiz";
import { useEffect } from "react";
import LoginScreen from "./pages/Login";
import Course from "./pages/Course";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
      case "/quiz":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<Courses />} />
      <Route path="/course" element={<Course />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}
export default App;
