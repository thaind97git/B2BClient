import React from "react";
import Link from "next/link";
import Exception from "../component/Exception.";

const Exception403 = () => (
  <Exception
    type="403"
    desc="Sorry, you don't have access to this page"
    linkElement={Link}
    backText="Back to home"
  />
);

export default Exception403;
