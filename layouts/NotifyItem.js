import Router from 'next/router';
const { Menu, Typography } = require('antd');
const { BUYER } = require('../enums/accountRoles');
const { getLabelNotify } = require('../utils');
const { Title } = Typography;
const moment = require('moment');
const NotifyItem = ({ notify = [], role = BUYER }) => {
  return (
    <Menu style={{ width: 360, maxHeight: '90vh', overflowY: 'scroll' }}>
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
          console.log({ title });
          const { label, link } = getLabelNotify({
            type: (notificationType || {}).id,
            id,
            role,
            title
          });
          console.log({ label });
          return (
            <Menu.Item
              onClick={() => Router.push(link)}
              className="dropdown-notify"
              key={notifyId}
            >
              <div className="item-notify" onClick={() => Router.push(link)}>
                <span>{label}</span>
                <br />
                <small>{moment.utc(dateCreated).local().fromNow()}</small>
              </div>
            </Menu.Item>
          );
        })}
      </Menu.ItemGroup>
    </Menu>
  );
};

export default NotifyItem;
