import Router from "next/router";
import React, { useEffect } from "react";
const Page = () => {
  useEffect(() => {
    Router.push("/admin/product");
  }, []);
  return null;
};
export default Page;
