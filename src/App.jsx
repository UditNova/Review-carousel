import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import "./App.css";

import reviewer1 from "./assets/reviewer1.jpeg";
import reviewer2 from "./assets/reviewer2.jpeg";
import reviewer3 from "./assets/reviewer3.jpeg";
import reviewer4 from "./assets/reviewer4.jpeg";
import reviewer5 from "./assets/reviewer5.jpeg";

const baseItems = [
  { id: 1, image: reviewer1, name: "Ashley Right" },
  { id: 2, image: reviewer2, name: "Marcus Vance" },
  { id: 3, image: reviewer3, name: "Elena Rostova" },
  { id: 4, image: reviewer4, name: "Julian Thorne" },
  { id: 5, image: reviewer5, name: "Sophia Chen" },
];

// Triplicated buffer for infinite seamless looping
const ribbonItems = [...baseItems, ...baseItems, ...baseItems];

export default function App() {
  const [animating, setAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(baseItems.length);
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

    gsap.to(track, {
      x: -newTrackIndex * shiftDist,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        let finalIndex = newTrackIndex;
        // Silent loop reset if bounds are exceeded
        if (finalIndex <= baseItems.length / 2) {
          finalIndex += baseItems.length;
          gsap.set(track, { x: -finalIndex * shiftDist });
        } else if (finalIndex >= baseItems.length * 2.5) {
          finalIndex -= baseItems.length;
          gsap.set(track, { x: -finalIndex * shiftDist });
        }
        setCurrentIndex(finalIndex);
        setActiveSlotIndex(targetActiveSlot);
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
            const isMainAttraction =
              relativePosition === activeSlotIndex && !animating;

            return (
              <div
                key={`${item.id}-${index}`}
                className={`ribbon-card ${
                  isMainAttraction ? "main-attraction" : ""
                }`}
                onClick={() => handleCardClick(index)}
              >
                <img src={item.image} alt={item.name} />
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
