import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import "./App.css";

import reviewer1 from "./assets/reviewer1.jpeg";
import reviewer2 from "./assets/reviewer2.jpeg";
import reviewer3 from "./assets/reviewer3.jpeg";
import reviewer4 from "./assets/reviewer4.jpeg";
import reviewer5 from "./assets/reviewer5.jpeg";

const baseItems = [
  { id: 1, image: reviewer1, name: "Ashley Right", title: "Product Designer" },
  { id: 2, image: reviewer2, name: "Marcus Vance", title: "Software Engineer" },
  {
    id: 3,
    image: reviewer3,
    name: "Elena Rostova",
    title: "Marketing Director",
  },
  { id: 4, image: reviewer4, name: "Julian Thorne", title: "UI/UX Lead" },
  { id: 5, image: reviewer5, name: "Sophia Chen", title: "Creative Producer" },
];

// Create a large repeated buffer (20 sets) for an effectively infinite ribbon without abrupt resets
const REPEAT_COUNT = 20;
const ribbonItems = Array(REPEAT_COUNT).fill(baseItems).flat();
const INITIAL_INDEX = baseItems.length * 10; // Start right in the middle

export default function App() {
  const [animating, setAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const [activeSlotIndex, setActiveSlotIndex] = useState(4); // 5th slot (index 4) is default main attraction

  const trackRef = useRef(null);

  const getShiftDistance = () => {
    if (!trackRef.current) return 0;
    const cardNode = trackRef.current.children[0];
    const gap = 16;
    return cardNode.offsetWidth + gap;
  };

  useEffect(() => {
    if (trackRef.current) {
      const shiftDist = getShiftDistance();
      gsap.set(trackRef.current, { x: -currentIndex * shiftDist });
    }
  }, []);

  const animateToIndex = (newTrackIndex, targetActiveSlot = 4) => {
    if (animating || !trackRef.current) return;
    setAnimating(true);

    const track = trackRef.current;
    const shiftDist = getShiftDistance();

    // Update index immediately so sizing transitions trigger simultaneously with GSAP slide
    setCurrentIndex(newTrackIndex);
    setActiveSlotIndex(targetActiveSlot);

    gsap.to(track, {
      x: -newTrackIndex * shiftDist,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        setAnimating(false);
      },
    });
  };

  const handleNext = () => {
    if (animating) return;
    animateToIndex(currentIndex - 1, 4);
  };

  const handleCardClick = (absoluteIndex) => {
    if (animating) return;

    const clickedSlot = absoluteIndex - currentIndex;
    if (clickedSlot < 0 || clickedSlot > 4 || clickedSlot === 4) return;

    const slotDifference = 4 - clickedSlot;
    const targetTrackIndex = currentIndex - slotDifference;

    animateToIndex(targetTrackIndex, 4);
  };

  return (
    <div className="ribbon-container">
      <div className="ribbon-viewport">
        <div ref={trackRef} className="ribbon-track">
          {ribbonItems.map((item, index) => {
            const relativePosition = index - currentIndex;
            const isMainAttraction = relativePosition === activeSlotIndex;

            return (
              <div
                key={`${item.id}-${index}`}
                className={`ribbon-card-wrapper ${
                  isMainAttraction ? "main-attraction" : ""
                }`}
                onClick={() => handleCardClick(index)}
              >
                <div className="ribbon-card">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="card-details">
                  <div className="card-name">{item.name}</div>
                  <div className="card-title">{item.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="controls">
        <button className="next-btn" onClick={handleNext}>
          Next Slide
        </button>
      </div>
    </div>
  );
}
