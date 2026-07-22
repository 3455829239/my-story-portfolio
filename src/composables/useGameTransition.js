import { ref } from 'vue'
import gsap from 'gsap'

export function useGameTransition() {
  const isTransitioning = ref(false)

  async function playExitToClueWall({ overlayRef, panelRef, onComplete, duration }) {
    if (isTransitioning.value) return
    isTransitioning.value = true

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        isTransitioning.value = false
        onComplete?.()
      },
    })

    if (panelRef) {
      tl.to(panelRef, {
        scale: 0.92,
        y: 40,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.55,
      })
    }

    tl.to(overlayRef, {
      opacity: 1,
      duration: duration ?? (panelRef ? 0.45 : 0.55),
      ease: duration ? 'power1.inOut' : 'power3.inOut',
    })

    if (panelRef) {
      tl.fromTo(
        overlayRef,
        { backdropFilter: 'blur(0px)' },
        { backdropFilter: 'blur(12px)', duration: 0.5 },
        '-=0.25'
      )
    }

    await tl
  }

  function playClueWallEnter({ headerRef, cardsRef }) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from(headerRef, { y: -30, opacity: 0, duration: 0.5 })
    if (cardsRef?.length) {
      tl.from(
        cardsRef,
        {
          y: 60,
          opacity: 0,
          scale: 0.9,
          stagger: 0.12,
          duration: 0.55,
        },
        '-=0.2'
      )
    }

    return tl
  }

  return { isTransitioning, playExitToClueWall, playClueWallEnter }
}