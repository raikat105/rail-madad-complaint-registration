import React from "react";
import img from "../Assets/Train.jpg";
import "./Contact.css";
// import Footer from "../components/Footer";
const Contact = () => {
  return (
    <div className="contact">
      <div className="contact-contain">
        <div className="rside">
          <p className="para">Contact Us</p>
          <address className="identity">
            T-81, Subhaspally, Kamdahari, Garia, Kolkata-700084
          </address>
          <a href="mailto: ishanmajumder28@gmail.com" className="mail">
            (91)8100486674
          </a>
        </div>
      </div>
      <div className="img-contain">
        <div className="lside">
          <img src={img} alt="Train" className="image" />
        </div>
      </div>
      <div className="finish">
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Contact;
