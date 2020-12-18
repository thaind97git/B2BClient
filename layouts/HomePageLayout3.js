import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { BUYER, MODERATOR, SUPPLIER } from '../enums/accountRoles';
import { removeToken } from '../libs/localStorage';
import {
  CurrentUserData,
  CurrentUserResetter,
  getCurrentUser
} from '../stores/UserState';

const connectToRedux = connect(
  createStructuredSelector({
    currentUserData: CurrentUserData
  }),
  (dispatch) => ({
    getCurrentUser: () => dispatch(getCurrentUser({ isVerify: false })),
    resetData: () => dispatch(CurrentUserResetter)
  })
);

const HomePageLayout = ({
  children,
  isAbout = true,
  isFeature = true,
  isOurTeam = true,
  isCta = true,
  currentUserData,
  getCurrentUser,
  resetData
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  useEffect(() => {
    if (
      currentUserData &&
      (currentUserData.role === SUPPLIER ||
        currentUserData.role === BUYER ||
        currentUserData.role === MODERATOR)
    ) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [currentUserData]);

  let url = '';
  if (currentUserData) {
    if (currentUserData.role === BUYER) {
      url = '/buyer/user-profile';
    }
    if (currentUserData.role === SUPPLIER) {
      url = '/supplier';
    }
    if (currentUserData.role === MODERATOR) {
      url = '/aggregator';
    }
  }
  return (
    <Fragment>
      <link
        href="/static/homepage/assets/img/apple-touch-icon.png"
        rel="apple-touch-icon"
      />

      <link
        href="https://fonts.googleapis.com/css?family=Raleway:400,500,700|Roboto:400,900"
        rel="stylesheet"
      />

      <link
        href="/static/homepage/assets/vendor/bootstrap/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="/static/homepage/assets/vendor/venobox/venobox.css"
        rel="stylesheet"
      />
      <link
        href="/static/homepage/assets/vendor/font-awesome/css/font-awesome.min.css"
        rel="stylesheet"
      />

      <link href="/static/homepage/assets/css/style.css" rel="stylesheet" />

      <header id="header">
        <div className="container">
          <div id="logo" className="pull-left">
            <a href="/">
              <img
                style={{
                  width: 120
                }}
                src="/static/images/logo-white.png"
                alt="B2B Market"
              />
            </a>
          </div>

          <nav id="nav-menu-container">
            <ul className="nav-menu">
              <li>
                <a href="#product">Products</a>
              </li>
              {isAbout && (
                <li>
                  <a href="#about">About Us</a>
                </li>
              )}
              {isFeature && (
                <li>
                  <a href="#features">Features</a>
                </li>
              )}
              {isCta && (
                <li>
                  <a href="#team">Team</a>
                </li>
              )}
              <li>
                <a href="#contact">Contact Us</a>
              </li>
            </ul>
          </nav>

          <nav className="nav social-nav pull-right d-none d-lg-inline">
            <a href="#">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="#">
              <i className="fa fa-linkedin"></i>
            </a>
            <a href="#">
              <i className="fa fa-envelope"></i>
            </a>
            {isAuthenticated ? (
              <Fragment>
                <a href={url} style={{ fontSize: 14 }}>
                  Hi, {(currentUserData || {}).lastName}
                </a>
                <a
                  href="/login"
                  style={{ fontSize: 14 }}
                  onClick={() => removeToken()}
                >
                  Logout
                </a>
              </Fragment>
            ) : (
              <Fragment>
                <a
                  style={{ fontSize: 18 }}
                  className="im-supplier scrollto"
                  href="/login"
                >
                  Login
                </a>
                <a
                  style={{ fontSize: 18 }}
                  className="scrollto"
                  href="/register"
                >
                  Register
                </a>
              </Fragment>
            )}
            {/* {
              currentUserData && currentUserData.role === SUPPLIER && 
            } */}
          </nav>
        </div>
      </header>

      <main id="main">
        {children}

        {isAbout && (
          <section className="welcome text-center about" id="about">
            <div className="container text-center">
              <h2>About B2B Market</h2>

              <p>
                Voluptua scripserit per ad, laudem viderer sit ex. Ex alia
                corrumpit voluptatibus usu, sed unum convenire id. Ut cum nisl
                moderatius, per nihil dicant commodo an. Eum tacimates erroribus
                ad. Atqui feugiat euripidis ea pri, sed veniam tacimates ex.
                Menandri temporibus an duo.
              </p>

              <div className="row stats-row">
                <div className="stats-col text-center col-md-3 col-sm-6">
                  <div className="circle">
                    <span className="stats-no" data-toggle="counter-up">
                      232
                    </span>{' '}
                    Satisfied Customers
                  </div>
                </div>

                <div className="stats-col text-center col-md-3 col-sm-6">
                  <div className="circle">
                    <span className="stats-no" data-toggle="counter-up">
                      79
                    </span>{' '}
                    Released Projects
                  </div>
                </div>

                <div className="stats-col text-center col-md-3 col-sm-6">
                  <div className="circle">
                    <span className="stats-no" data-toggle="counter-up">
                      1,463
                    </span>{' '}
                    Hours Of Support
                  </div>
                </div>

                <div className="stats-col text-center col-md-3 col-sm-6">
                  <div className="circle">
                    <span className="stats-no" data-toggle="counter-up">
                      15
                    </span>{' '}
                    Hard Workers
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {isFeature && (
          <section className="features" id="features">
            <div className="container">
              <h2 className="text-center">Features</h2>

              <div className="row">
                <div className="feature-col col-lg-4 col-xs-12">
                  <div className="card card-block text-center">
                    <div>
                      <div className="feature-icon">
                        <span className="fa fa-rocket"></span>
                      </div>
                    </div>

                    <div>
                      <h3>Custom Design</h3>

                      <p>
                        Eque feugiat contentiones ei has. Id summo mundi
                        explicari his, nec in maiorum scriptorem.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-col col-lg-4 col-xs-12">
                  <div className="card card-block text-center">
                    <div>
                      <div className="feature-icon">
                        <span className="fa fa-envelope"></span>
                      </div>
                    </div>

                    <div>
                      <h3>Responsive Layout</h3>

                      <p>
                        Eque feugiat contentiones ei has. Id summo mundi
                        explicari his, nec in maiorum scriptorem.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-col col-lg-4 col-xs-12">
                  <div className="card card-block text-center">
                    <div>
                      <div className="feature-icon">
                        <span className="fa fa-bell"></span>
                      </div>
                    </div>

                    <div>
                      <h3>Innovative Ideas</h3>

                      <p>
                        Eque feugiat contentiones ei has. Id summo mundi
                        explicari his, nec in maiorum scriptorem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="feature-col col-lg-4 col-xs-12">
                  <div className="card card-block text-center">
                    <div>
                      <div className="feature-icon">
                        <span className="fa fa-database"></span>
                      </div>
                    </div>

                    <div>
                      <h3>Good Documentation</h3>

                      <p>
                        Eque feugiat contentiones ei has. Id summo mundi
                        explicari his, nec in maiorum scriptorem.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-col col-lg-4 col-xs-12">
                  <div className="card card-block text-center">
                    <div>
                      <div className="feature-icon">
                        <span className="fa fa-cutlery"></span>
                      </div>
                    </div>

                    <div>
                      <h3>Excellent Features</h3>

                      <p>
                        Eque feugiat contentiones ei has. Id summo mundi
                        explicari his, nec in maiorum scriptorem.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="feature-col col-lg-4 col-xs-12">
                  <div className="card card-block text-center">
                    <div>
                      <div className="feature-icon">
                        <span className="fa fa-dashboard"></span>
                      </div>
                    </div>

                    <div>
                      <h3>Retina Ready</h3>
                      <p>
                        Eque feugiat contentiones ei has. Id summo mundi
                        explicari his, nec in maiorum scriptorem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {isCta && (
          <section className="cta">
            <div className="container">
              <div className="row">
                <div className="col-lg-9 col-sm-12 text-lg-left text-center">
                  <h2>Call to Action Section</h2>

                  <p>
                    Lorem ipsum dolor sit amet, nec ad nisl mandamus imperdiet,
                    ut corpora cotidieque cum. Et brute iracundia his, est eu
                    idque dictas gubergren
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {isOurTeam && (
          <section className="team" id="team">
            <div className="container">
              <h2 className="text-center">Meet our team</h2>

              <div className="row">
                <div className="col-sm-3 col-xs-6">
                  <div className="card card-block">
                    <a href="#">
                      <img
                        alt=""
                        className="team-img"
                        src="/static/homepage/assets/img/team-1.jpg"
                      />
                      <div className="card-title-wrap">
                        <span className="card-title">Sergio Fez</span>
                        <span className="card-text">Art Director</span>
                      </div>

                      <div className="team-over">
                        <h4 className="hidden-md-down">Connect with me</h4>

                        <nav className="social-nav">
                          <a href="#">
                            <i className="fa fa-twitter"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-facebook"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-linkedin"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-envelope"></i>
                          </a>
                        </nav>

                        <p>
                          Lorem ipsum dolor sit amet, eu sed suas eruditi
                          honestatis.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="col-sm-3 col-xs-6">
                  <div className="card card-block">
                    <a href="#">
                      <img
                        alt=""
                        className="team-img"
                        src="/static/homepage/assets/img/team-2.jpg"
                      />
                      <div className="card-title-wrap">
                        <span className="card-title">Sergio Fez</span>
                        <span className="card-text">Art Director</span>
                      </div>

                      <div className="team-over">
                        <h4 className="hidden-md-down">Connect with me</h4>

                        <nav className="social-nav">
                          <a href="#">
                            <i className="fa fa-twitter"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-facebook"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-linkedin"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-envelope"></i>
                          </a>
                        </nav>

                        <p>
                          Lorem ipsum dolor sit amet, eu sed suas eruditi
                          honestatis.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="col-sm-3 col-xs-6">
                  <div className="card card-block">
                    <a href="#">
                      <img
                        alt=""
                        className="team-img"
                        src="/static/homepage/assets/img/team-3.jpg"
                      />
                      <div className="card-title-wrap">
                        <span className="card-title">Sergio Fez</span>
                        <span className="card-text">Art Director</span>
                      </div>

                      <div className="team-over">
                        <h4 className="hidden-md-down">Connect with me</h4>

                        <nav className="social-nav">
                          <a href="#">
                            <i className="fa fa-twitter"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-facebook"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-linkedin"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-envelope"></i>
                          </a>
                        </nav>

                        <p>
                          Lorem ipsum dolor sit amet, eu sed suas eruditi
                          honestatis.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="col-sm-3 col-xs-6">
                  <div className="card card-block">
                    <a href="#">
                      <img
                        alt=""
                        className="team-img"
                        src="/static/homepage/assets/img/team-4.jpg"
                      />
                      <div className="card-title-wrap">
                        <span className="card-title">Sergio Fez</span>
                        <span className="card-text">Art Director</span>
                      </div>

                      <div className="team-over">
                        <h4 className="hidden-md-down">Connect with me</h4>

                        <nav className="social-nav">
                          <a href="#">
                            <i className="fa fa-twitter"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-facebook"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-linkedin"></i>
                          </a>
                          <a href="#">
                            <i className="fa fa-envelope"></i>
                          </a>
                        </nav>

                        <p>
                          Lorem ipsum dolor sit amet, eu sed suas eruditi
                          honestatis.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        <section id="contact">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h2 className="section-title">Contact Us</h2>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-lg-3 col-md-4">
                <div className="info">
                  <div>
                    <i className="fa fa-map-marker"></i>
                    <p>
                      A108 Adam Street
                      <br />
                      New York, NY 535022
                    </p>
                  </div>

                  <div>
                    <i className="fa fa-envelope"></i>
                    <p>info@example.com</p>
                  </div>

                  <div>
                    <i className="fa fa-phone"></i>
                    <p>+1 5589 55488 55s</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-5 col-md-8">
                <div className="form">
                  <form
                    action="forms/contact.php"
                    method="post"
                    className="php-email-form"
                  >
                    <div className="form-group">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Your Name"
                        data-rule="minlen:4"
                        data-msg="Please enter at least 4 chars"
                      />
                      <div className="validate"></div>
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        placeholder="Your Email"
                        data-rule="email"
                        data-msg="Please enter a valid email"
                      />
                      <div className="validate"></div>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        name="subject"
                        id="subject"
                        placeholder="Subject"
                        data-rule="minlen:4"
                        data-msg="Please enter at least 8 chars of subject"
                      />
                      <div className="validate"></div>
                    </div>
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        name="message"
                        rows="5"
                        data-rule="required"
                        data-msg="Please write something for us"
                        placeholder="Message"
                      ></textarea>
                      <div className="validate"></div>
                    </div>
                    <div className="mb-3">
                      <div className="loading">Loading</div>
                      <div className="error-message"></div>
                      <div className="sent-message">
                        Your message has been sent. Thank you!
                      </div>
                    </div>
                    <div className="text-center">
                      <button type="submit">Send Message</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="bottom">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-xs-12 text-lg-left text-center">
                <p className="copyright-text">
                  &copy; Copyright <strong>B2B Market</strong>. All Rights
                  Reserved
                </p>
                <div className="credits"></div>
              </div>

              <div className="col-lg-6 col-xs-12 text-lg-right text-center">
                <ul className="list-inline">
                  <li className="list-inline-item">
                    <a href="index.html">Home</a>
                  </li>

                  <li className="list-inline-item">
                    <a href="#about">About Us</a>
                  </li>

                  <li className="list-inline-item">
                    <a href="#features">Features</a>
                  </li>

                  <li className="list-inline-item">
                    <a href="#portfolio">Portfolio</a>
                  </li>

                  <li className="list-inline-item">
                    <a href="#team">Team</a>
                  </li>

                  <li className="list-inline-item">
                    <a href="#contact">Contact</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <a className="scrolltop" href="#">
        <span className="fa fa-angle-up"></span>
      </a>
      <script src="/static/homepage/assets/vendor/jquery/jquery.min.js"></script>
      <script src="/static/homepage/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
      <script src="/static/homepage/assets/vendor/jquery.easing/jquery.easing.min.js"></script>
      <script src="/static/homepage/assets/vendor/php-email-form/validate.js"></script>
      <script src="/static/homepage/assets/vendor/counterup/counterup.min.js"></script>
      <script src="/static/homepage/assets/vendor/tether/js/tether.min.js"></script>
      <script src="/static/homepage/assets/vendor/jquery-sticky/jquery.sticky.js"></script>
      <script src="/static/homepage/assets/vendor/venobox/venobox.min.js"></script>
      <script src="/static/homepage/assets/vendor/lockfixed/jquery.lockfixed.min.js"></script>
      <script src="/static/homepage/assets/vendor/waypoints/jquery.waypoints.min.js"></script>
      <script src="/static/homepage/assets/vendor/superfish/superfish.min.js"></script>
      <script src="/static/homepage/assets/vendor/hoverIntent/hoverIntent.js"></script>

      <script src="/static/homepage/assets/js/main.js"></script>
      {/* <BackTop>
  <span className="fa fa-angle-up"></span>
</BackTop> */}
    </Fragment>
  );
};

export default connectToRedux(HomePageLayout);
