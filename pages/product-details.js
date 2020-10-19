import BuyerProductDetailsComponent from "../component/BuyerProductDetailsComponent";
import HomePageLayout from "../layouts/HomePageLayout";

function Page() {
  return (
    <HomePageLayout
      isAbout={false}
      isCta={false}
      isFeature={false}
      isOurTeam={false}
    >
      <BuyerProductDetailsComponent />
    </HomePageLayout>
  );
}

export default Page;
