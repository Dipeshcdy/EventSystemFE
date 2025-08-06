import React, { useEffect, useRef, useState } from "react";
import { FaRocketchat } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import axiosInstance from '../services/axios';
import img from "../images/chatbot3.png"
import axios from "axios";
import chatbotimg from "../images/chatbot1.png";
const ChatbotWidget = () => {
  const apiKey = import.meta.env["VITE_ChatBot_URL"];
  const [isOpen, setIsOpen] = useState(false);
  const scrollableDivRef = useRef(null);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const widgetRef = useRef(null);
  const [position, setPosition] = useState({ x: 1430, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsOpen(true);
  //   }, 500);
  // }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setHasDragged(true);
      setPosition((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      setHasDragged(true);
      setPosition((prev) => ({
        x: touch.clientX - 30, // adjust offset
        y: touch.clientY - 30,
      }));
    };

    const stopDragging = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", stopDragging);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging]);

  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  }, [messages]);

  const [inputValue, setInputValue] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessages = [...messages, { text: inputValue, sender: "user" }];
      setMessages(newMessages);
      setInputValue("");


      await axios
        .post(`${apiKey}?param=test&question=${inputValue}`, {})
        .then(function (response) {
          var msg = response.data.response_answer;
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: msg, sender: "bot" },
          ]);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <div
      ref={widgetRef}
      // onMouseDown={() => setIsDragging(true)}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999,
        cursor: 'grab',
      }} className="font-sans">
      {/* Floating Chat Button */}
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
          setHasDragged(false);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          setHasDragged(false);
        }}
        onClick={(e) => {
          if (!hasDragged) {
            toggleChat();
          }
        }}
        className={`z-[999] w-16 h-16 flex items-center justify-center outline-none bg-gradient-to-r  from-[#0537ec] to-[#00d4ff] text-white font-bold rounded-full shadow-lg transition-transform duration-300 ${isOpen ? "rotate-[360deg]" : ""
          }`}
      >
        <img src={chatbotimg} className="w-full h-full object-contain rounded-full" alt="" />
        {/* {isOpen ? (
          <FaXmark className="text-3xl transition-transform duration-300" />
        ) : (
          // <FaRocketchat className="text-3xl transition-transform duration-300" />
        )} */}
      </button>

      {/* Chatbot Window */}
      <div
        className={`fixed z-[1001] md:bottom-28 md:right-10 md:w-[30rem] w-full bottom-0 h-full md:h-auto right-0 border-2 bg-white  rounded-lg flex flex-col transform transition-all duration-500 ease-in-out ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
          }`}
      >
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#0537ec] to-[#00d4ff] rounded-t-lg">
          <h2 className="text-lg font-semibold text-white">My Fortune Teller</h2>
          <button
            onClick={toggleChat}
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <FaXmark className="text-3xl text-gray-200" />
          </button>
        </div>
        <div className="">
          <div className="bg-white">
            <div ref={scrollableDivRef} className="md:h-[60vh] h-[85vh] p-4 px-6 overflow-y-auto">
              {messages.map((message, index) => {
                const isLastBotMessage = message.sender === "bot" && (index === messages.length - 1 || messages[index + 1].sender !== "bot");
                const isLastSenderMessage = message.sender === "user" && (index === messages.length - 1 || messages[index + 1].sender !== "user");
                return (
                  <div key={index}
                    className={`flex text-sm ${message.sender === "user"
                      ? " justify-end "
                      : " justify-start"
                      }`}>
                    {message.sender === "user" ? <>
                      <div
                        className={`px-2 py-3 rounded-lg max-w-[90%] bg-[#e5e5e5] text-black ${isLastSenderMessage ? 'mb-4' : 'mb-1'}`}
                      >
                        {message.text}
                      </div>
                    </> : <>
                      <div className={`flex gap-3 max-w-[90%] ${isLastBotMessage ? 'mb-4' : 'mb-1'} `}>
                        <div className="w-[50px] h-[50px] flex-shrink-0 mt-auto">
                          {isLastBotMessage && (
                            <img className="w-full h-full rounded-full object-cover object-center" src={img} alt="" />
                          )}
                        </div>
                        <div className=" px-2 py-3 rounded-lg flex-grow  bg-blue-600 text-white">
                          {message.text}
                        </div>
                      </div>
                    </>}
                  </div>
                )
              })}
            </div>
          </div>
          <div className=" border-t-2 border-gray-300 px-2 py-2 bg-white shadow-[0_-4px_6px_rgba(0,0,0,0.1)] rounded-b-lg">
            <form className="flex gap-2 items-center" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="w-full p-2 outline-none text-gray-900 "
              />
              <button
                type="submit"
                className=" px-[10px] py-[10px] rounded-full outline-none bg-blue-500 text-white hover:bg-blue-600"
              >
                <IoSend className="text-xl" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
