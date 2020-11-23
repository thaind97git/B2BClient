import withAuth from "../../component/HOC/AuthenHOC";
import UserProfileComponent from "../../component/UserProfileComponent";
import AdminLayout from "../../layouts/AdminLayout";

function UserProfilePage() {
  return (
    <AdminLayout>
      <UserProfileComponent />
    </AdminLayout>
  );
}

export default withAuth(UserProfilePage);
