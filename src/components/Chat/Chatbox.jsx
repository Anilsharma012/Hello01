import React, { useState } from "react";
import "./Chatbox.css";

// 🖼️ Custom chat icons
import chatIcon from "../../images/Chatlogo-removebg-preview.png"; // closed state icon
import whatsappIcon from "../../images/whatsaap1.webp";
import telegramIcon from "../../images/telegram_logo_icon_147228.png";
import askIcon from "../../images/Team/chat.jpg";
import callIcon from "../../images/Team/Phone.png";

const Chatbox = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="floating-chat">
      {/* Dropdown Options */}
      <div className={`chat-options ${open ? "show" : ""}`}>
        <a
          href="https://wa.me/919205534439"
          target="_blank"
          rel="noopener noreferrer"
          className="chat-option whatsapp"
        >
          <img src={whatsappIcon} alt="WhatsApp" className="chat-img" />
          <span className="chat-text">Chat with us</span>
        </a>

        <a
          href="https://t.me/freecatprep"
          target="_blank"
          rel="noopener noreferrer"
          className="chat-option telegram"
        >
          <img src={telegramIcon} alt="Telegram" className="chat-img" />
          <span className="chat-text">Chat with us</span>
        </a>

        <a
          href="/faqs"
          className="chat-option ask"
        >
          <img src={askIcon} alt="Ask" className="chat-img" />
          <span className="chat-text">Ask your question</span>
        </a>

        <a
          href="tel:9205534439"
          className="chat-option call"
        >
          <img src={callIcon} alt="Call" className="chat-img" />
          <span className="chat-text">Make a call</span>
        </a>
      </div>

      {/* Floating Toggle Button */}
      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        {open ? (
          <span className="close-icon">×</span>
        ) : (
          <img src={chatIcon} alt="Chat" className="chat-icon-img" />
        )}
      </button>
    </div>
  );
};

export default Chatbox;
