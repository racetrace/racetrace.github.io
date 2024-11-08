import { AuthProvider } from "react-oidc-context";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import './App.css';
import { AccountProvider } from "./context/AccountProvider";
import Profile from "./pages/Profile";
import Layout from "./pages/Layout";
import { QueryClient, QueryClientProvider } from "react-query";
import { oidcConfig } from "./config";
import Privacy from "./pages/Privacy";

const router = createBrowserRouter([
  {
      element: <Layout />,
      children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/privacy",
            element: <Privacy />         
          }
      ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider {...oidcConfig} > 
      <AccountProvider>
        <RouterProvider router={router} />
      </AccountProvider>
    </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
