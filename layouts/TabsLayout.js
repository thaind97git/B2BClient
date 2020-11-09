import { Tabs, Tooltip } from 'antd';
import React, { useEffect } from 'react';

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
    typeof setDefaultTab === 'function' && setDefaultTab(key);
  };
  return (
    <Tabs
      defaultActiveKey={value}
      activeKey={value}
      onChange={callback}
      {...others}
    >
      {tabs &&
        tabs.map((tab) => {
          const { title, tooltipTitle, key, content, ...props } = tab || {};
          return !!tooltipTitle ? (
            <TabPane
              tab={<Tooltip title={tooltipTitle}>{title}</Tooltip>}
              key={key}
              {...props}
            >
              {defaultTab === key ? content : (tabs[0] || {}).content}
            </TabPane>
          ) : (
            <TabPane tab={title} key={key} {...props}>
              {defaultTab === key ? content : (tabs[0] || {}).content}
            </TabPane>
          );
        })}
    </Tabs>
  );
};
export default TabsLayout;
