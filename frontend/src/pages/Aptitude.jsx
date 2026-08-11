import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Aptitude() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState([]);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);

  const [finished, setFinished] = useState(false);

  const [warnings, setWarnings] = useState(0);
  const [penalty, setPenalty] = useState(0);

  const [alertMsg, setAlertMsg] = useState("");

  useEffect(() => {
    loadQuestions();
    startCamera();

    return () => stopCamera();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/aptitude/questions",
        { email: user?.email }
      );

      setQuestions(res.data);
      setLoading(false);

    } catch {
      alert("Failed to load questions");
    }
  };

  const startCamera = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          },
          audio: false
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata =
          async () => {
            try {
              await videoRef.current.play();
              startDarkDetection();
            } catch {}
          };
      }

    } catch {
      raiseWarning(
        "Camera not enabled. This is malpractice."
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const raiseWarning = (msg) => {
    if (finished) return;

    setWarnings((prev) => {
      const next = prev + 1;

      setAlertMsg(msg);

      setTimeout(() => {
        setAlertMsg("");
      }, 2500);

      if (next === 3) {
        setPenalty(10);
      }

      if (next >= 5) {
        autoSubmit();
      }

      return next;
    });
  };

  const autoSubmit = () => {
    setAlertMsg(
      "Test Auto Submitted Due To Malpractice"
    );

    setTimeout(() => {
      submitTest();
    }, 1500);
  };

  useEffect(() => {
    const detect = () => {
      if (document.hidden) {
        raiseWarning(
          "Tab Switching Detected"
        );
      }
    };

    document.addEventListener(
      "visibilitychange",
      detect
    );

    return () =>
      document.removeEventListener(
        "visibilitychange",
        detect
      );
  }, []);

  const startDarkDetection = () => {
    const interval = setInterval(() => {
      if (
        finished ||
        !videoRef.current ||
        !canvasRef.current
      ) {
        clearInterval(interval);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx =
        canvas.getContext("2d");

      canvas.width = 120;
      canvas.height = 90;

      ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const frame =
        ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        ).data;

      let total = 0;

      for (
        let i = 0;
        i < frame.length;
        i += 4
      ) {
        total +=
          frame[i] +
          frame[i + 1] +
          frame[i + 2];
      }

      const avg =
        total /
        (frame.length / 4) /
        3;

      if (avg < 25) {
        raiseWarning(
          "Camera Blocked / Dark Screen"
        );
      }

    }, 5000);
  };

  useEffect(() => {
    if (
      loading ||
      finished ||
      questions.length === 0
    )
      return;

    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft((p) => p - 1);
      } else {
        nextQuestion();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, loading, finished]);

  const nextQuestion = () => {
    const updated = [...answers];
    updated[index] = selected;

    setAnswers(updated);
    setSelected("");

    if (index < questions.length - 1) {
      setIndex(index + 1);
      setTimeLeft(45);
    } else {
      submitTest(updated);
    }
  };

  const submitTest = async (
    updatedAnswers = answers
  ) => {
    if (finished) return;

    let total = 0;

    questions.forEach((q, i) => {
      if (
        updatedAnswers[i] === q.answer
      ) {
        total++;
      }
    });

    let percent = Math.round(
      (total / questions.length) *
        100
    );

    percent =
      percent - penalty < 0
        ? 0
        : percent - penalty;

    try {
      await axios.post(
        "http://localhost:5000/api/scores/save",
        {
          email: user?.email,
          round_name: "Aptitude",
          score: percent
        }
      );
    } catch {}

    setScore(percent);
    stopCamera();

    setTimeout(() => {
      setFinished(true);
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Loading...
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center p-8">

        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-xl w-full text-center">

          <h1 className="text-4xl font-bold text-[#14532D] mb-6">
            Aptitude Result
          </h1>

          <p className="text-gray-500 mb-2">
            Final Score
          </p>

          <p className="text-6xl font-bold text-[#14532D] mb-6">
            {score}%
          </p>

          <p className="mb-2 text-lg">
            Warnings: {warnings}
          </p>

          <p className="mb-6 text-red-600 text-lg">
            Penalty Applied: -{penalty}%
          </p>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="w-full bg-[#14532D] text-white py-4 rounded-xl font-semibold"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  const current = questions[index];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">

      {alertMsg && (
        <div className="fixed top-5 right-5 z-50 bg-red-600 text-white px-6 py-4 rounded-xl font-bold shadow-xl">
          {alertMsg}
        </div>
      )}

      <div className="flex justify-between mb-8">

        <h1 className="text-4xl font-bold text-[#14532D]">
          Aptitude Round
        </h1>

        <div className="text-right">
          <p className="text-red-600 font-bold">
            Warnings: {warnings}
          </p>

          <p className="font-bold">
            Penalty: -{penalty}%
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">

        {/* CAMERA */}
        <div className="bg-white p-4 rounded-2xl shadow-lg h-fit">

          <h2 className="text-xl font-bold mb-4">
            Live Monitoring
          </h2>

          <div className="rounded-2xl overflow-hidden bg-black">

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full aspect-video object-cover block"
            />

            <canvas
              ref={canvasRef}
              className="hidden"
            />

          </div>

        </div>

        {/* QUESTIONS */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl">

          <div className="flex justify-between mb-6">

            <p className="font-semibold">
              Question {index + 1}/
              {questions.length}
            </p>

            <p className="text-red-600 font-bold">
              {timeLeft}s
            </p>

          </div>

          <h2 className="text-2xl font-bold mb-8 text-black leading-9">
            {current?.question}
          </h2>

          <div className="grid gap-4">

            {current?.options?.map(
              (option, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setSelected(option)
                  }
                  className={`p-4 rounded-xl border text-left font-semibold ${
                    selected === option
                      ? "bg-[#14532D] text-white border-[#14532D]"
                      : "bg-white text-black border-gray-300"
                  }`}
                >
                  {option}
                </button>
              )
            )}

          </div>

          <button
            onClick={nextQuestion}
            className="mt-8 w-full bg-[#14532D] text-white py-4 rounded-xl font-semibold"
          >
            {index === questions.length - 1
              ? "Submit Test"
              : "Next Question"}
          </button>

        </div>

      </div>

    </div>
  );
}