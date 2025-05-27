import ToastContainers from "./Utils/ToastContainer";
import PageNotFound404 from "./Errors/PageNotFound404";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Base from "./Pages/Base";
import Home from "./Pages/Home";
import LoginChoice from "./Pages/LoginChoice";
import Login from "./Pages/Login";
import UserRegistrationForm from "./Pages/users/UserRegistration";
import UserChat from "./Pages/users/UserChat";
import JobDetail from "./Pages/users/JobDetail";
import JobSearch from "./Pages/users/JobSearch";
import Notifications from "./Pages/users/Notification";
import JobListings from "./Pages/users/JobListing";
import UserSettingUpdateForm from "./Pages/users/UserSettingsUpdate";
import SchoolRegistration from "./Pages/school/SchoolRegistration";
import Profile from "./Pages/users/Profile";
import SchoolProfile from "./Pages/school/SchoolProfile";
import SchoolJobs from "./Pages/school/SchoolJobs";
import JobApplicantList from "./Pages/school/JobApplicantList";
import JobsAppliedList from "./Pages/school/JobsAppliedList";
import SchoolSettings from "./Pages/school/SchoolSetting";
import AddJob from "./Pages/school/AddJob";
import EditProfilePage from "./Pages/users/EditProfile";
import Protected from "./Security/Protected";
import SchoolProtected from "./Security/SchoolProtected";
import UserList from "./Pages/admin/UserList";
import JobList from "./Pages/admin/JobList";
import SchoolList from "./Pages/admin/SchoolList";
import AdminProtected from "./Security/AdminProtected";
import SchoolChat from "./Pages/school/SchoolChat";
import UserProfile from "./Pages/school/UserProfile";
import PaymentSuccess from "./Pages/payment-success";
import ApplicationSuccess from "./Pages/application-success";
import ApplicationCancel from "./Pages/application-cancel";
import RenewSubscription from "./Pages/school/RenewSubscription";
import SubscriptionProtected from "./Security/SubscriptionProtected";
import RenewalSuccess from "./Pages/renewal-success";
import RenewalCancelled from "./Pages/renewal-cancelled";
import AdminPayments from "./Pages/admin/AdminPayments";
import Dashboard from "./Pages/admin/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        {/* ToastContainer */}
        <ToastContainers />

        {/* Routes */}
        <Routes>
          {/* Web Routes */}
          <Route
            path="/"
            element={
              <Base>
                <Home />
              </Base>
            }
          />
          <Route path="/login-choice" element={<LoginChoice />} />
          <Route path="/login" element={<Login />} />

          {/* User Routes */}
          <Route path="/user-registration" element={<UserRegistrationForm />} />
          <Route
            path="/user-profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/user-chat"
            element={
              <Protected>
                <UserChat />
              </Protected>
            }
          />
          <Route
            path="/user/job-listing"
            element={
              <Protected>
                <JobListings />
              </Protected>
            }
          />
          <Route
            path="/user/job-search"
            element={
              <Protected>
                <JobSearch />
              </Protected>
            }
          />
          <Route
            path="/user/job-detail"
            element={
              <Protected>
                <JobDetail />
              </Protected>
            }
          />
          <Route
            path="/user/notification"
            element={
              <Protected>
                <Notifications />
              </Protected>
            }
          />
          <Route
            path="/user/settings/update"
            element={
              <Protected>
                <UserSettingUpdateForm />
              </Protected>
            }
          />
          <Route
            path="/user/profile-update"
            element={
              <Protected>
                <EditProfilePage />
              </Protected>
            }
          />

          {/* School Routes */}
          <Route path="/school-registration" element={<SchoolRegistration />} />
          <Route path="/school-login" element={<Login />} />
          <Route
            path="/school-jobs"
            element={
              <SchoolProtected>
                <SchoolJobs />
              </SchoolProtected>
            }
          />
          <Route
            path="/school-profile"
            element={
              <SchoolProtected>
                <SchoolProfile />
              </SchoolProtected>
            }
          />
          <Route
            path="/school-settings"
            element={
              <SchoolProtected>
                <SchoolSettings />
              </SchoolProtected>
            }
          />
          <Route
            path="/school-jobs-applicant"
            element={
              <SchoolProtected>
                <JobApplicantList />
              </SchoolProtected>
            }
          />
          <Route
            path="/school-jobs-applied/:jobId"
            element={
              <SchoolProtected>
                <JobsAppliedList />
              </SchoolProtected>
            }
          />
          <Route
            path="/school-add-job"
            element={
              <SchoolProtected>
                <SubscriptionProtected>
                  <AddJob />
                </SubscriptionProtected>
              </SchoolProtected>
            }
          />
          <Route
            path="/school-chat"
            element={
              <SchoolProtected>
                <UserChat />
              </SchoolProtected>
            }
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/application-success" element={<ApplicationSuccess />} />
          <Route path="/renewal-success" element={<RenewalSuccess/>} />
        <Route path="/renewal-cancelled" element={<RenewalCancelled />} />
          <Route
            path="/application-cancelled"
            element={<ApplicationCancel />}
          />
          <Route
            path="/school-user-profile/:id"
            element={
              <SchoolProtected>
                <UserProfile />
              </SchoolProtected>
            }
          />
          <Route
            path="/school/renew-subscription"
            element={
              <SchoolProtected>
                <RenewSubscription />
              </SchoolProtected>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtected>
<Dashboard />              </AdminProtected>
            }
          />
          <Route
            path="/admin/user-list"
            element={
              <AdminProtected>
                <UserList />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/school-list"
            element={
              <AdminProtected>
                <SchoolList />
              </AdminProtected>
            }
          />
          <Route
            path="/admin/job-list"
            element={
              <AdminProtected>
                <JobList />
              </AdminProtected>
            }
          />
      <Route path='/admin/Payment' element={<AdminProtected><AdminPayments/></AdminProtected>}/>

          <Route path="*" element={<PageNotFound404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
