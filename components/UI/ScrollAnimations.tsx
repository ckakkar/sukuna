"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * ScrollAnimations component
 * Uses GSAP ScrollTrigger for reveal animations and parallax effects
 */
export function ScrollAnimations() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Animate elements on scroll
    const elements = document.querySelectorAll("[data-scroll-reveal]")
    
    elements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
          },
        }
      )
    })

    // Parallax effect for background elements
    const parallaxElements = document.querySelectorAll("[data-parallax]")
    
    parallaxElements.forEach((element) => {
      gsap.to(element, {
        y: (i, el) => {
          const speed = parseFloat(el.getAttribute("data-parallax-speed") || "0.5")
          return -window.innerHeight * speed
        },
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      })
    })

    // Stagger animations for lists
    const listElements = document.querySelectorAll("[data-scroll-stagger]")
    
    listElements.forEach((list) => {
      const items = list.querySelectorAll("[data-scroll-item]")
      gsap.fromTo(
        items,
        {
          opacity: 0,
          x: -30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: list,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return null
}

