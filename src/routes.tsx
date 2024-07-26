import AuthGuard from "components/authentication/AuthGuard";
import GuestGuard from "components/authentication/GuestGuard";
import DashboardLayout from "components/Layouts/DashboardLayout";
import LoadingScreen from "components/LoadingScreen";
import { FC, lazy, LazyExoticComponent, Suspense } from "react";
import { Navigate } from "react-router-dom";

const Loadable = (Component: LazyExoticComponent<FC>) => (props: any) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// authentication pages
const Login = Loadable(lazy(() => import("./pages/authentication/Login")));
const Register = Loadable(
  lazy(() => import("./pages/authentication/Register"))
);

// Dashboard pages
const DashboardSaaS = Loadable(lazy(() => import("./pages/dashboards/SaaS")));


// user management
const GameRoom = Loadable(
  lazy(() => import("./pages/userManagement/GameRoom"))
);
const UserRank = Loadable(
  lazy(() => import("./pages/userManagement/UserRank"))
);
// const AddNewUser = Loadable(
//   lazy(() => import("./pages/userManagement/AddNewUser"))
// );

// error
const Error = Loadable(lazy(() => import("./pages/404")));

// routes
const routes = [
  {
    path: "/",
    element: <Navigate to="home/game-room" />,
  },
  {
    path: "login",
    element: (
        <GuestGuard>
          <Login />
        </GuestGuard>
    ),
  },
  {
    path: "register",
    element: (
        <GuestGuard>
          <Register />
        </GuestGuard>
    ),
  },
  // {
  //   path: "forget-password",
  //   element: (
  //     <GuestGuard>
  //       <ForgetPassword />
  //     </GuestGuard>
  //   ),
  // },
  {
    path: "home",
    element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
    ),
    children: [
      {
        path: "in-game/:roomId",
        element: <DashboardSaaS />,

      },
      // {
      //   path: "user-profile",
      //   element: <UserProfile />,
      // },

      {
        path: "user-rank",
        element: <UserRank />,
      },
      {
        path: "game-room",
        element: <GameRoom />,
      },
      // {
      //   path: "add-room",
      //   element: <AddNewUser />,
      // },
    ],
  },
  {
    path: "*",
    element: <Error />,
  },
];

export default routes;
