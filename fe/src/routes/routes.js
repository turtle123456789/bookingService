import { AdminDashboard, AdminPage, BookingList, CategoryManagement, ChooseServicePage, HomePage, LayoutPage, LoginPage, PartnerRegisterPage, Profile, RegisterPage, ServiceDetailPage, ServiceManagement, ServicePage, StoreDetailPage, UserManagementPage } from "../pages";
import ApproveProfilePage from "../pages/Admin/ApproveProfilePage";
import StoreManagementPage from "../pages/Admin/StoreManagementPage";

const routes = [
  {
    path: "/",
    element: <LayoutPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/service",
        index: true,
        element: <ServicePage />,
      },
       {
        path: "/service-detail/:serviceId",
        index: true,
        element: <ServiceDetailPage />,
      },
      {
        path: "/store",
        index: true,
        element: <ServicePage />,
      },
      {
        path: "/store-detail/:storeId",
        index: true,
        element: <StoreDetailPage />,      
      },
      {
        path: "/choice-service",
        index: true,
        element: <ChooseServicePage />,
      },
      {
        path: "/login",
        index: true,
        element: <LoginPage />,
      },
      {
        path: "/register",
        index: true,
        element: <RegisterPage />,
      },
        {
        path: "/partner",
        index: true,
        element: <PartnerRegisterPage />,
      }
      
    ],
   
  },
  {
    path: "/admin",
    element: <AdminPage/>,
    children: [
      {
        index: true,
        path: "",
        element: <AdminDashboard />,
      },
      {
        index: true,
        path: "/admin/profile",
        element: <Profile />,
      },
      {
        index: true,
        path: "/admin/booking",
        element: <BookingList />,
      },
      {
        index: true,
        path: "/admin/categories",
        element: <CategoryManagement />,
      },
      {
        index: true,
        path: "/admin/services",
        element: <ServiceManagement />,
      },
       {
        index: true,
        path: "/admin/approvals",
        element: <ApproveProfilePage />,
      },
      {
        index: true,
        path: "/admin/users",
        element: <UserManagementPage />,
      },
      {
        index: true,
        path: "/admin/stores",
        element: <StoreManagementPage />,
      },
      
    ]
  }
];

export default routes;
