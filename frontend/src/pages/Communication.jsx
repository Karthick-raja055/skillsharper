import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Communication() {
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let timer;

    if (started && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (started && timeLeft === 0) {
      stopSession();
    }

    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      alert("Permission denied");
    }
  };

  const startSpeech = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Use Chrome browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let text = "";

      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }

      setTranscript(text);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const startSession = async () => {
    setStarted(true);
    setTranscript("");
    setFeedback(null);
    setTimeLeft(60);

    await startCamera();
    startSpeech();
  };

  const stopSession = async () => {
    setStarted(false);

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    const words = transcript
      .trim()
      .split(" ")
      .filter(Boolean);

    const wordCount = words.length;

    if (wordCount === 0) {
      try {
        await axios.post(
          "http://localhost:5000/api/scores/save",
          {
            email: user?.email,
            round_name: "Communication",
            score: 0
          }
        );
      } catch {}

      setFeedback({
        words: 0,
        fillers: 0,
        fluency: 0,
        confidence: 0
      });

      return;
    }

    const fillers = words.filter((w) =>
      ["um", "uh", "like", "actually"].includes(
        w.toLowerCase()
      )
    ).length;

    const fluency = Math.max(
      0,
      100 - fillers * 5
    );

    const confidence = Math.min(
      100,
      30 + wordCount
    );

    try {
      await axios.post(
        "http://localhost:5000/api/scores/save",
        {
          email: user?.email,
          round_name: "Communication",
          score: confidence
        }
      );
    } catch {}

    setFeedback({
      words: wordCount,
      fillers,
      fluency,
      confidence
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <h1 className="text-4xl font-bold text-[#14532D] mb-8">
        Communication Round
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white p-6 rounded-3xl shadow">

          <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          <p className="mt-4 font-bold text-red-600">
            Timer: {timeLeft}s
          </p>

          {!started ? (
            <button
              onClick={startSession}
              className="mt-4 w-full bg-[#14532D] text-white py-3 rounded-xl font-semibold"
            >
              Start Interview
            </button>
          ) : (
            <button
              onClick={stopSession}
              className="mt-4 w-full bg-red-600 text-white py-3 rounded-xl font-semibold"
            >
              Stop
            </button>
          )}

        </div>

        <div className="bg-white p-6 rounded-3xl shadow">

          <h2 className="text-2xl font-bold text-black mb-4">
            Live Transcript
          </h2>

          <div className="bg-gray-100 min-h-[180px] p-4 rounded-xl text-black">
            {transcript || "Your speech appears here..."}
          </div>

          {feedback && (
            <div className="mt-6 space-y-2 font-semibold text-black">
              <p>Words Spoken: {feedback.words}</p>
              <p>Filler Words: {feedback.fillers}</p>
              <p>Fluency Score: {feedback.fluency}%</p>
              <p>Confidence Score: {feedback.confidence}%</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}