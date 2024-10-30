import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faMastodon,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer
      className="footer"
      role="contentinfo"
      itemScope
      itemType="http://schema.org/WPFooter"
    >
      <img
        src="/public/logo.png"
        alt="Image"
        style={{
          width: "80px",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "20px",
        }}
      />
      <div
        className="social"
        role="navigation"
        aria-labelledby="social-heading"
      >
        <h3 id="social-heading" className="sr-only">
          Follow us on social media
        </h3>
        <a href="#" aria-label="Facebook">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a href="#" aria-label="Twitter">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a href="#" aria-label="Mastodon">
          <FontAwesomeIcon icon={faMastodon} />
        </a>
        <a href="#" aria-label="Instagram">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      </div>
      <hr className="footer-break" />
      <ul
        className="footer-links"
        role="navigation"
        aria-labelledby="footer-links-heading"
      >
        <h3 id="footer-links-heading" className="sr-only">
          Footer Links
        </h3>
        <li>
          <a href="#">Site Home</a>
        </li>
        <li>
          <a href="#">Playground</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#">Sitemap</a>
        </li>
        <li>
          <a href="#">Contents</a>
        </li>
      </ul>
      <p className="copyright">
        © 2024 SDavidPrince. Demo of a footer. Some Rights Reserved
      </p>
    </footer>
  );
}
