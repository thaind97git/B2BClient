import Router from 'next/router';
const { Menu, Typography } = require('antd');
const { BUYER } = require('../enums/accountRoles');
const { getLabelNotify } = require('../utils');
const { Title } = Typography;
const moment = require('moment');
const NotifyItem = ({ notify = [], role = BUYER }) => {
  return (
    <Menu
      className="shadow"
      style={{
        width: 360,
        paddingBottom: 24,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}
    >
      <Menu.ItemGroup title={<Title level={4}>Notification</Title>}>
        {notify.map((item) => {
          const {
            group = {},
            invitation = {},
            request = {},
            reverseAuction = {},
            notificationType = {},
            id: notifyId,
            feedback = {},
            dateCreated
          } = item || {};

          const { id, description: title } =
            group || request || reverseAuction || invitation || feedback || {};
          const { label, link } = getLabelNotify({
            type: (notificationType || {}).id,
            id,
            role,
            title
          });
          return (
            <Menu.Item
              onClick={() => Router.push(link)}
              className="dropdown-notify"
              key={notifyId}
            >
              <div className="item-notify" onClick={() => Router.push(link)}>
                <span>{label}</span>
              </div>
              <small>{moment.utc(dateCreated).local().fromNow()}</small>
            </Menu.Item>
          );
        })}
      </Menu.ItemGroup>
    </Menu>
  );
};

export default NotifyItem;
