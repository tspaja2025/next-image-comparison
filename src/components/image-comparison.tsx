"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

export interface ImageComparisonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  before: string;
  after: string;
  beforeAlt?: string;
  afterAlt?: string;
  initialPosition?: number;
}

export default function ImageComparison({
  before,
  after,
  beforeAlt = "Before image",
  afterAlt = "After image",
  initialPosition = 50,
  ...restProps
}: ImageComparisonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // initialize CSS variable
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--clip", `${initialPosition}%`);
    }
    if (sliderRef.current) {
      sliderRef.current.style.left = `${initialPosition}%`;
    }
  }, [initialPosition]);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current || !sliderRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;

    // update CSS var for clipping
    containerRef.current.style.setProperty("--clip", `${percent}%`);

    // move slider handle
    sliderRef.current.style.left = `${percent}%`;
    sliderRef.current.style.transform = "translateX(-50%)";
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  });

  return (
    <div
      ref={containerRef}
      className="group relative h-96 w-full cursor-ew-resize overflow-hidden select-none"
      onPointerDown={(e) => {
        setIsDragging(true);
        updatePosition(e.clientX);
      }}
      {...restProps}
    >
      {/* Before image */}
      <Image
        src={before}
        alt={beforeAlt}
        fill
        className="absolute inset-0 object-cover"
        priority
      />

      {/* After image with clip-path */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{ clipPath: "inset(0 0 0 var(--clip))" }}
      >
        <Image
          src={after}
          alt={afterAlt}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Slider control */}
      <div
        ref={sliderRef}
        className="absolute top-0 bottom-0 w-1 rounded-full bg-white shadow-lg transition-none"
      >
        <div className="absolute top-1/2 -right-4 -left-4 flex h-10 -translate-y-1/2 items-center justify-center">
          <div className="flex h-10 w-3 items-center justify-center rounded-full bg-white transition-transform duration-100 group-hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 rounded bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
        Before
      </div>
      <div className="absolute bottom-4 right-4 rounded bg-black bg-opacity-50 px-2 py-1 text-sm text-white">
        After
      </div>
    </div>
  );
}
