import React, { useState } from "react";

export default function TextExpander({
  collapseNumWords = 10,
  expandButtonText = "Show More",
  collapseButtonText = "Show Less",
  buttonColor,
  expanded,
  className,
  children,
}) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const displayText = isExpanded
    ? children
    : children.split(" ").slice(0, collapseNumWords).join(" ") + "...";

  function handleButtonChange() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className={className}>
      <span>{displayText}</span>
      <button
        className={`btn ml-2 ${isExpanded ? "bg-red-500" : "bg-blue-400"}`}
        onClick={handleButtonChange}
      >
        {isExpanded ? collapseButtonText : expandButtonText}
      </button>
    </div>
  );
}
