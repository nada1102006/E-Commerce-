import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DarkModeTestToggle from "./components/home/DarkModeTestToggle"; //temp


const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));



const Loadable = (Component) => (props) => (
  <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
    <Component {...props} />
  </Suspense>
);

const router = createBrowserRouter([
  { path: "/login", element: Loadable(Login)() },
  { path: "/register", element: Loadable(Register)() },
  { path: "/", element: Loadable(Home)() },
  { path: "/shop", element: Loadable(Shop)() },
  { path: "/product-details", element: Loadable(ProductDetails)() },
  { path: "/cart", element: Loadable(Cart)() },
  { path: "/checkout", element: Loadable(Checkout)() },
  { path: "/profile", element: Loadable(Profile)() },
  { path: "/orders", element: Loadable(Orders)() },
  { path: "*", element: <div>NOT FOUND(404)</div> }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <DarkModeTestToggle /> {/* temp */}
    </>
  );
}

export default App;