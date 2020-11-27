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
                {/* <span className="title">B2BMarket</span> */}
                <img
                  style={{
                    width: 400
                  }}
                  src="/static/images/logo.png"
                  alt="B2B Market"
                />
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
