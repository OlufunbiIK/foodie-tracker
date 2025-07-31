import { useState } from "react";
import { Star } from "lucide-react";

export default function Ratings({ maxRating = 5 }) {
  const [rating, setRating] = useState(0);
  const [hovering, setHovering] = useState(0);
  const [message, setMessage] = useState("");

  function handleRating(i) {
    const newRating = i + 1;
    setRating(newRating);
    handleDisplayMessage(newRating);
  }

  function handleMouseEnter(i) {
    const hoverRating = i + 1;
    setHovering(hoverRating);
    handleDisplayMessage(hoverRating);
  }

  function handleMouseLeave() {
    setHovering(0);
    handleDisplayMessage(rating);
  }

  function handleDisplayMessage(starCount) {
    if (starCount === 1) {
      setMessage("Bad");
    } else if (starCount === 2) {
      setMessage("Ok");
    } else if (starCount === 3) {
      setMessage("Good");
    } else if (starCount === 4) {
      setMessage("Very Good");
    } else if (starCount === 5) {
      setMessage("Best");
    } else {
      setMessage("");
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-8">
      <div className="text-xl font-medium">My Rating</div>
      <div className="flex flex-row gap-4 justify-center items-center">
        <div className="flex flex-row gap-1">
          {Array.from({ length: maxRating }, (_, i) => (
            <Star
              key={i}
              className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                i < (hovering || rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              } hover:text-yellow-500 hover:fill-yellow-500`}
              onClick={() => handleRating(i)}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>
        <div className="text-lg font-semibold min-w-[80px] text-center">
          {message}
        </div>
      </div>
      <div className="text-sm text-gray-600">
        Rating: {rating}/{maxRating}
      </div>
    </div>
  );
}
