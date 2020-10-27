import withAuth from "../../component/HOC/AuthenAdminHOC";
import UserProfileComponent from "../../component/UserProfileComponent";
import AggregatorLayout from "../../layouts/AggregatorLayout";

function UserProfilePage() {
  return (
    <AggregatorLayout>
      <UserProfileComponent />
    </AggregatorLayout>
  );
}

export default withAuth(UserProfilePage);
