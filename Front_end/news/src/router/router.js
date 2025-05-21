import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import CategoryPage, { loadRss } from "../page/CategoryPage/CategoryPage";
import HomePage from "../page/HomePage/HomePage";
import DetailPage, { loadUrl } from "../page/DetailPage/DetailPage";
import RegisterPage from "../page/LoginAndResigter/RegisterPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'category/:nameCate',
                element: <CategoryPage />,
                loader: loadRss,
            },
            {
                path: ':category/:articleSlug',
                element: <DetailPage />,
                loader: loadUrl,
            },
            {
                path: 'register',           // 👈 thêm route đăng ký
                element: <RegisterPage />,
            }
        ]
    }
]);
