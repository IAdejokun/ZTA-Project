import { Navigate, useRoutes} from "react-router-dom";
import { lazy} from 'react';



//lazy loading the pages to optimize performance

export const HomePage = lazy(() => import("../pages/home"));
export const DevicePage = lazy(() => import("../pages/devices"));
export const DashboardPage = lazy(() => import("../pages/dashboard"));


export function Router() {
    return useRoutes([
        {
            path: "/",
            element: <Navigate to="/home" replace />,
        },
        {
            path: "home",
            element: <HomePage />,
        },
        {
            path: "devices",
            element: <DevicePage />,
        },
        {
            path: "dashboard",
            element: <DashboardPage />
        }
    ])
}