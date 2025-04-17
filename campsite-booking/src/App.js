import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import { Toaster } from "react-hot-toast";
import Camps from "./components/Camps";
import { useAuth } from "./context/AuthProvider.js";
import Logout from "./components/Logout.js";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/footer";
import AdminDashboard from "./components/AdminDashboard";
import CustomerList from "./components/CustomerList.js";
import CustomerCreate from "./components/CustomerCreate.js";
import CustomerEdit from "./components/CustomerEdit.js";
import UserProfile from "./components/UserProfile.js";
// import ManageState from "./components/AdminState.js";
// import ManageCity from "./components/AdminCity.js";
import ManageCategory from "./components/AdminCampCategory.js";
import ManageCampsite from "./components/AdminCampsite.js";
import ManageCountry from "./components/AdminCountry.js";
import CampsiteList from "./components/CampsiteList.js";
import CampsiteDetails from "./components/CampsiteDetails.js";
import AdminSubscriptions from "./components/AdminSubscriptions";
import SubscriptionCreate from "./components/SubscriptionCreate";
import SubscriptionEdit from "./components/SubscriptionEdit";
import Subscriptions from "./components/Subscriptions.js";
import ForgotPasswordPage from "./components/ForgotPasswordPage.js";
import ResetPasswordPage from "./components/ResetPasswordPage.js";
import PaymentPage from "./components/Payment.js";
import AdminBookingPage from "./components/AdminBooking.js";
import Cart from "./components/Cart.js";
import ThankYou from './components/ThankYou';

function App() {
  const [authUser, setAuthUser] = useAuth();
  console.log(authUser);
  // const isAdmin = authUser
  const isAdmin = authUser && authUser.role === "Admin"

  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/camps" element={<Camps />} /> */}
          <Route
            path="/camps"
            element={authUser ? <Camps /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={
              authUser?.role === "Admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/profile"
            element={authUser ? <UserProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/subscriptions"
            element={
              authUser && authUser.role !== "Admin" ? (
                <Subscriptions />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* <Route path="/campsiteList" element={<CampsiteList />} /> */}
          <Route
            path="/campsiteList"
            element={authUser ? <CampsiteList /> : <Navigate to="/login" />}
          />
          <Route
            path="/campsite/campsiteDetails/:id"
            element={<CampsiteDetails />}
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/customers"
            element={isAdmin ? <CustomerList /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/customers/create"
            element={isAdmin ? <CustomerCreate /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/customers/edit/:id"
            element={isAdmin ? <CustomerEdit /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/country"
            element={isAdmin ? <ManageCountry /> : <Navigate to="/login" />}
          />
          {/* <Route path="/admin/state" element={isAdmin ? <ManageState /> : <Navigate to="/login" />} />
          <Route path="/admin/city" element={isAdmin ? <ManageCity /> : <Navigate to="/login" />} /> */}
          <Route
            path="/admin/category"
            element={isAdmin ? <ManageCategory /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/campsite"
            element={isAdmin ? <ManageCampsite /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/subscriptions"
            element={
              isAdmin ? <AdminSubscriptions /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/subscriptions/create"
            element={
              isAdmin ? <SubscriptionCreate /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/subscriptions/edit/:id"
            element={isAdmin ? <SubscriptionEdit /> : <Navigate to="/login" />}
          />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          {/* <Route path="/cart" element={<Cart />} /> */}
          <Route
            path="/cart"
            element={authUser ? <Cart /> : <Navigate to="/login" />}
          />

          <Route path="/admin/bookings" element={<AdminBookingPage />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
        <Footer />
      </Router>
      <Toaster />
    </div>
  );
}

export default App;