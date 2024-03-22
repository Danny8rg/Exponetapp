import "./Footer.css";
import { IoIosMail } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io";

function Footer() {

  return (
    <>
      <footer>
        <div className="box-footer-txt">
          <h3>EXPONET | 2024 &copy;</h3>
        </div>
        <div className="social-media">
          <div className="icon gmail">
            <div className="tool">Mail</div>
            <a href="mailto:{bernalmateoa@gmail.com}">
              <i>
                <IoIosMail className="react-icon-mail" />
              </i>
            </a>
          </div>
          <div className="icon whatsapp">
            <div className="tool">WhatsApp</div>
            <a
              href="https://wa.me/+573132538608"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i>
                <IoLogoWhatsapp className="react-icon-wpp" />
              </i>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
