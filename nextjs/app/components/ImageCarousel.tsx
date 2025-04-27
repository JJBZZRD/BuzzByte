'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface CarouselImage {
  url: string;
  alt: string;
  description?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoplay?: boolean;
  interval?: number;
  className?: string;
  showDescriptions?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoplay = true,
  interval = 8000,
  className = '',
  showDescriptions = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Function to start the progress bar
  const startProgressBar = () => {
    // Reset progress
    setProgress(0);
    
    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    // Don't start progress if not autoplaying or user is hovering
    if (!autoplay || isHovering || images.length <= 1) return;
    
    // Update progress every 100ms
    const stepTime = 100;
    const steps = interval / stepTime;
    let currentStep = 0;
    
    progressInterval.current = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
      
      if (currentStep >= steps) {
        clearInterval(progressInterval.current!);
      }
    }, stepTime);
  };

  // Set up autoplay and handle hover pause
  useEffect(() => {
    if (!autoplay || images.length <= 1) return;
    if (isHovering) return;

    const timer = setTimeout(goToNext, interval);
    startProgressBar();

    return () => {
      clearTimeout(timer);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, interval, images.length, isHovering, currentIndex]);

  // Reset progress when current index changes
  useEffect(() => {
    startProgressBar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const goToNext = () => {
    setPrevIndex(currentIndex);
    setSlideDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setPrevIndex(currentIndex);
    setSlideDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex) return;
    setPrevIndex(currentIndex);
    setSlideDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return <div className="text-foreground/50">No images to display</div>;
  }

  return (
    <div 
      className={`relative rounded-xl bg-foreground/5 ${className} overflow-hidden group`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Progress bar for autoplay */}
      {autoplay && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-foreground/10 z-20">
          <div 
            className="h-full bg-blue-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {/* Image container */}
      <div className="relative aspect-w-16 aspect-h-9 overflow-hidden rounded-t-xl">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ${
              index === currentIndex 
                ? `opacity-100 transform-none z-10` 
                : index === prevIndex
                  ? `opacity-0 ${slideDirection === 'right' ? '-translate-x-full' : 'translate-x-full'} scale-95 z-0`
                  : 'opacity-0 scale-95 z-0'
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-contain p-4 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Description section */}
      {showDescriptions && (
        <div className="p-4 border-t border-foreground/10 bg-foreground/5 min-h-[80px] rounded-b-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm">
              {/* Animated title */}
              {images.map((image, index) => (
                <span 
                  key={`title-${index}`}
                  className={`absolute transition-all duration-500 ease-in-out ${
                    index === currentIndex 
                      ? 'opacity-100 transform-none' 
                      : 'opacity-0 -translate-y-4'
                  }`}
                  style={{ 
                    transitionDelay: index === currentIndex ? '200ms' : '0ms'
                  }}
                >
                  {image.alt}
                </span>
              ))}
            </h4>
            <span className="text-xs text-foreground/50">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          
          {/* Animated description */}
          <div className="text-sm text-foreground/70 relative min-h-[1.5rem]">
            {images.map((image, index) => (
              <p 
                key={`desc-${index}`}
                className={`absolute transition-all duration-500 ease-in-out ${
                  index === currentIndex 
                    ? 'opacity-100 transform-none' 
                    : 'opacity-0 -translate-y-4'
                }`}
                style={{ 
                  transitionDelay: index === currentIndex ? '300ms' : '0ms'
                }}
              >
                {image.description || 'No description available.'}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/3 -translate-y-1/2 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-300 z-10 hover:scale-110 hover:shadow-lg transform -translate-x-2 hover:translate-x-0"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/3 -translate-y-1/2 bg-foreground/10 hover:bg-foreground/20 text-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-300 z-10 hover:scale-110 hover:shadow-lg transform translate-x-2 hover:translate-x-0"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 h-2.5 bg-blue-500'
                : 'w-2.5 h-2.5 bg-foreground/20 hover:bg-foreground/30'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel; 