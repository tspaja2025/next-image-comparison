"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ImageComparisonProps {
	/** Before image URL */
	before: string;
	/** After image URL */
	after: string;
	/** Before image alt text */
	beforeAlt?: string;
	/** After image alt text */
	afterAlt?: string;
	/** Initial slider position (0-100) */
	initialPosition?: number;
}

export function ImageComparison({
    before,
    after,
    beforeAlt = 'Before image',
    afterAlt = 'After image',
    initialPosition = 50,
    ...restProps
}: ImageComparisonProps) {
    let [position, setPosition] = useState(initialPosition);
	let [isDragging, setIsDragging] = useState(false);
    let containerRef = useRef<HTMLDivElement>(null)

    const startDrag = useCallback(() => {
        setIsDragging(true);
    }, [])

    const stopDrag = useCallback(() => {
        setIsDragging(false);
    }, [])

    const updatePosition = useCallback((event: MouseEvent | TouchEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setPosition((x / rect.width) * 100)
    }, [])

    const handleMouseMove = useCallback((event: React.MouseEvent) => {
        if (!isDragging) return;
        updatePosition(event.nativeEvent);
    }, [isDragging, updatePosition])

    const handleTouchMove = useCallback((event: React.TouchEvent) => {
        if (!isDragging) return;
        updatePosition(event.nativeEvent);
    }, [isDragging, updatePosition])

    // TODO: Drag is lagging
    return (
        <div
            ref={containerRef}
            className="group relative h-96 w-full cursor-ew-resize overflow-hidden select-none"
            onMouseDown={startDrag}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onTouchStart={startDrag}
            onTouchMove={handleTouchMove}
            onTouchEnd={stopDrag}
            {...restProps}
        >
            <img src={before} alt={beforeAlt} className="absolute inset-0 h-full w-full object-cover" />

            <div
                className="absolute inset-0 h-full w-full overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${position}%)`}}
            >
                <img src={after} alt={afterAlt} className="h-full w-full object-cover" />
            </div>

            <div
                className="absolute top-0 bottom-0 w-1 rounded-full bg-white shadow-lg transition-all duration-100 ease-linear"
                style={{left: `${position}%`, transform: 'translateX(-50%)'}}
            >
                <div
                    className="absolute top-1/2 -right-4 -left-4 flex h-10 -translate-y-1/2 items-center justify-center"
                >
                    <div
                        className="flex h-10 w-3 items-center justify-center rounded-full bg-white transition-transform duration-100 group-hover:scale-110"
                    >
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

            <div className="bg-opacity-50 absolute bottom-4 left-4 rounded bg-black px-2 py-1 text-sm text-white">
                Before
            </div>
            <div
                className="bg-opacity-50 absolute right-4 bottom-4 rounded bg-black px-2 py-1 text-sm text-white"
            >
                After
            </div>
        </div>
    )
}