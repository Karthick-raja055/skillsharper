import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GD() {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const topics = [
    "Is Artificial Intelligence replacing jobs?",
    "Should work from home continue?",
    "Is social media harmful?",
    "Online education vs classroom learning",
    "Electric vehicles are the future",
    "Is coding necessary for all students?",
    "Can robots replace humans?",
    "Should mobile phones be banned in college?",
    "Is India ready for cashless economy?",
    "Climate change is the biggest threat",
    "Are exams a true measure of talent?",
    "Is entrepreneurship better than jobs?",
    "Women make better leaders",
    "Should attendance be compulsory?",
    "Can gaming become a career?",
    "Books vs internet learning",
    "Are influencers real role models?",
    "Should college uniforms exist?",
    "Is space exploration worth spending?",
    "Will AI improve healthcare?"
  ];

  const [topic, setTopic] = useState("");
  const [prepTime, setPrepTime] = useState(30);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [transcript, setTranscript] = useState("");
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    loadNewTopic();
  }, []);

  const loadNewTopic = () => {
    const randomTopic =
      topics[Math.floor(Math.random() * topics.length)];

    setTopic(randomTopic);
  };

  useEffect(() => {
    if (!started && prepTime > 0 && !finished) {
      const timer = setTimeout(() => {
        setPrepTime((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [prepTime, started, finished]);

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (started && timeLeft === 0) {
      stopGD();
    }
  }, [started, timeLeft]);

  const startGD = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Use Google Chrome browser");
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

    setStarted(true);
  };

  const stopGD = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const words = transcript
      .trim()
      .split(" ")
      .filter(Boolean);

    const wordCount = words.length;

    /* NO SPEECH = ZERO SCORE */
    if (wordCount === 0) {

      try {
        await axios.post(
          "http://localhost:5000/api/scores/save",
          {
            email: user?.email,
            round_name: "Group Discussion",
            score: 0
          }
        );
      } catch {}

      setFeedback(
        "Topic: " + topic +
        "\n\nWords Spoken: 0" +
        "\nFiller Words: 0" +
        "\nFluency: 0%" +
        "\nConfidence: 0%" +
        "\nVocabulary: 0%" +
        "\nRelevance: 0%" +
        "\nStructure: 0%" +
        "\nLeadership Tone: 0%" +
        "\n\nFinal GD Score: 0%" +
        "\n\nReason: No speech detected."
      );

      setStarted(false);
      setFinished(true);
      return;
    }

    const fillers = words.filter((w) =>
      ["um", "uh", "like", "actually"].includes(
        w.toLowerCase()
      )
    ).length;

    const uniqueWords = new Set(words).size;

    let fluency = Math.max(
      0,
      100 - fillers * 5
    );

    let confidence = Math.min(
      100,
      30 + wordCount
    );

    let vocabulary = Math.min(
      100,
      uniqueWords * 2
    );

    const topicKeywords = topic
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter((w) => w.length > 3);

    let matched = 0;

    topicKeywords.forEach((key) => {
      if (
        transcript.toLowerCase().includes(key)
      ) {
        matched++;
      }
    });

    let relevance = Math.round(
      (matched / topicKeywords.length) * 100
    );

    if (isNaN(relevance)) relevance = 0;

    let structure = 40;

    if (wordCount > 20) structure += 10;
    if (
      transcript.toLowerCase().includes("first")
    ) structure += 15;
    if (
      transcript.toLowerCase().includes("second")
    ) structure += 15;
    if (
      transcript.toLowerCase().includes("finally") ||
      transcript.toLowerCase().includes("conclusion")
    ) structure += 20;

    if (structure > 100) structure = 100;

    let leadership = 40;

    if (
      transcript.toLowerCase().includes("i believe") ||
      transcript.toLowerCase().includes("in my opinion")
    ) leadership += 20;

    if (
      transcript.toLowerCase().includes("we should") ||
      transcript.toLowerCase().includes("we must")
    ) leadership += 20;

    if (wordCount > 50) leadership += 20;

    if (leadership > 100) leadership = 100;

    let score = Math.round(
      fluency * 0.15 +
      confidence * 0.15 +
      vocabulary * 0.15 +
      relevance * 0.20 +
      structure * 0.20 +
      leadership * 0.15
    );

    if (score > 100) score = 100;

    try {
      await axios.post(
        "http://localhost:5000/api/scores/save",
        {
          email: user?.email,
          round_name: "Group Discussion",
          score: score
        }
      );
    } catch {}

    setFeedback(
      "Topic: " + topic +
      "\n\nWords Spoken: " + wordCount +
      "\nFiller Words: " + fillers +
      "\nFluency: " + fluency + "%" +
      "\nConfidence: " + confidence + "%" +
      "\nVocabulary: " + vocabulary + "%" +
      "\nRelevance: " + relevance + "%" +
      "\nStructure: " + structure + "%" +
      "\nLeadership Tone: " + leadership + "%" +
      "\n\nFinal GD Score: " + score + "%"
    );

    setStarted(false);
    setFinished(true);
  };

  const restartGD = () => {
    setTranscript("");
    setFinished(false);
    setStarted(false);
    setPrepTime(30);
    setTimeLeft(60);
    setFeedback("");
    loadNewTopic();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-[#14532D]">
          Group Discussion Round
        </h1>

        {!finished && (
          <div className="bg-white px-6 py-3 rounded-xl shadow text-red-600 font-bold text-xl">
            {started ? `${timeLeft}s` : `${prepTime}s`}
          </div>
        )}

      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl">

        <h2 className="text-2xl font-bold text-black mb-4">
          Topic
        </h2>

        <div className="bg-gray-100 p-6 rounded-2xl mb-8 text-xl font-semibold text-black min-h-[90px] flex items-center">
          {topic}
        </div>

        {!started && !finished && (
          <button
            onClick={startGD}
            className="w-full bg-[#14532D] text-white py-4 rounded-xl font-semibold"
          >
            Start Discussion
          </button>
        )}

        {started && (
          <>
            <div className="bg-gray-100 p-6 rounded-2xl min-h-[220px] text-black">
              {transcript || "Listening... Speak now"}
            </div>

            <button
              onClick={stopGD}
              className="mt-6 w-full bg-red-600 text-white py-4 rounded-xl font-semibold"
            >
              Finish GD
            </button>
          </>
        )}

        {finished && (
          <>
            <div className="bg-gray-100 p-6 rounded-2xl whitespace-pre-line font-semibold text-black">
              {feedback}
            </div>

            <button
              onClick={restartGD}
              className="mt-6 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold"
            >
              New Topic
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 w-full bg-[#14532D] text-white py-4 rounded-xl font-semibold"
            >
              Back to Dashboard
            </button>
          </>
        )}

      </div>

    </div>
  );
}