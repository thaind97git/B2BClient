import Router from "next/router";
import { useEffect } from "react";
const Page = () => {
  useEffect(() => {
    Router.push("/admin/product");
  }, []);
  return null;
};
export default Page;
