import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutUser from "./layouts/user/LayoutUser";
import { adminRoutes, routes } from "./routes";
import "./App.css";
import LayoutAdmin from "./layouts/admin/LayoutAdmin";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for admin */}
        <Route path="/admin" element={<LayoutAdmin />}>
          {adminRoutes.map(
            (route: { path: string; page: React.ComponentType }) => {
              const Page = route.page;
              return (
                <Route key={route.path} path={route.path} element={<Page />} />
              );
            }
          )}
        </Route>

        {/* Route for client */}
        <Route path="/" element={<LayoutUser />}>
          {routes.map((route: { path: string; page: React.ComponentType }) => {
            const Page = route.page;
            return (
              <Route key={route.path} path={route.path} element={<Page />} />
            );
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
