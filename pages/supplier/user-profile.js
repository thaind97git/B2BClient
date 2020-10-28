import withAuth from "../../component/HOC/AuthenHOC";
import UserProfileComponent from "../../component/UserProfileComponent";
import SupplierLayout from "../../layouts/SupplierLayout";

function UserProfilePage() {
  return (
    <SupplierLayout>
      <UserProfileComponent isDrawer={false} />
    </SupplierLayout>
  );
}
export default withAuth(UserProfilePage);
