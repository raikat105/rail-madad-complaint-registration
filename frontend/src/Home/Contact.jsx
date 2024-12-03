import React from "react";
// import img from "../Assets/Train.jpg";
import "../Home/Contact.css";
// import Footer from "../components/Footer.jsx";
const Contact = () => {
  return (
    <div className="contact">
      <div className="contact-contain">
        <div className="rside">
          <p className="para">Helpline Numbers:</p>
          <address className="identity">
            <p>Here are some railway helpline numbers:</p>
            <p>
            IRCTC customer care: 
            <a href="tel:07553934141" className="phone">0755-3934141</a>, 
            <p><a href="tel:07556610661" className="phone">0755-6610661</a>, or</p>
            <a href="tel:07554090600" className="phone">0755-4090600</a>
            </p>
            <p>
            Medical emergency: <a href="tel:138" className="phone">138</a>
            </p>
            <p>
            Railway Recruitment Cell: <a href="tel:02267643649" className="phone">02267643649</a>
            </p>
          </address>

          <p>
          <address className="identity">
            Contact IRCTC by email at -
            <a href="mailto:care@irctc.co.in" className="mail">care@irctc.co.in</a> 
            (for general information) 
            </address>
          </p>

        </div>
      </div>
      {/* <div className="img-contain">
        <div className="lside">
          <img src={img} alt="Train" className="image" />
        </div>
      </div> */}
      <div className="finish">
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Contact;