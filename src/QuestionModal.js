// This is the modal UI component. It has yet to have dynamic functionality implemented. Arnav and I will 
// work on scraping the questions next based off the data bank and implement it into the UI.

// components/QuestionModal.jsx
import React, { useState } from "react";

const QuestionModal = ({ isOpen, onClose, question, onSubmit }) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    onSubmit(answer);
    setAnswer("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Question</h2>
        <p className="mb-4">{question}</p>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4"
          placeholder="Your answer..."
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
