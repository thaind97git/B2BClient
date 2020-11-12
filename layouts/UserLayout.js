import React, { Fragment } from 'react';
import Link from 'next/link';

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
              <Link href="/">
                <Fragment>
                  {/* <img
                    alt="logo"
                    className="logo"
                    src="/static/images/logo.png"
                  /> */}
                  <span className="title">B2BMarket</span>
                </Fragment>
              </Link>
            </div>
            <div className="desc">
              Get quotations from the most suitable suppliers
            </div>
          </div>
          {children}
        </div>
        {/* <div className="globalFooter">
          <div className="copyright">
            Copyright <Icon type="copyright" /> 2020 B2BMarket Team
          </div>
        </div> */}
      </div>
    );
  }
}

export default UserLayout;
