import RegisterComponent from "../component/RegisterComponent";
import UserLayout from "../layouts/UserLayout";

export default function Home() {
  return (
    <UserLayout>
      <RegisterComponent />
    </UserLayout>
  );
}
