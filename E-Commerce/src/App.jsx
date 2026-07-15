import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HandleLottie from "./components/HandleLottie/HandleLottie";

const Login = lazy(() => import("./pages/Login/Login"));
const ForgotPassword = lazy(
  () => import("./pages/ForgotPassword/ForgotPassword"),
);
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));
const VerifyOTP = lazy(() => import("./pages/VerfiyOTP/VerifyOTP"));
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));

const Loadable = (Component) => (props) => (
  <Suspense fallback={<HandleLottie state="secondary" />}>
    <Component {...props} />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/login",
    element: Loadable(Login)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/register",
    element: Loadable(Login)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/forgot-password",
    element: Loadable(ForgotPassword)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/verify-otp",
    element: Loadable(VerifyOTP)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/reset-password",
    element: Loadable(ResetPassword)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/",
    element: Loadable(Home)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/shop",
    element: Loadable(Shop)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/product-details",
    element: Loadable(ProductDetails)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/cart",
    element: Loadable(Cart)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/checkout",
    element: Loadable(Checkout)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/profile",
    element: Loadable(Profile)(),
    errorElement: <HandleLottie state="error" />,
  },
  {
    path: "/orders",
    element: Loadable(Orders)(),
    errorElement: <HandleLottie state="error" />,
  },
  { path: "*", element: <HandleLottie state="error" /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
