import AdminConfigSettingComponent from '../../component/AdminConfigSettingComponent';
import withAuth from '../../component/HOC/AuthenHOC';
import AdminLayout from '../../layouts/AdminLayout';
const Page = () => {
  return (
    <AdminLayout hasBackground={false}>
      <div id="container">
        <AdminConfigSettingComponent />
      </div>
    </AdminLayout>
  );
};
export default withAuth(Page);
