import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Menu, X } from 'lucide-react';
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  AWARDS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  EXPERIENCE_CARDS,
  GOOGLE_MAPS_URL,
  HERO_ACTIONS,
  NAV_LINKS,
  WEDDING_PILLARS,
  type EnquiryCategory,
} from './data/monarchData';
import { ResilientImage } from './components/ResilientImage';
import { EnquiryModal } from './components/EnquiryModal';
import { LegalModal, type LegalDocType } from './components/LegalModal';

const PARALLAX_SPRING = {
  stiffness: 88,
  damping: 24,
  restDelta: 0.001,
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryCategory, setEnquiryCategory] =
    useState<EnquiryCategory>('General Enquiry');
  const [legalDoc, setLegalDoc] = useState<LegalDocType>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [gateActive, setGateActive] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const headerRef = useRef<HTMLElement>(null);
  const gateTrackRef = useRef<HTMLDivElement>(null);
  const gateSpacerRef = useRef<HTMLDivElement>(null);
  const experiencesRef = useRef<HTMLElement>(null);
  const diningRef = useRef<HTMLElement>(null);
  const awardsRef = useRef<HTMLElement>(null);
  const weddingsRef = useRef<HTMLElement>(null);
  const arrivalRef = useRef<HTMLElement>(null);

  const [navHeight, setNavHeight] = useState(84);
  const [viewportH, setViewportH] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 900
  );
  const [expHeight, setExpHeight] = useState(960);

  useEffect(() => {
    const updateMetrics = () => {
      if (headerRef.current) {
        setNavHeight(headerRef.current.offsetHeight);
      }
      setViewportH(window.innerHeight);
      if (experiencesRef.current) {
        setExpHeight(experiencesRef.current.offsetHeight);
      }
    };
    updateMetrics();
    window.addEventListener('resize', updateMetrics);

    let observer: ResizeObserver | undefined;
    if (experiencesRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        if (experiencesRef.current) {
          setExpHeight(experiencesRef.current.offsetHeight);
        }
      });
      observer.observe(experiencesRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateMetrics);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const gateDistancePx = Math.max(500, Math.round(viewportH * 0.78));
  const expRevealDistancePx = Math.max(580, Math.round(viewportH * 0.9));
  const totalStagePx = gateDistancePx + expRevealDistancePx;

  // Stage 1: Direct scrollY-linked gate progress (guaranteed 0 at initial page load)
  const { scrollY } = useScroll();
  const rawGateProgress = useTransform(scrollY, [0, gateDistancePx], [0, 1]);
  const gateProgress = useSpring(rawGateProgress, {
    stiffness: 105,
    damping: 26,
    restDelta: 0.001,
  });

  // Stage 2: Right-to-left parallax entrance of Experiences content AFTER gate opens
  const rawExpRevealProgress = useTransform(
    scrollY,
    [gateDistancePx * 0.85, totalStagePx],
    [0, 1]
  );
  const expRevealProgress = useSpring(rawExpRevealProgress, {
    stiffness: 92,
    damping: 25,
    restDelta: 0.001,
  });

  useEffect(() => {
    const unsubscribe = gateProgress.on('change', (latest) => {
      setGateActive(latest > 0.25);
    });
    return () => unsubscribe();
  }, [gateProgress]);

  // Hero subtle parallax inside the gate stage
  const heroImageY = useTransform(
    gateProgress,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['0%', '12%']
  );
  const heroImageScale = useTransform(
    gateProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [1.02, 1.09]
  );
  const heroTextY = useTransform(
    gateProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, 36]
  );
  const heroTextOpacity = useTransform(
    gateProgress,
    [0, 0.7],
    shouldReduceMotion ? [1, 1] : [1, 0.25]
  );

  // Expanding vertical gate from the white line under the navbar down to the bottom (pure numeric px)
  const effectiveExpH = Math.max(expHeight, viewportH);
  const startBottomClipPx = Math.max(0, effectiveExpH - navHeight);
  const midBottomClipPx = Math.max(0, effectiveExpH - viewportH);

  const topInsetPx = useTransform(
    gateProgress,
    [0, 0.12, 1],
    shouldReduceMotion ? [0, 0, 0] : [navHeight, 0, 0]
  );
  const bottomClipPx = useTransform(
    gateProgress,
    [0, 0.85, 1],
    shouldReduceMotion
      ? [0, 0, 0]
      : [startBottomClipPx, midBottomClipPx, 0]
  );
  const gateClipPath = useMotionTemplate`inset(${topInsetPx}px 0px ${bottomClipPx}px 0px)`;
  const expOpacity = useTransform(
    gateProgress,
    [0, 0.004, 0.02],
    shouldReduceMotion ? [1, 1, 1] : [0, 0, 1]
  );

  // Travelling white hairline at the bottom edge of the opening gate
  const gateLineTopPx = useTransform(
    gateProgress,
    [0, 0.85, 1],
    [navHeight, viewportH, viewportH]
  );
  const gateLineTop = useMotionTemplate`${gateLineTopPx}px`;
  const gateLineOpacity = useTransform(
    gateProgress,
    [0, 0.01, 0.82, 0.9],
    shouldReduceMotion ? [0, 0, 0, 0] : [0, 0.95, 0.95, 0]
  );

  // Stage 2 right-to-left parallax transforms for Experiences content
  const expHeadingX = useTransform(
    expRevealProgress,
    [0, 0.48],
    shouldReduceMotion ? [0, 0] : [160, 0]
  );
  const expHeadingOpacity = useTransform(
    expRevealProgress,
    [0, 0.35],
    shouldReduceMotion ? [1, 1] : [0, 1]
  );
  const expIntroX = useTransform(
    expRevealProgress,
    [0.06, 0.56],
    shouldReduceMotion ? [0, 0] : [220, 0]
  );
  const expIntroOpacity = useTransform(
    expRevealProgress,
    [0.06, 0.42],
    shouldReduceMotion ? [1, 1] : [0, 1]
  );

  const card0X = useTransform(expRevealProgress, [0.1, 0.62], shouldReduceMotion ? [0, 0] : [240, 0]);
  const card1X = useTransform(expRevealProgress, [0.18, 0.72], shouldReduceMotion ? [0, 0] : [340, 0]);
  const card2X = useTransform(expRevealProgress, [0.26, 0.82], shouldReduceMotion ? [0, 0] : [440, 0]);
  const card3X = useTransform(expRevealProgress, [0.34, 0.94], shouldReduceMotion ? [0, 0] : [540, 0]);

  const card0Opacity = useTransform(expRevealProgress, [0.1, 0.42], shouldReduceMotion ? [1, 1] : [0, 1]);
  const card1Opacity = useTransform(expRevealProgress, [0.18, 0.52], shouldReduceMotion ? [1, 1] : [0, 1]);
  const card2Opacity = useTransform(expRevealProgress, [0.26, 0.62], shouldReduceMotion ? [1, 1] : [0, 1]);
  const card3Opacity = useTransform(expRevealProgress, [0.34, 0.72], shouldReduceMotion ? [1, 1] : [0, 1]);

  const card0ImgX = useTransform(expRevealProgress, [0.1, 0.72], shouldReduceMotion ? ['0%', '0%'] : ['8%', '0%']);
  const card1ImgX = useTransform(expRevealProgress, [0.18, 0.8], shouldReduceMotion ? ['0%', '0%'] : ['10%', '0%']);
  const card2ImgX = useTransform(expRevealProgress, [0.26, 0.88], shouldReduceMotion ? ['0%', '0%'] : ['12%', '0%']);
  const card3ImgX = useTransform(expRevealProgress, [0.34, 0.98], shouldReduceMotion ? ['0%', '0%'] : ['14%', '0%']);

  const cardMotion = [
    { x: card0X, opacity: card0Opacity, imgX: card0ImgX },
    { x: card1X, opacity: card1Opacity, imgX: card1ImgX },
    { x: card2X, opacity: card2Opacity, imgX: card2ImgX },
    { x: card3X, opacity: card3Opacity, imgX: card3ImgX },
  ];

  // Dining full-viewport pinned gallery: left-to-right parallax image reveals
  const { scrollYProgress: diningProgress } = useScroll({
    target: diningRef,
    offset: ['start start', 'end end'],
  });
  const smoothDiningProgress = useSpring(diningProgress, {
    stiffness: 92,
    damping: 26,
    restDelta: 0.001,
  });

  const diningBaseX = useTransform(
    smoothDiningProgress,
    [0.04, 0.24],
    shouldReduceMotion ? ['0%', '0%'] : ['0%', '4%']
  );

  // Reveal 1: Bar & Lounge (/assets/aistudio/image_61_3282cd5e.png)
  const diningRight1 = useTransform(smoothDiningProgress, [0.04, 0.24], shouldReduceMotion ? [100, 100] : [100, 0]);
  const diningClip1 = useMotionTemplate`inset(0% ${diningRight1}% 0% 0%)`;
  const diningX1 = useTransform(smoothDiningProgress, [0.04, 0.24, 0.27, 0.47], shouldReduceMotion ? ['0%', '0%', '0%', '0%'] : ['-6%', '0%', '0%', '4%']);
  const diningEdgeLeft1Pct = useTransform(smoothDiningProgress, [0.04, 0.24], [0, 100]);
  const diningEdgeLeft1 = useMotionTemplate`${diningEdgeLeft1Pct}%`;
  const diningEdgeOpacity1 = useTransform(smoothDiningProgress, [0.03, 0.06, 0.22, 0.25], shouldReduceMotion ? [0, 0, 0, 0] : [0, 0.85, 0.85, 0]);

  // Reveal 2: Loft Dining Hall (/assets/aistudio/image_62_e8477a35.png)
  const diningRight2 = useTransform(smoothDiningProgress, [0.27, 0.47], shouldReduceMotion ? [100, 100] : [100, 0]);
  const diningClip2 = useMotionTemplate`inset(0% ${diningRight2}% 0% 0%)`;
  const diningX2 = useTransform(smoothDiningProgress, [0.27, 0.47, 0.5, 0.7], shouldReduceMotion ? ['0%', '0%', '0%', '0%'] : ['-6%', '0%', '0%', '4%']);
  const diningEdgeLeft2Pct = useTransform(smoothDiningProgress, [0.27, 0.47], [0, 100]);
  const diningEdgeLeft2 = useMotionTemplate`${diningEdgeLeft2Pct}%`;
  const diningEdgeOpacity2 = useTransform(smoothDiningProgress, [0.26, 0.29, 0.45, 0.48], shouldReduceMotion ? [0, 0, 0, 0] : [0, 0.85, 0.85, 0]);

  // Reveal 3: Private Banquet Room (/assets/aistudio/image_63_8e860b2c.png)
  const diningRight3 = useTransform(smoothDiningProgress, [0.5, 0.7], shouldReduceMotion ? [100, 100] : [100, 0]);
  const diningClip3 = useMotionTemplate`inset(0% ${diningRight3}% 0% 0%)`;
  const diningX3 = useTransform(smoothDiningProgress, [0.5, 0.7, 0.73, 0.93], shouldReduceMotion ? ['0%', '0%', '0%', '0%'] : ['-6%', '0%', '0%', '4%']);
  const diningEdgeLeft3Pct = useTransform(smoothDiningProgress, [0.5, 0.7], [0, 100]);
  const diningEdgeLeft3 = useMotionTemplate`${diningEdgeLeft3Pct}%`;
  const diningEdgeOpacity3 = useTransform(smoothDiningProgress, [0.49, 0.52, 0.68, 0.71], shouldReduceMotion ? [0, 0, 0, 0] : [0, 0.85, 0.85, 0]);

  // Reveal 4: Japanese Lantern Dining (/assets/aistudio/image_64_4c89b47a.png)
  const diningRight4 = useTransform(smoothDiningProgress, [0.73, 0.93], shouldReduceMotion ? [100, 100] : [100, 0]);
  const diningClip4 = useMotionTemplate`inset(0% ${diningRight4}% 0% 0%)`;
  const diningX4 = useTransform(smoothDiningProgress, [0.73, 0.93], shouldReduceMotion ? ['0%', '0%'] : ['-6%', '0%']);
  const diningEdgeLeft4Pct = useTransform(smoothDiningProgress, [0.73, 0.93], [0, 100]);
  const diningEdgeLeft4 = useMotionTemplate`${diningEdgeLeft4Pct}%`;
  const diningEdgeOpacity4 = useTransform(smoothDiningProgress, [0.72, 0.75, 0.91, 0.94], shouldReduceMotion ? [0, 0, 0, 0] : [0, 0.85, 0.85, 0]);

  const diningRevealSlides = [
    {
      src: '/assets/aistudio/image_61_3282cd5e.png',
      alt: 'Artisanal bar and lounge with warm pendant lighting at Monarch Imperial',
      fallbackLabel: 'The Bar & Lounge',
      clipPath: diningClip1,
      x: diningX1,
      edgeLeft: diningEdgeLeft1,
      edgeOpacity: diningEdgeOpacity1,
      zClass: 'z-[2]',
    },
    {
      src: '/assets/aistudio/image_62_e8477a35.png',
      alt: 'Two-storey brick and timber dining room at Monarch Imperial',
      fallbackLabel: 'The Dining Loft',
      clipPath: diningClip2,
      x: diningX2,
      edgeLeft: diningEdgeLeft2,
      edgeOpacity: diningEdgeOpacity2,
      zClass: 'z-[3]',
    },
    {
      src: '/assets/aistudio/image_63_8e860b2c.png',
      alt: 'Intimate private dining room with long timber banquet table',
      fallbackLabel: 'Private Dining Sanctuary',
      clipPath: diningClip3,
      x: diningX3,
      edgeLeft: diningEdgeLeft3,
      edgeOpacity: diningEdgeOpacity3,
      zClass: 'z-[4]',
    },
    {
      src: '/assets/aistudio/image_64_4c89b47a.png',
      alt: 'Japanese culinary pavilion with paper lanterns and timber flutes',
      fallbackLabel: 'Japanese Pavilion',
      clipPath: diningClip4,
      x: diningX4,
      edgeLeft: diningEdgeLeft4,
      edgeOpacity: diningEdgeOpacity4,
      zClass: 'z-[5]',
    },
  ];

  // Awards full-viewport 3D Z-depth parallax stage + bottom-to-top Weddings curtain takeover
  const { scrollYProgress: awardsProgress } = useScroll({
    target: awardsRef,
    offset: ['start 0.75', 'end end'],
  });
  const smoothAwardsProgress = useSpring(awardsProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  // Whole stage recedes subtly into depth as #weddings rises from bottom to top (after ~2-scroll hold)
  const awardsStageScale = useTransform(
    smoothAwardsProgress,
    [0.785, 1],
    shouldReduceMotion ? [1, 1] : [1, 0.94]
  );
  const awardsStageY = useTransform(
    smoothAwardsProgress,
    [0.785, 1],
    shouldReduceMotion ? [0, 0] : [0, -28]
  );
  const awardsStageOpacity = useTransform(
    smoothAwardsProgress,
    [0.785, 1],
    shouldReduceMotion ? [1, 1] : [1, 0.35]
  );

  const awardsHeadingScale = useTransform(
    smoothAwardsProgress,
    [0, 0.32, 0.42],
    shouldReduceMotion ? [1, 1, 1] : [0.9, 1, 1]
  );
  const awardsHeadingOpacity = useTransform(
    smoothAwardsProgress,
    [0, 0.2],
    shouldReduceMotion ? [1, 1] : [0.68, 1]
  );

  // 5 Awards arrive by 0.40 into exact balanced pentagon placement around center,
  // then hold settled for ~1.5svh (~2 deliberate scrolls) before #weddings takes over at 0.76:

  // Award 0 (Mid-Left): Best Boutique Hotel — Near foreground plane
  const award0Scale = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [1, 1] : [0.85, 1]);
  const award0X = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [0, 0] : [76, 0]);
  const award0Y = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [0, 0] : [14, 0]);
  const award0Opacity = useTransform(smoothAwardsProgress, [0, 0.22], shouldReduceMotion ? [1, 1] : [0.76, 1]);
  const award0BlurPx = useTransform(smoothAwardsProgress, [0, 0.32], [0, 0]);
  const award0Filter = useMotionTemplate`blur(${award0BlurPx}px)`;

  // Award 1 (Mid-Right): Outstanding Service — Mid-distance plane
  const award1Scale = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [1, 1] : [0.58, 1]);
  const award1X = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [0, 0] : [-98, 0]);
  const award1Y = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [0, 0] : [18, 0]);
  const award1Opacity = useTransform(smoothAwardsProgress, [0, 0.34], shouldReduceMotion ? [1, 1] : [0.45, 1]);
  const award1BlurPx = useTransform(smoothAwardsProgress, [0, 0.36], shouldReduceMotion ? [0, 0] : [1.8, 0]);
  const award1Filter = useMotionTemplate`blur(${award1BlurPx}px)`;

  // Award 2 (Bottom-Left Inner): Sustainable Stays — Mid-distance plane
  const award2Scale = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [1, 1] : [0.56, 1]);
  const award2X = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [0, 0] : [74, 0]);
  const award2Y = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [0, 0] : [-86, 0]);
  const award2Opacity = useTransform(smoothAwardsProgress, [0, 0.35], shouldReduceMotion ? [1, 1] : [0.42, 1]);
  const award2BlurPx = useTransform(smoothAwardsProgress, [0, 0.37], shouldReduceMotion ? [0, 0] : [2.0, 0]);
  const award2Filter = useMotionTemplate`blur(${award2BlurPx}px)`;

  // Award 3 (Top-Center): Culinary Excellence — Deep far-away plane emerging forward
  const award3Scale = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [1, 1] : [0.36, 1]);
  const award3X = useTransform(smoothAwardsProgress, [0, 0.4], [0, 0]);
  const award3Y = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [0, 0] : [118, 0]);
  const award3Opacity = useTransform(smoothAwardsProgress, [0, 0.38], shouldReduceMotion ? [1, 1] : [0.24, 1]);
  const award3BlurPx = useTransform(smoothAwardsProgress, [0, 0.39], shouldReduceMotion ? [0, 0] : [3.5, 0]);
  const award3Filter = useMotionTemplate`blur(${award3BlurPx}px)`;

  // Award 4 (Bottom-Right Inner): Inspired Design — Near foreground plane
  const award4Scale = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [1, 1] : [0.84, 1]);
  const award4X = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [0, 0] : [-56, 0]);
  const award4Y = useTransform(smoothAwardsProgress, [0, 0.4], shouldReduceMotion ? [0, 0] : [-42, 0]);
  const award4Opacity = useTransform(smoothAwardsProgress, [0, 0.22], shouldReduceMotion ? [1, 1] : [0.76, 1]);
  const award4BlurPx = useTransform(smoothAwardsProgress, [0, 0.32], [0, 0]);
  const award4Filter = useMotionTemplate`blur(${award4BlurPx}px)`;

  const awardMotion = [
    {
      scale: award0Scale,
      x: award0X,
      y: award0Y,
      opacity: award0Opacity,
      filter: award0Filter,
      positionClass:
        'top-[28%] left-[3%] md:top-[33%] md:left-[6%] lg:left-[8%] z-30',
      originClass: 'origin-right',
    },
    {
      scale: award1Scale,
      x: award1X,
      y: award1Y,
      opacity: award1Opacity,
      filter: award1Filter,
      positionClass:
        'top-[28%] right-[3%] md:top-[33%] md:right-[6%] lg:right-[8%] z-10',
      originClass: 'origin-left',
    },
    {
      scale: award2Scale,
      x: award2X,
      y: award2Y,
      opacity: award2Opacity,
      filter: award2Filter,
      positionClass:
        'bottom-[4%] left-[5%] md:bottom-[5%] md:left-[18%] lg:left-[21%] z-10',
      originClass: 'origin-top-right',
    },
    {
      scale: award3Scale,
      x: award3X,
      y: award3Y,
      opacity: award3Opacity,
      filter: award3Filter,
      positionClass:
        'top-[2%] left-0 right-0 mx-auto md:top-[2%] z-[5]',
      originClass: 'origin-bottom',
    },
    {
      scale: award4Scale,
      x: award4X,
      y: award4Y,
      opacity: award4Opacity,
      filter: award4Filter,
      positionClass:
        'bottom-[4%] right-[5%] md:bottom-[5%] md:right-[18%] lg:right-[21%] z-30',
      originClass: 'origin-top-left',
    },
  ];

  // Weddings tri-panel subtle opposing parallax
  const { scrollYProgress: weddingsProgress } = useScroll({
    target: weddingsRef,
    offset: ['start end', 'end start'],
  });
  const smoothWeddingsProgress = useSpring(weddingsProgress, PARALLAX_SPRING);
  const weddingsPortraitY = useTransform(
    smoothWeddingsProgress,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['-4%', '4%']
  );
  const weddingsWideY = useTransform(
    smoothWeddingsProgress,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['3%', '-3%']
  );

  // Arrival atrium backdrop parallax
  const { scrollYProgress: arrivalProgress } = useScroll({
    target: arrivalRef,
    offset: ['start end', 'end start'],
  });
  const smoothArrivalProgress = useSpring(arrivalProgress, PARALLAX_SPRING);
  const arrivalImageY = useTransform(
    smoothArrivalProgress,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['-8%', '8%']
  );

  const openEnquiry = (category: EnquiryCategory = 'General Enquiry') => {
    setEnquiryCategory(category);
    setEnquiryOpen(true);
    setMobileMenuOpen(false);
  };

  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    const targetId = href.slice(1);
    const el = document.getElementById(targetId);
    if (!el) return;
    e.preventDefault();
    setMobileMenuOpen(false);

    if (targetId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
      return;
    }

    const gateTravel = gateSpacerRef.current?.offsetHeight ?? totalStagePx;

    if (targetId === 'experiences') {
      window.scrollTo({
        top: Math.max(0, gateTravel),
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
      return;
    }

    if (targetId === 'events' || targetId === 'stay') {
      const targetTop = Math.max(
        gateTravel,
        el.getBoundingClientRect().top + window.scrollY - 88
      );
      window.scrollTo({
        top: targetTop,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
      return;
    }

    if (targetId === 'weddings' || targetId === 'dining') {
      const targetTop = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
      return;
    }

    const targetTop =
      el.getBoundingClientRect().top + window.scrollY - Math.max(72, navHeight);
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f7f2] text-[#252923] overflow-x-clip">
      {/* Sticky Top Navigation Bar (transparent over hero, warm white matching background on scroll) */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-[background-color,border-color,box-shadow] duration-300 ${
          isScrolled
            ? 'bg-[#f8f7f2]/95 backdrop-blur-md border-b border-[#252923]/12 shadow-[0_1px_12px_rgba(37,41,35,0.06)]'
            : 'bg-transparent border-b border-white/55'
        }`}
      >
        <div
          className={`w-full px-6 md:px-12 lg:px-[5.4vw] flex items-center justify-between gap-8 transition-[padding] duration-300 ${
            isScrolled ? 'py-3.5 lg:py-4' : 'py-4 lg:py-6'
          }`}
        >
          <a
            href="#home"
            onClick={(e) => handleAnchorClick(e, '#home')}
            className="shrink-0 focus-visible:outline-offset-4"
            aria-label="Monarch Imperial Home"
          >
            <ResilientImage
              src="/assets/37-20-cdd0c5e53f.png"
              alt="Monarch Imperial"
              fallbackLabel="MONARCH IMPERIAL"
              className={`h-9 lg:h-11 w-auto object-contain transition-[filter] duration-300 ${
                isScrolled ? 'brightness-90 contrast-110' : ''
              }`}
            />
          </a>

          <nav
            aria-label="Primary Navigation"
            className={`hidden lg:flex items-center gap-8 xl:gap-11 text-[13px] font-normal transition-colors duration-300 ${
              isScrolled ? 'text-[#252923]' : 'text-[#f3f0e8]'
            }`}
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className={`whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  isScrolled ? 'hover:text-[#725b38]' : 'hover:text-[#e4cea0]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openEnquiry('General Enquiry')}
              className="bg-gold-gradient text-[#f3f0e8] px-4 py-2 lg:px-6 lg:py-2.5 text-[11px] lg:text-[12px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-opacity duration-150"
            >
              Make an enquiry
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileMenuOpen}
              className={`lg:hidden p-2 transition-colors ${
                isScrolled
                  ? 'text-[#252923] hover:text-[#725b38]'
                  : 'text-[#f3f0e8] hover:text-[#e4cea0]'
              }`}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className={`lg:hidden absolute top-full left-0 right-0 backdrop-blur-md border-b px-6 py-6 flex flex-col gap-4 z-40 ${
              isScrolled
                ? 'bg-[#f8f7f2]/98 text-[#252923] border-[#252923]/12'
                : 'bg-[#141512]/96 text-[#f3f0e8] border-white/15'
            }`}
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleAnchorClick(e, item.href)}
                className={`text-sm py-1 transition-colors ${
                  isScrolled ? 'hover:text-[#725b38]' : 'hover:text-[#e4cea0]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero + Vertical Gate Reveal Stage */}
      <div ref={gateTrackRef} className="relative w-full">
        {/* Section 1: Full-Viewport Hero (pinned while gate expands downward) */}
        <section
          id="home"
          aria-label="Monarch Imperial"
          style={shouldReduceMotion ? undefined : { height: viewportH }}
          className={`${
            shouldReduceMotion ? 'relative' : 'sticky top-0'
          } z-0 isolate w-full h-[100svh] min-h-[600px] flex flex-col justify-between text-[#f3f0e8] overflow-hidden`}
        >
          {/* Full-bleed Hero Photography & Vignette with Smooth Parallax */}
          <motion.div
            style={{ y: heroImageY, scale: heroImageScale }}
            className="absolute inset-0 z-0 pointer-events-none will-change-transform"
          >
            <ResilientImage
              src="/assets/aistudio/image_5_594dca7a.png"
              alt="Monarch Imperial grand hall entrance"
              fallbackLabel="Monarch Imperial"
              className="w-full h-full object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.36) 95%)',
              }}
            />
          </motion.div>

          {/* Top Spacer matching navbar height */}
          <div className="h-20 lg:h-24 shrink-0" aria-hidden="true" />

          {/* Hero Headline (lighter regular editorial weight) */}
          <motion.div
            style={{ y: heroTextY, opacity: heroTextOpacity }}
            className="relative z-10 w-full px-6 md:px-12 lg:px-[5.4vw] my-auto pb-8 will-change-transform"
          >
            <h1
              className="font-display font-normal text-[#f3f0e8]/95 text-[clamp(2.75rem,6.4vw,6rem)] leading-[1.02] tracking-[-0.02em] max-w-[1040px]"
              style={{ textShadow: '0px 1px 12px rgba(0, 0, 0, 0.14)' }}
            >
              Some Places
              <br />
              Stays with You
            </h1>
          </motion.div>

          {/* Hero Bottom Bar */}
          <div className="relative z-10 w-full px-6 md:px-12 lg:px-[5.4vw] pb-7 lg:pb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <p className="text-[11px] sm:text-[12px] font-semibold tracking-[1.5px] text-[#f3f0e8] uppercase">
              SRI JAYAWARDENEPURA KOTTE, SRI LANKA
            </p>

            <div className="flex flex-wrap items-center gap-6 sm:gap-10 lg:gap-12">
              {HERO_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => openEnquiry(action.category)}
                  className="group inline-flex items-center gap-3 text-[14px] sm:text-[15px] text-[#f3f0e8] hover:text-[#e4cea0] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{action.label}</span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    ↗
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Scroll travel spacer driving the vertical gate + right-to-left reveal */}
        {!shouldReduceMotion && (
          <div
            ref={gateSpacerRef}
            aria-hidden="true"
            style={{ height: totalStagePx }}
            className="w-full pointer-events-none"
          />
        )}

        {/* Travelling white gate line descending from under the navbar to the bottom */}
        {!shouldReduceMotion && (
          <motion.div
            aria-hidden="true"
            style={{ top: gateLineTop, opacity: gateLineOpacity }}
            className="fixed left-0 right-0 z-30 h-[2px] bg-white pointer-events-none shadow-[0_2px_18px_rgba(255,255,255,0.45)]"
          />
        )}

        {/* Section 2: Experiences (gate opens downward, then content enters right-to-left with parallax) */}
        <motion.section
          ref={experiencesRef}
          id="experiences"
          aria-label="Experiences"
          style={
            shouldReduceMotion
              ? undefined
              : {
                  marginTop: -(viewportH + totalStagePx),
                  clipPath: gateClipPath,
                  opacity: expOpacity,
                }
          }
          className={`${
            shouldReduceMotion ? 'relative' : 'sticky top-0'
          } z-10 w-full min-h-[100svh] bg-[#f8f7f2] px-6 md:px-12 lg:px-[5.4vw] pt-28 lg:pt-32 pb-20 lg:pb-28 overflow-x-clip ${
            gateActive || shouldReduceMotion
              ? 'pointer-events-auto'
              : 'pointer-events-none'
          }`}
        >
          <div className="w-full">
            <div className="w-full flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <motion.h2
                style={{ x: expHeadingX, opacity: expHeadingOpacity }}
                className="font-display font-normal text-[#252923] text-[clamp(2.25rem,3.75vw,3.5rem)] leading-[1.18] tracking-[-0.02em] max-w-3xl text-balance will-change-transform"
              >
                Thoughtfully curated experiences
              </motion.h2>
              <motion.p
                style={{ x: expIntroX, opacity: expIntroOpacity }}
                className="text-[14px] leading-[1.7] text-[#626559] max-w-sm lg:pb-1 will-change-transform"
              >
                For a lingering evening. A once-in-a-lifetime day.
                <br />
                For whatever brings you here.
              </motion.p>
            </div>

            <div className="mt-14 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-9 xl:gap-11 items-start">
              {EXPERIENCE_CARDS.map((card, index) => {
                const motionProps = cardMotion[index];
                const cardInner = (
                  <>
                    <div className="w-full aspect-[294/400] overflow-hidden bg-[#ebe7dc]">
                      <motion.div
                        style={{
                          x: motionProps.imgX,
                          scale: shouldReduceMotion ? 1 : 1.08,
                        }}
                        className="w-full h-full will-change-transform"
                      >
                        <ResilientImage
                          src={card.image}
                          alt={card.alt}
                          fallbackLabel={card.title}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </motion.div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <h3 className="font-display font-normal text-[28px] xl:text-[32px] leading-[1.4] text-[#252923]">
                        {card.title}
                      </h3>
                      <span
                        aria-hidden="true"
                        className="text-[22px] text-[#252923] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      >
                        ↗
                      </span>
                    </div>
                    <p className="mt-1.5 text-[12px] leading-[1.4] text-[#626559]">
                      {card.description}
                    </p>
                  </>
                );

                if (card.enquiryCategory) {
                  return (
                    <motion.div
                      key={card.id}
                      id={card.anchor}
                      style={{ x: motionProps.x, opacity: motionProps.opacity }}
                      className={`scroll-mt-24 will-change-transform ${card.staggered ? 'lg:mt-16' : ''}`}
                    >
                      <button
                        type="button"
                        onClick={() => openEnquiry(card.enquiryCategory)}
                        className="group block w-full text-left cursor-pointer"
                      >
                        {cardInner}
                      </button>
                    </motion.div>
                  );
                }

                return (
                  <motion.a
                    key={card.id}
                    id={card.anchor}
                    href={card.href}
                    onClick={(e) => handleAnchorClick(e, card.href)}
                    style={{ x: motionProps.x, opacity: motionProps.opacity }}
                    className={`group block w-full scroll-mt-24 will-change-transform ${card.staggered ? 'lg:mt-16' : ''}`}
                  >
                    {cardInner}
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Bottom sticky hold spacer so Experiences stays pinned while gate + right-to-left reveal complete */}
        {!shouldReduceMotion && (
          <div
            aria-hidden="true"
            style={{ height: totalStagePx }}
            className="w-full pointer-events-none"
          />
        )}
      </div>

      {/* Section 3: Dining Split — Full-Viewport Pinned Stage with Left-to-Right Parallax Reveals */}
      <section
        ref={diningRef}
        id="dining"
        aria-label="Dining"
        className={`relative z-20 w-full bg-[#e4cea0] ${
          shouldReduceMotion ? '' : 'lg:h-[420svh]'
        }`}
      >
        <div className="w-full bg-[#e4cea0] grid grid-cols-1 lg:grid-cols-[61.4%_38.6%] lg:sticky lg:top-0 lg:h-[100svh] lg:min-h-[640px] overflow-hidden">
          {/* Left Full-Height Culinary & Dining Photography with Sequential Left-to-Right Parallax Reveals */}
          <div className="relative h-[56svh] min-h-[400px] lg:h-full lg:min-h-0 overflow-hidden bg-[#1e1a15]">
            {/* Initial Base Photo */}
            <motion.div
              style={{ x: diningBaseX, scale: shouldReduceMotion ? 1 : 1.14 }}
              className="absolute inset-0 z-[1] will-change-transform"
            >
              <ResilientImage
                src="/assets/37-61-85b12c061d.png"
                alt="Signature grand hall and dining architecture"
                fallbackLabel="Dining at Monarch Imperial"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>

            {/* Sequential Left-to-Right Parallax Reveal Slides */}
            {diningRevealSlides.map((slide) => (
              <motion.div
                key={slide.src}
                style={{ clipPath: slide.clipPath }}
                className={`absolute inset-0 overflow-hidden pointer-events-none will-change-[clip-path] ${slide.zClass}`}
              >
                <motion.div
                  style={{ x: slide.x, scale: shouldReduceMotion ? 1 : 1.14 }}
                  className="w-full h-full will-change-transform"
                >
                  <ResilientImage
                    src={slide.src}
                    alt={slide.alt}
                    fallbackLabel={slide.fallbackLabel}
                    className="w-full h-full object-cover object-center"
                  />
                </motion.div>
              </motion.div>
            ))}

            {/* Subtle Traveling Hairline Along Each Left-to-Right Wipe Edge */}
            {diningRevealSlides.map((slide) => (
              <motion.div
                key={`${slide.src}-edge`}
                aria-hidden="true"
                style={{ left: slide.edgeLeft, opacity: slide.edgeOpacity }}
                className="hidden lg:block absolute top-0 bottom-0 w-px bg-[#f3f0e8]/80 shadow-[0_0_14px_rgba(243,240,232,0.55)] z-[6] pointer-events-none"
              />
            ))}

            <div
              aria-hidden="true"
              className="absolute inset-0 z-[8] pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.45) 100%)',
              }}
            />

            <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-12 lg:px-[5.4vw] pb-7 lg:pb-8 flex items-center justify-between gap-6 text-[#f3f0e8] text-[15px] font-medium">
              <a
                href="#dining-editorial"
                onClick={(e) => handleAnchorClick(e, '#dining-editorial')}
                className="group inline-flex items-center gap-3 hover:text-[#e4cea0] transition-colors whitespace-nowrap"
              >
                <span>Explore dining</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </a>

              <button
                type="button"
                onClick={() => openEnquiry('Table Reservation')}
                className="group inline-flex items-center gap-3 hover:text-[#e4cea0] transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Reserve a table</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </button>
            </div>
          </div>

          {/* Right Editorial Column */}
          <div
            id="dining-editorial"
            className="scroll-mt-20 px-6 md:px-12 lg:px-10 xl:px-14 py-14 lg:pt-[88px] lg:pb-8 lg:h-full flex flex-col justify-between gap-4 lg:overflow-hidden"
          >
            <div className="max-w-[480px] shrink-0">
              <h2 className="font-display font-normal text-[#252923] text-[clamp(1.85rem,2.75vw,3.125rem)] leading-[1.14] tracking-[-0.02em] text-balance">
                A sense of place. An art of welcome.
              </h2>

              <p className="mt-4 text-[14px] xl:text-[15px] leading-[1.7] text-[#252923]">
                Rooted in Sri Lanka. Made for your extraordinary.
                <br />
                Beyond the everyday, a different rhythm awaits. Where thoughtful
                architecture opens to nature, flavours bring people together, and
                every occasion is given room to become a memory.
              </p>
            </div>

            <div className="my-4 lg:my-2 flex-1 min-h-0 flex items-center justify-center">
              <div className="w-full max-w-[340px] lg:w-auto lg:h-full lg:max-h-[380px] aspect-[376/430] overflow-hidden bg-[#d8c190]">
                <ResilientImage
                  src="/assets/37-71-974e18c0b6.png"
                  alt="Cocktail hour and illuminated foyer corridor"
                  fallbackLabel="The Evening, Beautifully Poured"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 lg:gap-5 shrink-0">
              <button
                type="button"
                onClick={() => openEnquiry('Table Reservation')}
                className="bg-white text-[#725b38] hover:bg-[#f8f7f2] px-6 py-2.5 text-[12px] font-medium whitespace-nowrap cursor-pointer transition-colors"
              >
                Make an enquiry
              </button>

              <p className="text-[10px] tracking-[1.5px] text-[#725b38] uppercase">
                THE EVENING, BEAUTIFULLY POURED.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Awards and Recognition — Full-Viewport 3D Z-Depth Orbital Stage */}
      <section
        ref={awardsRef}
        id="awards"
        aria-label="Awards and recognition"
        className={`relative z-20 w-full bg-[#f8f7f2] ${
          shouldReduceMotion ? 'min-h-[100svh]' : 'h-[490svh]'
        }`}
      >
        <div
          className={`w-full overflow-hidden bg-[#f8f7f2] pt-[74px] pb-4 ${
            shouldReduceMotion
              ? 'h-[100svh] flex items-center justify-center'
              : 'sticky top-0 h-[100svh]'
          }`}
          style={{ perspective: '1200px' }}
        >
          <motion.div
            style={{
              scale: awardsStageScale,
              y: awardsStageY,
              opacity: awardsStageOpacity,
            }}
            className="relative w-full h-full max-w-[1440px] mx-auto px-4 md:px-10 will-change-transform"
          >
            {/* Centered Legacy Headline */}
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
              <motion.div
                style={{
                  scale: awardsHeadingScale,
                  opacity: awardsHeadingOpacity,
                }}
                className="relative flex items-center justify-center px-8 py-6 will-change-transform"
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -m-8 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(248,247,242,0.92) 0%, rgba(248,247,242,0.72) 55%, rgba(248,247,242,0) 80%)',
                  }}
                />
                <h2 className="relative font-display font-normal text-[#252923] text-[clamp(2rem,3.6vw,3.5rem)] leading-[1.15] tracking-[-0.02em] text-center max-w-[11ch]">
                  A legacy of excellence
                </h2>
              </motion.div>
            </div>

            {/* Orbital Award Logos Emerging From Varied Z-Depth Planes into Balanced Pentagon */}
            {AWARDS.map((award, index) => {
              const depth = awardMotion[index];

              return (
                <motion.article
                  key={award.id}
                  style={{
                    scale: depth.scale,
                    x: depth.x,
                    y: depth.y,
                    opacity: depth.opacity,
                    filter: depth.filter,
                  }}
                  className={`absolute w-[152px] sm:w-[186px] md:w-[220px] lg:w-[250px] flex flex-col items-center text-center will-change-transform ${depth.positionClass} ${depth.originClass}`}
                >
                  <div className="h-[48px] sm:h-[62px] md:h-[72px] lg:h-[82px] w-full max-w-[185px] flex items-center justify-center overflow-hidden">
                    <ResilientImage
                      src={award.image}
                      alt={award.alt}
                      fallbackLabel={award.title}
                      className={`max-h-[44px] sm:max-h-[58px] md:max-h-[68px] lg:max-h-[76px] w-auto object-contain mix-blend-multiply ${award.cropClass || ''}`}
                    />
                  </div>

                  <p className="mt-2 md:mt-2.5 text-[11px] md:text-[12px] text-[#626559] tabular-nums">
                    {award.year}
                  </p>
                  <h3 className="mt-1 font-display font-normal text-[15px] sm:text-[18px] md:text-[21px] lg:text-[23px] leading-[1.25] text-[#252923]">
                    {award.title}
                  </h3>
                  <p className="hidden md:block mt-1.5 text-[12px] lg:text-[13px] leading-[1.5] text-[#626559] max-w-[235px]">
                    {award.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Section 5: Weddings and Celebrations — Bottom-to-Top Curtain Takeover Over Pinned Awards */}
      <section
        ref={weddingsRef}
        id="weddings"
        aria-label="Weddings and celebrations"
        className={`relative z-30 w-full bg-[#f8f7f2] border-t border-[#252923]/10 shadow-[0_-24px_64px_rgba(37,41,35,0.09)] px-6 md:px-12 lg:px-[5.4vw] pt-24 pb-24 lg:py-28 ${
          shouldReduceMotion ? '' : '-mt-[100svh]'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-end">
          <h2 className="font-display font-normal text-[#252923] text-[clamp(2.25rem,3.75vw,3.5rem)] leading-[1.18] tracking-[-0.02em] max-w-3xl text-balance">
            A Tradition of Vows &amp; Royal Celebrations
          </h2>

          <p className="text-[15px] leading-[1.7] text-[#252923] max-w-md lg:ml-auto">
            Every union celebrated at Monarch Imperial becomes part of a storied
            ledger of royalty, statesmanship, and romance. We provide an
            unrepeatable canvas for life’s grandest commitments.
          </p>
        </div>

        <div className="mt-12 lg:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Portrait Image with Subtle Parallax */}
          <div className="lg:col-span-5 overflow-hidden bg-[#ebe7dc] min-h-[420px] lg:min-h-[620px]">
            <motion.div
              style={{ y: weddingsPortraitY, scale: shouldReduceMotion ? 1 : 1.09 }}
              className="w-full h-full will-change-transform"
            >
              <ResilientImage
                src="/assets/37-156-0e9017dd8c.png"
                alt="Grand wedding foyer with chandeliers and white floral installation"
                fallbackLabel="Royal Celebrations"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </div>

          {/* Right Wide Photo + Three Pillars + Lookbook CTA */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <div className="w-full aspect-[709/346] overflow-hidden bg-[#ebe7dc]">
              <motion.div
                style={{ y: weddingsWideY, scale: shouldReduceMotion ? 1 : 1.08 }}
                className="w-full h-full will-change-transform"
              >
                <ResilientImage
                  src="/assets/37-261-10d6523c50.png"
                  alt="Grand imperial wedding banquet ballroom"
                  fallbackLabel="Imperial Ballroom"
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5 border-t border-[#1f1b14]">
              {WEDDING_PILLARS.map((pillar) => (
                <div key={pillar.title}>
                  <h3 className="text-[10px] font-medium tracking-[1px] text-[#725b38] uppercase">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.65] text-[#252923]">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <button
                type="button"
                onClick={() => openEnquiry('Wedding Lookbook')}
                className="bg-gold-gradient text-[#f3f0e8] px-7 py-3.5 text-[12px] font-medium tracking-[0.5px] whitespace-nowrap cursor-pointer transition-opacity"
              >
                REQUEST WEDDING LOOKBOOK
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Arrival and Location */}
      <section
        ref={arrivalRef}
        id="arrival"
        aria-label="Arrival and location"
        className="relative z-30 isolate scroll-mt-16 w-full min-h-[660px] lg:min-h-[852px] flex items-center text-[#f3f0e8] overflow-hidden"
      >
        <motion.div
          style={{ y: arrivalImageY, scale: shouldReduceMotion ? 1 : 1.16 }}
          className="absolute inset-0 z-0 pointer-events-none will-change-transform"
        >
          <ResilientImage
            src="/assets/37-271-0443939831.png"
            alt="Soaring glass lobby atrium at Monarch Imperial"
            fallbackLabel="Arrival at Monarch Imperial"
            className="w-full h-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(270deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.58) 50%, rgba(0,0,0,0.7) 100%)',
            }}
          />
        </motion.div>

        <div className="relative z-10 w-full px-6 md:px-12 lg:px-[5.4vw] py-20">
          <div className="max-w-[460px]">
            <h2 className="font-display font-normal text-[#f3f0e8] text-[clamp(2.25rem,3vw,2.75rem)] leading-[1.2]">
              Arrival at
              <br />
              Monarch Imperial
            </h2>

            <p className="mt-5 text-[14px] leading-[1.7] text-[#f3f0e8]/95">
              Situated within an exclusive green enclave in Sri Jayawardenepura
              Kotte, adjacent to the diplomatic district and moments from central
              Colombo.
            </p>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Monarch Imperial location in Google Maps"
              className="group relative mt-6 block w-full aspect-[440/320] overflow-hidden border border-white/25 bg-[#f8f7f2] shadow-2xl"
            >
              <ResilientImage
                src="/assets/37-297-993fcd2a55.png"
                alt="Map showing Monarch Imperial in Sri Jayawardenepura Kotte"
                fallbackLabel="Sri Jayawardenepura Kotte Map"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute bottom-3 right-3 bg-[#252923]/90 text-[#f3f0e8] px-3 py-1.5 text-[11px] font-medium tracking-wide inline-flex items-center gap-1.5">
                <span>Open in Google Maps</span>
                <span aria-hidden="true">↗</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Section 7: Full-Width Dark Footer */}
      <footer
        id="footer"
        aria-label="Footer"
        className="relative z-30 w-full bg-[#060606] text-[#f3f0e8] px-6 md:px-12 lg:px-[5.4vw] pt-14 pb-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-[#9a9a9a]/35">
          <div>
            <h2 className="font-display font-normal text-[#f3f0e8] text-[clamp(2.25rem,3.4vw,3.25rem)] leading-[1.15]">
              Let’s make it
              <br />
              memorable.
            </h2>
            <p className="mt-4 text-[15px] text-[#ccd0c4]">
              A table, a celebration, a little time away. We’ll take care of the
              rest.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openEnquiry('General Enquiry')}
            className="bg-gold-gradient text-[#f3f0e8] px-6 py-3.5 text-[12px] font-medium whitespace-nowrap shrink-0 self-start md:self-auto cursor-pointer transition-opacity"
          >
            Make an enquiry
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          <div>
            <h3 className="text-[10px] font-medium tracking-[1.8px] text-[#e4cea0] uppercase mb-5">
              EXPLORE
            </h3>
            <ul className="space-y-2.5 text-[13px] text-[#f3f0e8]">
              <li>
                <a
                  href="#arrival"
                  onClick={(e) => handleAnchorClick(e, '#arrival')}
                  className="hover:text-[#e4cea0] transition-colors"
                >
                  Our story
                </a>
              </li>
              <li>
                <a
                  href="#dining"
                  onClick={(e) => handleAnchorClick(e, '#dining')}
                  className="hover:text-[#e4cea0] transition-colors"
                >
                  Dining
                </a>
              </li>
              <li>
                <a
                  href="#weddings"
                  onClick={(e) => handleAnchorClick(e, '#weddings')}
                  className="hover:text-[#e4cea0] transition-colors"
                >
                  Weddings &amp; celebrations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-medium tracking-[1.8px] text-[#e4cea0] uppercase mb-5">
              YOUR OCCASION
            </h3>
            <ul className="space-y-2.5 text-[13px] text-[#f3f0e8]">
              <li>
                <a
                  href="#events"
                  onClick={(e) => handleAnchorClick(e, '#events')}
                  className="hover:text-[#e4cea0] transition-colors"
                >
                  Meetings &amp; events
                </a>
              </li>
              <li>
                <a
                  href="#stay"
                  onClick={(e) => handleAnchorClick(e, '#stay')}
                  className="hover:text-[#e4cea0] transition-colors"
                >
                  Accommodation
                </a>
              </li>
              <li>
                <a
                  href="#experiences"
                  onClick={(e) => handleAnchorClick(e, '#experiences')}
                  className="hover:text-[#e4cea0] transition-colors"
                >
                  Curated experiences
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-medium tracking-[1.8px] text-[#e4cea0] uppercase mb-5">
              GET IN TOUCH
            </h3>
            <ul className="space-y-2.5 text-[13px] text-[#f3f0e8] break-words">
              <li>
                <a
                  href={CONTACT_PHONE_HREF}
                  className="hover:text-[#e4cea0] transition-colors tabular-nums"
                >
                  {CONTACT_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="hover:text-[#e4cea0] transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openEnquiry('General Enquiry')}
                  className="hover:text-[#e4cea0] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Contact our team</span>
                  <span aria-hidden="true">↗</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-medium tracking-[1.8px] text-[#e4cea0] uppercase mb-5">
              FOLLOW ALONG
            </h3>
            <ul className="space-y-2.5 text-[13px] text-[#f3f0e8]">
              <li>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#e4cea0] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Instagram</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#e4cea0] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Facebook</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Full-Width Gradient Wordmark */}
        <div className="w-full pt-4 pb-6 border-b border-[#9a9a9a]/35 overflow-hidden">
          <div className="font-display font-normal text-center w-full text-[clamp(1.75rem,7.2vw,8.5rem)] leading-[0.95] tracking-[0.08em] footer-wordmark-gradient whitespace-nowrap select-none">
            MONARCH IMPERIAL
          </div>
        </div>

        {/* Legal Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#ccd0c4]">
          <p>© 2026 Monarch Imperial. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setLegalDoc('privacy')}
              className="hover:text-[#f3f0e8] transition-colors cursor-pointer"
            >
              Privacy policy
            </button>
            <button
              type="button"
              onClick={() => setLegalDoc('terms')}
              className="hover:text-[#f3f0e8] transition-colors cursor-pointer"
            >
              Terms &amp; conditions
            </button>
          </div>
        </div>
      </footer>

      <EnquiryModal
        isOpen={enquiryOpen}
        initialCategory={enquiryCategory}
        onClose={() => setEnquiryOpen(false)}
      />

      <LegalModal docType={legalDoc} onClose={() => setLegalDoc(null)} />
    </div>
  );
}
