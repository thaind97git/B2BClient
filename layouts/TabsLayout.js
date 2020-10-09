import { Tabs } from "antd";
import React, { useEffect } from "react";

const { TabPane } = Tabs;

const TabsLayout = ({
  tabs = [],
  defaultTab = 0,
  setDefaultTab,
  ...others
}) => {
  const [value, setValue] = React.useState(defaultTab);
  useEffect(() => {
    setValue(defaultTab);
  }, [defaultTab]);

  const callback = (key) => {
    setValue(key);
    typeof setDefaultTab === "function" && setDefaultTab(key);
  };
  return (
    <Tabs
      defaultActiveKey={value}
      activeKey={value}
      onChange={callback}
      {...others}
    >
      {tabs.map((tab) => {
        return (
          <TabPane tab={tab.title} key={tab.key} {...tab.props}>
            {tab.content}
          </TabPane>
        );
      })}
    </Tabs>
  );
};
export default TabsLayout;
