import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../page/HomePage/HomePage";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
        ],
    },
]);
