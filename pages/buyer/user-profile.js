import withAuth from "../../component/HOC/AuthenHOC";
import UserProfileComponent from "../../component/UserProfileComponent";
import BuyerLayout from "../../layouts/BuyerLayout";

function UserProfilePage() {
  return (
    <BuyerLayout>
      <UserProfileComponent />
    </BuyerLayout>
  );
}

export default withAuth(UserProfilePage);
