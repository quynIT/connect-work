import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutUser from "./layouts/user/LayoutUser";
import { adminRoutes, routes } from "./routes";
import "./App.css";
import LayoutAdmin from "./layouts/admin/LayoutAdmin";
import { AuthProvider } from "./auth/AuthContext";
import LoginUser from "./pages/PageUser/LoginUser";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Route for admin */}
          <Route path="/admin" element={<LayoutAdmin />}>
            {adminRoutes.map(
              (route: { path: string; page: React.ComponentType }) => {
                const Page = route.page;
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<Page />}
                  />
                );
              }
            )}
          </Route>
          <Route path="/login" element={<LoginUser />} />
          {/* Route for client */}
          <Route path="/" element={<LayoutUser />}>
            {routes.map(
              (route: { path: string; page: React.ComponentType }) => {
                const Page = route.page;
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<Page />}
                  />
                );
              }
            )}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
