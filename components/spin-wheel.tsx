"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, RotateCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import confetti from "canvas-confetti"

const defaultOptions = [
  { id: "1", text: "Option 1", color: "#FF6384" },
  { id: "2", text: "Option 2", color: "#36A2EB" },
  { id: "3", text: "Option 3", color: "#FFCE56" },
  { id: "4", text: "Option 4", color: "#4BC0C0" },
  { id: "5", text: "Option 5", color: "#9966FF" },
  { id: "6", text: "Option 6", color: "#FF9F40" },
]

// Color palette for new options
const colorPalette = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
  "#8AC926",
  "#1982C4",
  "#6A4C93",
  "#F15BB5",
]

export function SpinWheel() {
  // ...existing state...
  const spinningSound = useRef<HTMLAudioElement | null>(null);
  const [options, setOptions] = useState(defaultOptions);
  const [newOption, setNewOption] = useState("");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningId, setWinningId] = useState<string | null>(null);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Store the final rotation value
  const [finalRotation, setFinalRotation] = useState(0);
  useEffect(() => {
    spinningSound.current = new Audio("./spin.mp3");
    spinningSound.current.loop = true;
  }, []);

  const handleAddOption = () => {
    if (newOption.trim() === "") return;

    const newId = (options.length + 1).toString();
    const colorIndex = options.length % colorPalette.length;

    setOptions([
      ...options,
      {
        id: newId,
        text: newOption.trim(),
        color: colorPalette[colorIndex],
      },
    ]);
    setNewOption("");
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions(options.filter((option) => option.id !== id));
  };

  // This function will be called when the animation completes
  const handleAnimationComplete = () => {
    if (!isSpinning) return;
    if (spinningSound.current) {
      spinningSound.current.pause();
    }

    // Calculate which segment is at the top (pointer position)
    const effectiveRotation = (360 - (finalRotation % 360)) % 360;
    const segmentAngle = 360 / options.length;

    // The wheel rotates clockwise, so we need to determine which segment
    // is at the top (0 degrees) after rotation
    const normalizedRotation = finalRotation % 360;

    // Calculate the winning segment index
    // We need to find which segment is at the top (0 degrees)
    let winnerIndex = Math.floor(effectiveRotation / segmentAngle);

    // Pastikan indeks berada dalam rentang yang valid
    if (winnerIndex >= options.length) {
      winnerIndex = winnerIndex % options.length;
    }
    if (winnerIndex < 0) {
      winnerIndex = options.length + winnerIndex;
    }

    const winningOption = options[winnerIndex];

    // Set the winner
    setWinner(winningOption.text);
    setWinningId(winningOption.id);
    setWinningIndex(winnerIndex);
    setIsSpinning(false);

    // Trigger confetti
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
    });

    // After 2 seconds, remove the winning option if there are more than 2 options
    if (options.length > 2) {
      setTimeout(() => {
        // Clear notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
          setWinningId(null);
          setWinningIndex(null);
        }, 3000);
      }, 2000);
    }
  };

  const spinWheel = () => {
    if (isSpinning) return;

    // Play the spinning sound
    if (spinningSound.current) {
      spinningSound.current.currentTime = 0;
      spinningSound.current.play();
    }

    // Reset states
    setWinner(null);
    setWinningId(null);
    setWinningIndex(null);
    setIsSpinning(true);

    // Spin between 5-10 full rotations
    const spinAmount = 1800 + Math.floor(Math.random() * 1800);
    const newRotation = rotation + spinAmount;

    // Store the final rotation for winner calculation
    setFinalRotation(newRotation);
    setRotation(newRotation);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex flex-col sm:flex-row w-full max-w-md gap-4 mb-4">
        <Input
          placeholder="Add Entry"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
          disabled={isSpinning}
          className="flex-grow"
        />
        <Button
          onClick={handleAddOption}
          disabled={!newOption.trim() || isSpinning}
          className="whitespace-nowrap bg-white text-black hover:bg-slate-300"
        >
          <Plus className="mr-2 h-4 w-4 text-black" />
          Add Entry
        </Button>
      </div>

      <div className="relative w-full max-w-md aspect-square">
        {/* Wheel */}
        <motion.div
          ref={wheelRef}
          className="w-full h-full rounded-full overflow-hidden border-8 border-slate-200 shadow-xl"
          style={{
            transformOrigin: "center",
            position: "relative",
          }}
          animate={{
            rotate: rotation,
          }}
          transition={{
            duration: 3,
            ease: [0.2, 0.5, 0.3, 1],
          }}
          onAnimationComplete={handleAnimationComplete}
        >
          {options.map((option, index) => {
            const angle = 360 / options.length;
            const startAngle = index * angle;
            const endAngle = (index + 1) * angle;

            // Convert angles to radians for calculations
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;

            // Calculate points for the segment path
            const x1 = 50 + 50 * Math.cos(startAngleRad);
            const y1 = 50 + 50 * Math.sin(startAngleRad);
            const x2 = 50 + 50 * Math.cos(endAngleRad);
            const y2 = 50 + 50 * Math.sin(endAngleRad);

            // Create the path for the segment
            const pathData = `M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`;

            // Calculate text position (in the middle of the segment)
            const midAngleRad = (startAngleRad + endAngleRad) / 2;
            const textRadius = 35; // Distance from center for text
            const textX = 50 + textRadius * Math.cos(midAngleRad);
            const textY = 50 + textRadius * Math.sin(midAngleRad);

            // Determine if this is the winning segment
            const isWinningSegment = winningIndex === index && !isSpinning;

            return (
              <div
                key={option.id}
                className="absolute top-0 left-0 w-full h-full"
                style={{ position: "absolute" }}
              >
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <path
                    d={pathData}
                    fill={option.color}
                    stroke={isWinningSegment ? "gold" : "white"}
                    strokeWidth={isWinningSegment ? "1.5" : "0.5"}
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="4"
                    fontWeight="bold"
                    transform={`rotate(${
                      90 + (startAngle + endAngle) / 2
                    }, ${textX}, ${textY})`}
                    style={{ textShadow: "0px 0px 2px rgba(0,0,0,0.5)" }}
                  >
                    {option.text}
                  </text>
                </svg>
              </div>
            );
          })}
          <div className="absolute inset-0 rounded-full border-4 border-white" />
          <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md z-10" />
        </motion.div>

        {/* Marker */}
        <div className="absolute top-1/2 -right-6 -translate-y-1/2 -translate-x-1/2 w-8 h-12 z-20">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-600 mx-auto rotate-[90deg]" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={spinWheel}
          disabled={isSpinning || options.length < 2}
          size="lg"
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg transition-all"
        >
          <RotateCcw className="mr-2 h-5 w-5 animate-pulse" />
          {isSpinning ? "Spinning..." : "Spin the Wheel!"}
        </Button>

        {winner && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md">
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-bold text-green-800">Winner!</h3>
              <p className="text-2xl font-bold text-green-600 mt-1">{winner}</p>
            </CardContent>
          </Card>
        )}
        {notification && (
          <div className="mt-2 py-2 px-4 bg-blue-50 text-blue-700 rounded-md border border-blue-200 animate-fade-in">
            {notification}
          </div>
        )}
      </div>

      <div className="w-full max-w-md mt-4">
        <h3 className="text-lg font-semibold mb-2 text-slate-200">
          Current Options
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((option) => (
            <div
              key={option.id}
              className={`flex items-center justify-between p-2 rounded-md ${
                option.id === winningId
                  ? "ring-2 ring-green-400 bg-green-50"
                  : ""
              }`}
              style={{
                backgroundColor:
                  option.id === winningId ? undefined : `${option.color}`,
              }}
            >
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: option.color }}
                />
                <span className="font-medium text-white">{option.text}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveOption(option.id)}
                disabled={isSpinning || options.length <= 2}
                className="h-8 w-8 text-slate-100 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

