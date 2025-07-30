// import { Star } from "lucide-react";
import { useState } from "react";
import { FaStar } from "react-icons/fa6";
export default function Ratings({ maxRating = 5 }) {
  const [rating, setRating] = useState(1);
  const [hovering, setHovering] = useState(false);

  function handleRating(i) {
    setRating(i + 1);
  }

  function handleMouseEnter(i) {
    setHovering(i + 1);
  }

  function handleMouseLeave() {
    setHovering(0);
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <div>My Rating</div>
      <div className="flex flex-row gap-4 justify-center items-center">
        <div className="flex flex-row gap-2">
          {Array.from({ length: maxRating }, (_, i) => (
            <FaStar
              key={i}
              className={`text-2xl cursor-pointer transition-colors duration-200 ${
                i < (hovering || rating) ? "text-purple-400" : "text-gray-300"
              } hover:text-purple-500`}
              onClick={() => handleRating(i)}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
        <div className="text-lg font-semibold min-w-[20px]">
          {hovering || rating || ""}
        </div>
      </div>
    </div>
  );
}
