import "./Footer.css";
import { IoIosMail } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io";

function Footer() {

  return (
    <>
      <footer className="bg-gray-100">
        <div className="box-footer">
          <div className="box-footer-txt">
            <h3>EXPONET | 2024 &copy;</h3>
          </div>
          <div className="social-media">
            <div className="icon gmail">
              <div className="tool shadow-sm">Mail</div>
              <a className="shadow-sm" href="mailto:{bernalmateoa@gmail.com}">
                <i>
                  <IoIosMail className="react-icon-mail" />
                </i>
              </a>
            </div>
            <div className="icon whatsapp">
              <div className="tool shadow-sm">WhatsApp</div>
              <a className="shadow-sm"
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

        </div>
      </footer>
    </>
  );
}

export default Footer;
