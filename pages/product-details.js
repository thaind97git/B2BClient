import BuyerProductDetailsComponent from '../component/BuyerProductDetailsComponent';
import HomePageLayout from '../layouts/HomePageLayout';

function Page() {
  return (
    <HomePageLayout isCategory>
      <BuyerProductDetailsComponent />
    </HomePageLayout>
  );
}

export default Page;
