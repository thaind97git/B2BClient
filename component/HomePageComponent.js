import React from "react";

let Page = require("../public/static/homepage/index.html");
const getHTML = () => Object.assign({}, { __html: Page });

//TODO: merge login pages or display the url more accuracy and more convenient

const HomePageComponent = () => {
  const htmlDoc = getHTML();

  return (
    <div>
      <div dangerouslySetInnerHTML={htmlDoc} suppressHydrationWarning={true} />
    </div>
  );
};

export default HomePageComponent;
