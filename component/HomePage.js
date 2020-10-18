import React, { Fragment } from "react";
import ProductListHomePageComponent from "./ProductListHomePageComponent";

const HomePage = () => {
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
      {/* <link
        href="/static/homepage/assets/vendor/venobox/venobox.css"
        rel="stylesheet"
      /> */}
      <link
        href="/static/homepage/assets/vendor/font-awesome/css/font-awesome.min.css"
        rel="stylesheet"
      />

      <link href="/static/homepage/assets/css/style.css" rel="stylesheet" />
      <section class="hero">
        <div class="container text-center">
          <div class="row">
            <div class="col-md-12">
              <a
                style={{ fontSize: 48 }}
                class="hero-brand"
                href="/"
                title="Home"
              >
                B2B Market
              </a>
            </div>
          </div>

          <div class="col-md-12">
            <h1 style={{ color: "white" }}>VIETNAM SOURCING MARKETPLACE</h1>
            <p class="tagline">
              Get quotations from the most suitable suppliers
            </p>
            <a
              class="btn btn-full scrollto"
              href="/login?returnUrl=/buyer/rfq/create"
            >
              Register
            </a>
            <span>&nbsp;&nbsp;</span>
            Or
            <a
              style={{ paddingLeft: 8 }}
              class="im-supplier"
              href="/login?returnUrl=/supplier"
            >
              Login
            </a>
          </div>
          {/* <div class="col-md-12">
            <a class="im-supplier" href="#product">
              Our Products
              <DownOutlined />
            </a>
          </div> */}
        </div>
      </section>

      <header id="header">
        <div class="container">
          <div id="logo" class="pull-left">
            <a style={{ fontSize: 24, color: "white" }} href="/">
              B2B Market
            </a>
          </div>

          <nav id="nav-menu-container">
            <ul class="nav-menu">
              <li>
                <a href="#product">Products</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#team">Team</a>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
            </ul>
          </nav>

          <nav class="nav social-nav pull-right d-none d-lg-inline">
            <a href="#">
              <i class="fa fa-twitter"></i>
            </a>
            <a href="#">
              <i class="fa fa-facebook"></i>
            </a>
            <a href="#">
              <i class="fa fa-linkedin"></i>
            </a>
            <a href="#">
              <i class="fa fa-envelope"></i>
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <div
          style={{ marginTop: 24, marginBottom: 24 }}
          class="product"
          id="product"
        >
          <div class="container-fluid">
            <ProductListHomePageComponent />
          </div>
        </div>

        <section class="welcome text-center about" id="about">
          <div class="container text-center">
            <h2>About B2B Market</h2>

            <p>
              Voluptua scripserit per ad, laudem viderer sit ex. Ex alia
              corrumpit voluptatibus usu, sed unum convenire id. Ut cum nisl
              moderatius, per nihil dicant commodo an. Eum tacimates erroribus
              ad. Atqui feugiat euripidis ea pri, sed veniam tacimates ex.
              Menandri temporibus an duo.
            </p>

            <div class="row stats-row">
              <div class="stats-col text-center col-md-3 col-sm-6">
                <div class="circle">
                  <span class="stats-no" data-toggle="counter-up">
                    232
                  </span>{" "}
                  Satisfied Customers
                </div>
              </div>

              <div class="stats-col text-center col-md-3 col-sm-6">
                <div class="circle">
                  <span class="stats-no" data-toggle="counter-up">
                    79
                  </span>{" "}
                  Released Projects
                </div>
              </div>

              <div class="stats-col text-center col-md-3 col-sm-6">
                <div class="circle">
                  <span class="stats-no" data-toggle="counter-up">
                    1,463
                  </span>{" "}
                  Hours Of Support
                </div>
              </div>

              <div class="stats-col text-center col-md-3 col-sm-6">
                <div class="circle">
                  <span class="stats-no" data-toggle="counter-up">
                    15
                  </span>{" "}
                  Hard Workers
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="features" id="features">
          <div class="container">
            <h2 class="text-center">Features</h2>

            <div class="row">
              <div class="feature-col col-lg-4 col-xs-12">
                <div class="card card-block text-center">
                  <div>
                    <div class="feature-icon">
                      <span class="fa fa-rocket"></span>
                    </div>
                  </div>

                  <div>
                    <h3>Custom Design</h3>

                    <p>
                      Eque feugiat contentiones ei has. Id summo mundi explicari
                      his, nec in maiorum scriptorem.
                    </p>
                  </div>
                </div>
              </div>

              <div class="feature-col col-lg-4 col-xs-12">
                <div class="card card-block text-center">
                  <div>
                    <div class="feature-icon">
                      <span class="fa fa-envelope"></span>
                    </div>
                  </div>

                  <div>
                    <h3>Responsive Layout</h3>

                    <p>
                      Eque feugiat contentiones ei has. Id summo mundi explicari
                      his, nec in maiorum scriptorem.
                    </p>
                  </div>
                </div>
              </div>

              <div class="feature-col col-lg-4 col-xs-12">
                <div class="card card-block text-center">
                  <div>
                    <div class="feature-icon">
                      <span class="fa fa-bell"></span>
                    </div>
                  </div>

                  <div>
                    <h3>Innovative Ideas</h3>

                    <p>
                      Eque feugiat contentiones ei has. Id summo mundi explicari
                      his, nec in maiorum scriptorem.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="feature-col col-lg-4 col-xs-12">
                <div class="card card-block text-center">
                  <div>
                    <div class="feature-icon">
                      <span class="fa fa-database"></span>
                    </div>
                  </div>

                  <div>
                    <h3>Good Documentation</h3>

                    <p>
                      Eque feugiat contentiones ei has. Id summo mundi explicari
                      his, nec in maiorum scriptorem.
                    </p>
                  </div>
                </div>
              </div>

              <div class="feature-col col-lg-4 col-xs-12">
                <div class="card card-block text-center">
                  <div>
                    <div class="feature-icon">
                      <span class="fa fa-cutlery"></span>
                    </div>
                  </div>

                  <div>
                    <h3>Excellent Features</h3>

                    <p>
                      Eque feugiat contentiones ei has. Id summo mundi explicari
                      his, nec in maiorum scriptorem.
                    </p>
                  </div>
                </div>
              </div>

              <div class="feature-col col-lg-4 col-xs-12">
                <div class="card card-block text-center">
                  <div>
                    <div class="feature-icon">
                      <span class="fa fa-dashboard"></span>
                    </div>
                  </div>

                  <div>
                    <h3>Retina Ready</h3>
                    <p>
                      Eque feugiat contentiones ei has. Id summo mundi explicari
                      his, nec in maiorum scriptorem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="cta">
          <div class="container">
            <div class="row">
              <div class="col-lg-9 col-sm-12 text-lg-left text-center">
                <h2>Call to Action Section</h2>

                <p>
                  Lorem ipsum dolor sit amet, nec ad nisl mandamus imperdiet, ut
                  corpora cotidieque cum. Et brute iracundia his, est eu idque
                  dictas gubergren
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="team" id="team">
          <div class="container">
            <h2 class="text-center">Meet our team</h2>

            <div class="row">
              <div class="col-sm-3 col-xs-6">
                <div class="card card-block">
                  <a href="#">
                    <img
                      alt=""
                      class="team-img"
                      src="/static/homepage/assets/img/team-1.jpg"
                    />
                    <div class="card-title-wrap">
                      <span class="card-title">Sergio Fez</span>
                      <span class="card-text">Art Director</span>
                    </div>

                    <div class="team-over">
                      <h4 class="hidden-md-down">Connect with me</h4>

                      <nav class="social-nav">
                        <a href="#">
                          <i class="fa fa-twitter"></i>
                        </a>
                        <a href="#">
                          <i class="fa fa-facebook"></i>
                        </a>
                        <a href="#">
                          <i class="fa fa-linkedin"></i>
                        </a>
                        <a href="#">
                          <i class="fa fa-envelope"></i>
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

              <div class="col-sm-3 col-xs-6">
                <div class="card card-block">
                  <a href="#">
                    <img
                      alt=""
                      class="team-img"
                      src="/static/homepage/assets/img/team-2.jpg"
                    />
                    <div class="card-title-wrap">
                      <span class="card-title">Sergio Fez</span>
                      <span class="card-text">Art Director</span>
                    </div>

                    <div class="team-over">
                      <h4 class="hidden-md-down">Connect with me</h4>

                      <nav class="social-nav">
                        <a href="#">
                          <i class="fa fa-twitter"></i>
                        </a>
                        <a href="#">
                          <i class="fa fa-facebook"></i>
                        </a>
                        <a href="#">
                          <i class="fa fa-linkedin"></i>
                        </a>
                        <a href="#">
                          <i class="fa fa-envelope"></i>
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

              <div class="col-sm-3 col-xs-6">
                <div class="card card-block">
                  <a href="#">
                    <img
                      alt=""
                      class="team-img"
                      src="/static/homepage/assets/img/team-3.jpg"
                    />
                    <div class="card-title-wrap">
                      <span class="card-title">Sergio Fez</span>
                      <span class="card-text">Art Director</span>
                    </div>

                    <div class="team-over">
                      <h4 class="hidden-md-down">Connect with me</h4>

                      <nav class="social-nav">
                        <a href="#">
                          <i class="fa fa-twitter"></i>
                        </a>
                        <a href="#">
                          <i class="fa fa-facebook"></i>
                        </a>
                        <a href="#">
                          <i class="fa fa-linkedin"></i>
                        </a>
                        <a href="#">
                          <i class="fa fa-envelope"></i>
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

              <div class="col-sm-3 col-xs-6">
                <div class="card card-block">
                  <a href="#">
                    <img
                      alt=""
                      class="team-img"
                      src="/static/homepage/assets/img/team-4.jpg"
                    />
                    <div class="card-title-wrap">
                      <span class="card-title">Sergio Fez</span>
                      <span class="card-text">Art Director</span>
                    </div>

                    <div class="team-over">
                      <h4 class="hidden-md-down">Connect with me</h4>

                      <nav class="social-nav">
                        <a href="#">
                          <i class="fa fa-twitter"></i>
                        </a>
                        <a href="#">
                          <i class="fa fa-facebook"></i>
                        </a>
                        <a href="#">
                          <i class="fa fa-linkedin"></i>
                        </a>
                        <a href="#">
                          <i class="fa fa-envelope"></i>
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

        <section id="contact">
          <div class="container">
            <div class="row">
              <div class="col-md-12 text-center">
                <h2 class="section-title">Contact Us</h2>
              </div>
            </div>

            <div class="row justify-content-center">
              <div class="col-lg-3 col-md-4">
                <div class="info">
                  <div>
                    <i class="fa fa-map-marker"></i>
                    <p>
                      A108 Adam Street
                      <br />
                      New York, NY 535022
                    </p>
                  </div>

                  <div>
                    <i class="fa fa-envelope"></i>
                    <p>info@example.com</p>
                  </div>

                  <div>
                    <i class="fa fa-phone"></i>
                    <p>+1 5589 55488 55s</p>
                  </div>
                </div>
              </div>

              <div class="col-lg-5 col-md-8">
                <div class="form">
                  <form
                    action="forms/contact.php"
                    method="post"
                    class="php-email-form"
                  >
                    <div class="form-group">
                      <input
                        type="text"
                        name="name"
                        class="form-control"
                        id="name"
                        placeholder="Your Name"
                        data-rule="minlen:4"
                        data-msg="Please enter at least 4 chars"
                      />
                      <div class="validate"></div>
                    </div>
                    <div class="form-group">
                      <input
                        type="email"
                        class="form-control"
                        name="email"
                        id="email"
                        placeholder="Your Email"
                        data-rule="email"
                        data-msg="Please enter a valid email"
                      />
                      <div class="validate"></div>
                    </div>
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control"
                        name="subject"
                        id="subject"
                        placeholder="Subject"
                        data-rule="minlen:4"
                        data-msg="Please enter at least 8 chars of subject"
                      />
                      <div class="validate"></div>
                    </div>
                    <div class="form-group">
                      <textarea
                        class="form-control"
                        name="message"
                        rows="5"
                        data-rule="required"
                        data-msg="Please write something for us"
                        placeholder="Message"
                      ></textarea>
                      <div class="validate"></div>
                    </div>
                    <div class="mb-3">
                      <div class="loading">Loading</div>
                      <div class="error-message"></div>
                      <div class="sent-message">
                        Your message has been sent. Thank you!
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit">Send Message</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer class="site-footer">
        <div class="bottom">
          <div class="container">
            <div class="row">
              <div class="col-lg-6 col-xs-12 text-lg-left text-center">
                <p class="copyright-text">
                  &copy; Copyright <strong>B2B Market</strong>. All Rights
                  Reserved
                </p>
                <div class="credits"></div>
              </div>

              <div class="col-lg-6 col-xs-12 text-lg-right text-center">
                <ul class="list-inline">
                  <li class="list-inline-item">
                    <a href="index.html">Home</a>
                  </li>

                  <li class="list-inline-item">
                    <a href="#about">About Us</a>
                  </li>

                  <li class="list-inline-item">
                    <a href="#features">Features</a>
                  </li>

                  <li class="list-inline-item">
                    <a href="#portfolio">Portfolio</a>
                  </li>

                  <li class="list-inline-item">
                    <a href="#team">Team</a>
                  </li>

                  <li class="list-inline-item">
                    <a href="#contact">Contact</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <a class="scrolltop" href="#">
        <span class="fa fa-angle-up"></span>
      </a>
      {/* <BackTop>
        <span class="fa fa-angle-up"></span>
      </BackTop> */}
    </Fragment>
  );
};

export default HomePage;
