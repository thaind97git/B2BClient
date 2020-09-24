import React from "react";
import Link from "next/link";
import Exception from "../component/Exception.";

const Exception500 = () => (
  <Exception
    type="500"
    desc="Sorry, the server is reporting an error"
    linkElement={Link}
    backText="Back to home"
  />
);

export default Exception500;
