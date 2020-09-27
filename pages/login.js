import LoginComponent from "../component/LoginComponent";
import UserLayout from "../layouts/UserLayout";

export default function Home() {
  return (
    <UserLayout>
      <LoginComponent />
    </UserLayout>
  );
}
