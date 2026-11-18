import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import "./App.css";

import reviewer1 from "./assets/reviewer1.jpeg";
import reviewer2 from "./assets/reviewer2.jpeg";
import reviewer3 from "./assets/reviewer3.jpeg";
import reviewer4 from "./assets/reviewer4.jpeg";
import reviewer5 from "./assets/reviewer5.jpeg";

const baseItems = [
  {
    id: 1,
    image: reviewer1,
    name: "Ashley Right",
    title: "Product Designer",
    platform: "Pinterest",
    review:
      "Professionals in their craft! All products were super amazing with strong attention to details, comps and overall vibe",
  },
  {
    id: 2,
    image: reviewer2,
    name: "Marcus Vance",
    title: "Software Engineer",
    platform: "Google",
    review:
      "An incredible experience from beginning to end. The quality, creativity and attention to every detail were outstanding.",
  },
  {
    id: 3,
    image: reviewer3,
    name: "Elena Rostova",
    title: "Marketing Director",
    platform: "Instagram",
    review:
      "A truly professional team with amazing creative direction. Everything was delivered with exceptional quality.",
  },
  {
    id: 4,
    image: reviewer4,
    name: "Julian Thorne",
    title: "UI/UX Lead",
    platform: "Behance",
    review:
      "Great communication, beautiful execution and a fantastic understanding of our vision. Highly recommended.",
  },
  {
    id: 5,
    image: reviewer5,
    name: "Sophia Chen",
    title: "Creative Producer",
    platform: "LinkedIn",
    review:
      "Their attention to detail and commitment to quality made the entire experience absolutely seamless.",
  },
];

const REPEAT_COUNT = 20;
const ribbonItems = Array(REPEAT_COUNT).fill(baseItems).flat();
const INITIAL_INDEX = baseItems.length * 10;

export default function App() {
  const [animating, setAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const [activeSlotIndex, setActiveSlotIndex] = useState(4);

  const trackRef = useRef(null);

  const activeItem = ribbonItems[currentIndex + activeSlotIndex];

  const getShiftDistance = () => {
    if (!trackRef.current) return 0;

    const cardNode = trackRef.current.children[0];
    const gap = 18;

    return cardNode.offsetWidth + gap;
  };

  useEffect(() => {
    if (trackRef.current) {
      const shiftDist = getShiftDistance();

      gsap.set(trackRef.current, {
        x: -currentIndex * shiftDist,
      });
    }
  }, []);

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

    if (clickedSlot < 0 || clickedSlot > 4 || clickedSlot === 4) {
      return;
    }

    const slotDifference = 4 - clickedSlot;
    const targetTrackIndex = currentIndex - slotDifference;

    animateToIndex(targetTrackIndex, 4);
  };

  const reviewNumber = ((activeItem.id - 1) % baseItems.length) + 1;

  return (
    <main className="ribbon-container">
      {/* LEFT INFORMATION */}
      <aside className="left-panel">
        <div className="review-counter">
          {String(reviewNumber).padStart(2, "0")} / 05
        </div>

        <h2 className="vertical-heading">Reviews</h2>

        <div className="decorative-circle" />
      </aside>

      {/* REVIEWER IMAGE RIBBON */}
      <section className="ribbon-viewport">
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
                  <img src={item.image} alt={item.name} draggable="false" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RIGHT TESTIMONIAL INFORMATION */}
      <section className="testimonial-panel">
        <div className="testimonial-author">
          <h3>{activeItem.name}</h3>

          <p>{activeItem.platform}</p>
        </div>

        <div className="testimonial-content">
          <h2>"{activeItem.review}"</h2>
        </div>
      </section>

      {/* NAVIGATION */}
      <div className="controls">
        <button
          className="next-btn"
          onClick={handleNext}
          disabled={animating}
          aria-label="Next review"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </main>
  );
}
