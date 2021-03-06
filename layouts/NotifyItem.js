import Router from 'next/router';
const { Menu, Typography, Tooltip, Empty } = require('antd');
const { BUYER } = require('../enums/accountRoles');
const { getLabelNotify, getFromNowTime } = require('../utils');
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
        {notify && notify.length > 0 ? (
          notify.map((item) => {
            const {
              group = {},
              invitation = {},
              request = {},
              reverseAuction = {},
              notificationType = {},
              id: notifyId,
              feedback = {},
              dateCreated,
              order
            } = item || {};

            const { id, description: title } =
              group ||
              request ||
              reverseAuction ||
              invitation ||
              feedback ||
              order ||
              {};
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
                <Tooltip title={label}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'start'
                    }}
                  >
                    <span className="dot-notify"></span>
                    <div>
                      <div
                        className="item-notify"
                        onClick={() => Router.push(link)}
                      >
                        <span>{label}</span>
                      </div>
                      <small>{getFromNowTime(dateCreated)}</small>
                    </div>
                  </div>
                </Tooltip>
              </Menu.Item>
            );
          })
        ) : (
          <Empty />
        )}
      </Menu.ItemGroup>
    </Menu>
  );
};

export default NotifyItem;
