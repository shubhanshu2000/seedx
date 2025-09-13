import React, { useState, useEffect } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US"; // Can change to "hi-IN" for Hindi, etc.

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      handleVoiceCommand(speechResult);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    if (
      lowerCommand.includes("marketplace") ||
      lowerCommand.includes("seeds")
    ) {
      window.location.href = "/marketplace";
    } else if (lowerCommand.includes("cart")) {
      window.location.href = "/cart";
    } else if (lowerCommand.includes("login")) {
      window.location.href = "/login";
    } else if (lowerCommand.includes("home")) {
      window.location.href = "/";
    } else {
      alert(`Voice command: ${command}. Command not recognized.`);
    }
  };

  const startListening = () => {
    setIsListening(true);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={startListening}
        disabled={isListening}
        className={`bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-200 ${
          isListening ? "animate-pulse" : ""
        }`}
        title="Voice Assistant"
      >
        {isListening ? "🎤" : "🗣️"}
      </button>
      {transcript && (
        <div className="absolute bottom-16 right-0 bg-white p-2 rounded shadow-lg max-w-xs">
          <p className="text-sm">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
