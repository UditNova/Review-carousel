import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import "./ReviewerRibbon.css";

import reviewer1 from "../assets/reviewer1.jpeg";
import reviewer2 from "../assets/reviewer2.jpeg";
import reviewer3 from "../assets/reviewer3.jpeg";
import reviewer4 from "../assets/reviewer4.jpeg";
import reviewer5 from "../assets/reviewer5.jpeg";

const defaultItems = [
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

const REPEAT_COUNT = 20;

export default function ReviewerRibbon({ items = defaultItems }) {
  const ribbonItems = Array(REPEAT_COUNT).fill(items).flat();
  const initialIndex = items.length * 10;

  const [animating, setAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [activeSlotIndex, setActiveSlotIndex] = useState(4);

  const trackRef = useRef(null);

  const getShiftDistance = useCallback(() => {
    if (!trackRef.current || !trackRef.current.children[0]) return 0;
    const cardNode = trackRef.current.children[0];
    const gap = 16;
    return cardNode.offsetWidth + gap;
  }, []);

  // Set initial position and keep track aligned on window resize
  useEffect(() => {
    const updatePosition = () => {
      if (trackRef.current) {
        const shiftDist = getShiftDistance();
        gsap.set(trackRef.current, { x: -currentIndex * shiftDist });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [currentIndex, getShiftDistance]);

  const animateToIndex = (newTrackIndex, targetActiveSlot = 4) => {
    if (animating || !trackRef.current) return;
    setAnimating(true);

    const track = trackRef.current;
    const shiftDist = getShiftDistance();

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
    <div className="reviewer-ribbon-container">
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

      <div className="ribbon-controls">
        <button className="ribbon-next-btn" onClick={handleNext}>
          Next Slide
        </button>
      </div>
    </div>
  );
}
