import React from 'react';

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className="user-layout-container">
        <div
          className="content"
          style={{ background: 'transparent', marginTop: 140 }}
        >
          <div className="top">
            <div className="header">
              <a href="/">
                {/* <img
                    alt="logo"
                    className="logo"
                    src="/static/images/logo.png"
                  /> */}
                <span className="title">B2BMarket</span>
              </a>
            </div>
            <div className="desc">
              Get quotations from the most suitable suppliers
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }
}

export default UserLayout;
