import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import UserLayout from '../../layouts/UserLayout';
import LotterySphere from '../../components/LotterySphere';
import DigitalNumberDisplay from '../../components/DigitalNumberDisplay';
import FireworksLayer from '../../components/FireworksLayer';
import { 
  Sparkles, Calendar, Users, Gift, Trophy, Clock,
  Award, PartyPopper
} from 'lucide-react';

const UserDraws = () => {
  // Draw States
  const [drawState, setDrawState] = useState('WAITING');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 15 });
  const [finalCountdown, setFinalCountdown] = useState(5);
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [displayNumber, setDisplayNumber] = useState('0000');
  const [selectedWinners, setSelectedWinners] = useState([]); // All winners selected at once
  const [isSphereStopped, setIsSphereStopped] = useState(false);
  
  const shuffleIntervalRef = useRef(null);
  const celebrationIntervalRef = useRef(null);

  // User Data
  const userData = {
    franchiseId: 'FRAN-001',
    teamId: 'TEAM-1',
    team: 'Team 1',
    groupId: 'GROUP-A',
    group: 'Group A',
    currentMonth: 5
  };

  // Upcoming Draw Data
  const upcomingDraw = {
    month: userData.currentMonth,
    team: userData.team,
    group: userData.group,
    drawDate: '2026-10-15',
    drawTime: '19:00',
    eligibleParticipants: 347,
    totalPrizes: 5
  };

  // ACTUAL PRIZE IMAGES - Using exact provided URLs
  const drawPrizes = [
    { 
      id: 1, 
      name: '43" LED TV', 
      image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/tv-entertainment-unit/x/e/c/38-185-particle-board-41-5-tu-pin-mf-bluewud-158-5-55-brown-original-imahg8fhg2eznabe.jpeg?q=70',
      winners: 1
    },
    { 
      id: 2, 
      name: 'Gold Coin 10g', 
      image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/coin/e/y/x/24-999-1-kjgc1g-kalamandir-original-imahna7xztcwxahn.jpeg?q=70',
      winners: 2
    },
    { 
      id: 3, 
      name: 'Washing Machine', 
      image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/washing-machine-new/o/a/k/-original-imahdgyf8fy4gjum.jpeg?q=70',
      winners: 1
    },
    { 
      id: 4, 
      name: 'Refrigerator', 
      image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/refrigerator-new/e/d/q/-resized-original-imahhubmkxhhaen8.jpeg?q=70',
      winners: 1
    }
  ];

  // Eligible Participants - expanded list
  const eligibleParticipants = [
    { memberId: '0001', name: 'Rajesh Kumar' },
    { memberId: '0024', name: 'Priya Sharma' },
    { memberId: '0047', name: 'Amit Patel' },
    { memberId: '0089', name: 'Sneha Reddy' },
    { memberId: '0132', name: 'Vikram Singh' },
    { memberId: '0156', name: 'Anita Desai' },
    { memberId: '0178', name: 'Karthik Raj' },
    { memberId: '0203', name: 'Divya Menon' },
    { memberId: '0247', name: 'Suresh Babu' },
    { memberId: '0281', name: 'Lakshmi Iyer' },
  ];

  // Past Draws
  const pastDraws = [
    { month: 4, date: '2026-09-10', status: 'Completed', participated: true },
    { month: 3, date: '2026-08-12', status: 'Completed', participated: true },
    { month: 2, date: '2026-07-15', status: 'Completed', participated: true }
  ];

  // Main Countdown Timer
  useEffect(() => {
    if (drawState !== 'WAITING') return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        const total = prev.days * 86400 + prev.hours * 3600 + prev.minutes * 60 + prev.seconds;
        
        if (total <= 0) {
          setDrawState('FINAL_COUNTDOWN');
          return prev;
        }
        
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        else if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        else if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        else if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        
        return prev;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [drawState]);

  // Final 5-Second Countdown
  useEffect(() => {
    if (drawState !== 'FINAL_COUNTDOWN') return;
    
    if (finalCountdown === 0) {
      // SELECT ALL WINNERS AT ONCE - BEFORE SHUFFLE
      selectAllWinners();
      setDrawState('SINGLE_SHUFFLE');
      return;
    }
    
    const timer = setTimeout(() => {
      setFinalCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [drawState, finalCountdown]);

  // Select ALL Winners at Once (before shuffle animation)
  const selectAllWinners = () => {
    const totalWinners = drawPrizes.reduce((sum, p) => sum + p.winners, 0);
    const winners = [];
    const availableParticipants = [...eligibleParticipants];
    
    for (let i = 0; i < totalWinners; i++) {
      if (availableParticipants.length === 0) break;
      
      // Determine which prize this winner gets
      let prizeIndex = 0;
      let count = 0;
      for (let j = 0; j < drawPrizes.length; j++) {
        count += drawPrizes[j].winners;
        if (i < count) {
          prizeIndex = j;
          break;
        }
      }
      
      const currentPrize = drawPrizes[prizeIndex];
      
      // Select random participant
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      const participant = availableParticipants[randomIndex];
      
      winners.push({
        ...participant,
        prize: currentPrize.name,
        prizeImage: currentPrize.image
      });
      
      // Remove from available pool
      availableParticipants.splice(randomIndex, 1);
    }
    
    setSelectedWinners(winners);
  };

  // ONE SINGLE Number Shuffling Animation
  useEffect(() => {
    if (drawState !== 'SINGLE_SHUFFLE' && drawState !== 'SHUFFLE_SLOWING') {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
      }
      return;
    }
    
    const speed = drawState === 'SINGLE_SHUFFLE' ? 60 : 200;
    
    shuffleIntervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
      setDisplayNumber(eligibleParticipants[randomIndex].memberId);
    }, speed);
    
    // Transition to slowing after 3 seconds
    if (drawState === 'SINGLE_SHUFFLE') {
      setTimeout(() => {
        setDrawState('SHUFFLE_SLOWING');
        
        // Lock and start winner reveals after slowing
        setTimeout(() => {
          lockShuffle();
        }, 3000);
      }, 3000);
    }
    
    return () => {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
      }
    };
  }, [drawState]);

  // Lock shuffle and show CONGRATULATIONS first
  const lockShuffle = () => {
    if (shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current);
    }
    
    if (selectedWinners.length > 0) {
      setDisplayNumber(selectedWinners[0].memberId);
    }
    
    setIsSphereStopped(true);
    setDrawState('ALL_WINNERS_LOCKED');
    
    // Show CONGRATULATIONS popup first (no winner details)
    setTimeout(() => {
      setDrawState('CONGRATULATIONS_POPUP');
      
      // Start fireworks for congratulations
      setTimeout(() => {
        triggerCelebration(0);
        startContinuousCelebration();
        
        // Stop congratulations and start revealing winners
        setTimeout(() => {
          stopContinuousCelebration();
          setCurrentWinnerIndex(0);
          revealNextWinner(0);
        }, 3000);
      }, 500);
    }, 2000);
  };

  // Reveal winners sequentially with CONGRATULATIONS before EACH winner
  const revealNextWinner = (winnerIndex) => {
    if (winnerIndex >= selectedWinners.length) {
      // All winners revealed, show final screen
      setDrawState('FINAL_WINNERS');
      
      setTimeout(() => {
        triggerFinalCelebration();
        
        setTimeout(() => {
          setDrawState('COMPLETED');
        }, 5000);
      }, 1000);
      
      return;
    }
    
    // Show CONGRATULATIONS before each winner
    setDrawState('CONGRATULATIONS_POPUP');
    setCurrentWinnerIndex(winnerIndex);
    
    // Start fireworks for congratulations
    setTimeout(() => {
      triggerCelebration(winnerIndex % 5);
      startContinuousCelebration();
      
      // After congratulations, show the winner
      setTimeout(() => {
        stopContinuousCelebration();
        setDrawState('WINNER_REVEAL');
        
        // Start winner celebration
        setTimeout(() => {
          triggerCelebration(winnerIndex % 5);
          startContinuousCelebration();
          setDrawState('WINNER_CELEBRATION');
          
          // Stop celebration and move to next winner
          setTimeout(() => {
            stopContinuousCelebration();
            setDrawState('TRANSITION');
            
            // Short pause before next winner
            setTimeout(() => {
              revealNextWinner(winnerIndex + 1);
            }, 500);
          }, 3500);
        }, 300);
      }, 2500);
    }, 500);
  };

  // Confetti Celebrations
  const triggerCelebration = (variant = 0) => {
    const colors = [
      ['#FBBF24', '#F472B6'],
      ['#60A5FA', '#22D3EE'],
      ['#A78BFA', '#FBBF24'],
      ['#F472B6', '#60A5FA'],
      ['#FBBF24', '#A78BFA']
    ];
    
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: colors[variant],
      zIndex: 10050
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors[variant],
        zIndex: 10050
      });
    }, 200);
    
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors[variant],
        zIndex: 10050
      });
    }, 350);
  };

  // Continuous celebration during winner announcement
  const startContinuousCelebration = () => {
    celebrationIntervalRef.current = setInterval(() => {
      confetti({
        particleCount: 25,
        spread: 65,
        origin: { x: Math.random(), y: Math.random() * 0.6 },
        colors: ['#FBBF24', '#F472B6', '#8B5CF6', '#60A5FA', '#22D3EE'],
        zIndex: 10050
      });
    }, 500);
  };

  const stopContinuousCelebration = () => {
    if (celebrationIntervalRef.current) {
      clearInterval(celebrationIntervalRef.current);
    }
  };

  const triggerFinalCelebration = () => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10050 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FBBF24', '#F472B6', '#8B5CF6']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#60A5FA', '#22D3EE', '#34D399']
      });
    }, 250);
  };

  // Cleanup on unmount and manage body class
  useEffect(() => {
    // Add/remove body class to prevent scrolling
    const isDrawActive = ['FINAL_COUNTDOWN', 'SINGLE_SHUFFLE', 'SHUFFLE_SLOWING', 'ALL_WINNERS_LOCKED', 'CONGRATULATIONS_POPUP', 'WINNER_REVEAL', 'WINNER_CELEBRATION', 'TRANSITION', 'FINAL_WINNERS'].includes(drawState);
    
    if (isDrawActive) {
      document.documentElement.classList.add('draw-active');
      document.body.classList.add('draw-active');
    } else {
      document.documentElement.classList.remove('draw-active');
      document.body.classList.remove('draw-active');
    }
  }, [drawState]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
      if (celebrationIntervalRef.current) clearInterval(celebrationIntervalRef.current);
      document.documentElement.classList.remove('draw-active');
      document.body.classList.remove('draw-active');
    };
  }, []);

  // Manual trigger for demo
  const startDrawNow = () => {
    setDrawState('FINAL_COUNTDOWN');
  };

  // Reset draw
  const resetDraw = () => {
    setDrawState('WAITING');
    setSelectedWinners([]);
    setCurrentWinnerIndex(0);
    setFinalCountdown(5);
    setIsSphereStopped(false);
    setDisplayNumber('0000');
    if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
    if (celebrationIntervalRef.current) clearInterval(celebrationIntervalRef.current);
  };

  // Check if draw is active (fullscreen overlay needed)
  const isDrawActive = ['FINAL_COUNTDOWN', 'SINGLE_SHUFFLE', 'SHUFFLE_SLOWING', 'ALL_WINNERS_LOCKED', 'CONGRATULATIONS_POPUP', 'WINNER_REVEAL', 'WINNER_CELEBRATION', 'TRANSITION', 'FINAL_WINNERS', 'COMPLETED'].includes(drawState);

  return (
    <>
      {/* Render WITHOUT UserLayout during active draw */}
      {!isDrawActive && (
        <UserLayout>
          {/* WAITING STATE - Upcoming Draw */}
      {drawState === 'WAITING' && (
        <div className="user-dashboard-bubbles-v2">
          <div className="user-bubble-v2 user-bubble-v2-1"></div>
          <div className="user-bubble-v2 user-bubble-v2-2"></div>
          <div className="user-bubble-v2 user-bubble-v2-3"></div>
          <div className="user-bubble-v2 user-bubble-v2-4"></div>
        </div>
      )}

      {drawState === 'WAITING' && (
        <div className="user-dashboard-compact">
          {/* Header */}
          <div className="user-draw-upcoming-header">
            <Sparkles className="user-draw-header-icon" />
            <div>
              <h1 className="user-draw-header-title">Upcoming Draw</h1>
              <p className="user-draw-header-subtitle">
                Month {upcomingDraw.month} • {upcomingDraw.team} • {upcomingDraw.group}
              </p>
            </div>
          </div>

          {/* Draw Info */}
          <div className="user-card-compact user-draw-info-card">
            <div className="user-draw-details-grid">
              <div className="user-draw-detail-item">
                <Calendar className="user-draw-detail-icon" />
                <div>
                  <span className="user-draw-detail-label">Draw Date</span>
                  <span className="user-draw-detail-value">
                    {new Date(upcomingDraw.drawDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="user-draw-detail-item">
                <Clock className="user-draw-detail-icon" />
                <div>
                  <span className="user-draw-detail-label">Draw Time</span>
                  <span className="user-draw-detail-value">
                    {new Date(`2000-01-01T${upcomingDraw.drawTime}`).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>

              <div className="user-draw-detail-item">
                <Users className="user-draw-detail-icon" />
                <div>
                  <span className="user-draw-detail-label">Participants</span>
                  <span className="user-draw-detail-value user-participant-count">
                    {upcomingDraw.eligibleParticipants}
                  </span>
                </div>
              </div>

              <div className="user-draw-detail-item">
                <Trophy className="user-draw-detail-icon" />
                <div>
                  <span className="user-draw-detail-label">Total Prizes</span>
                  <span className="user-draw-detail-value">{upcomingDraw.totalPrizes}</span>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="user-draw-countdown-section">
              <h3 className="user-draw-countdown-title">Draw Starts In</h3>
              <div className="user-countdown-compact">
                <div className="user-countdown-box">
                  <span className="user-countdown-num">{String(countdown.days).padStart(2, '0')}</span>
                  <span className="user-countdown-label">Days</span>
                </div>
                <div className="user-countdown-box">
                  <span className="user-countdown-num">{String(countdown.hours).padStart(2, '0')}</span>
                  <span className="user-countdown-label">Hours</span>
                </div>
                <div className="user-countdown-box">
                  <span className="user-countdown-num">{String(countdown.minutes).padStart(2, '0')}</span>
                  <span className="user-countdown-label">Min</span>
                </div>
                <div className="user-countdown-box">
                  <span className="user-countdown-num">{String(countdown.seconds).padStart(2, '0')}</span>
                  <span className="user-countdown-label">Sec</span>
                </div>
              </div>
            </div>

            <button onClick={startDrawNow} className="user-start-draw-demo-btn">
              Start Draw Now (Demo)
            </button>
          </div>

          {/* Prizes */}
          <div className="user-card-compact user-draw-prizes-card">
            <h3 className="user-section-title">Prizes for This Draw</h3>
            <div className="user-draw-prizes-grid">
              {drawPrizes.map((prize) => (
                <div key={prize.id} className="user-draw-prize-item">
                  <div className="user-draw-prize-image-wrapper">
                    <img src={prize.image} alt={prize.name} className="user-draw-prize-image" />
                  </div>
                  <h4 className="user-draw-prize-name">{prize.name}</h4>
                  <p className="user-draw-prize-winners">{prize.winners} Winner{prize.winners > 1 ? 's' : ''}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Past Draws */}
          <div className="user-card-compact">
            <h3 className="user-section-title">Past Draws</h3>
            <div className="user-past-draws-list">
              {pastDraws.map((draw) => (
                <div key={draw.month} className="user-past-draw-item">
                  <div className="user-past-draw-icon-wrapper">
                    <Calendar className="user-past-draw-icon" />
                  </div>
                  <div className="user-past-draw-details">
                    <span className="user-past-draw-title">Month {draw.month} Draw</span>
                    <span className="user-past-draw-date">
                      {new Date(draw.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <span className="user-past-draw-status">{draw.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FINAL COUNTDOWN STATE */}
      {drawState === 'FINAL_COUNTDOWN' && finalCountdown > 0 && (
        <div className="live-draw-overlay-cinematic">
          <div className="cinematic-countdown-container">
            <motion.div
              key={finalCountdown}
              className="cinematic-countdown-number"
              initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {finalCountdown}
            </motion.div>
            
            <div className="countdown-rings-cinematic">
              <div className="countdown-ring-cinematic"></div>
              <div className="countdown-ring-cinematic"></div>
              <div className="countdown-ring-cinematic"></div>
            </div>
          </div>
        </div>
      )}

      {/* SHUFFLING / SLOWING / WINNER_LOCKED STATES */}
      {(drawState === 'SINGLE_SHUFFLE' || drawState === 'SHUFFLE_SLOWING' || drawState === 'ALL_WINNERS_LOCKED') && (
        <div className="live-draw-overlay-cinematic">
          <div className="cinematic-draw-stage">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="cinematic-header"
            >
              <h2 className="cinematic-title">MILLANCE</h2>
              <h1 className="cinematic-live-title">LIVE DRAW</h1>
              <p className="cinematic-subtitle">
                {drawState === 'ALL_WINNERS_LOCKED' ? 'WINNERS SELECTED!' : 'SELECTING WINNERS...'}
              </p>
            </motion.div>

            <div className="cinematic-prize-badge">
              Selecting {drawPrizes.reduce((sum, p) => sum + p.winners, 0)} Winners
            </div>

            {/* 3D Lottery Sphere */}
            <div className="lottery-sphere-wrapper">
              <LotterySphere isAnimating={!isSphereStopped} />
            </div>

            {/* Digital Number Display */}
            <DigitalNumberDisplay 
              number={displayNumber} 
              isAnimating={drawState === 'SINGLE_SHUFFLE' || drawState === 'SHUFFLE_SLOWING'}
            />
          </div>
        </div>
      )}

      {/* CONGRATULATIONS POPUP - After shuffle, before individual winners */}
      {drawState === 'CONGRATULATIONS_POPUP' && (
        <div className="live-draw-overlay-cinematic">
          {/* Fireworks during congratulations */}
          <FireworksLayer isActive={true} />
          
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="congratulations-popup-center"
          >
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.8, times: [0, 0.6, 1] }}
              className="congratulations-popup-title"
            >
              CONGRATULATIONS!
            </motion.h1>
          </motion.div>
        </div>
      )}

      {/* WINNER REVEAL & CELEBRATION */}
      {(drawState === 'WINNER_REVEAL' || drawState === 'WINNER_CELEBRATION') && selectedWinners[currentWinnerIndex] && (
        <div className="live-draw-overlay-cinematic">
          {/* Fireworks ONLY during WINNER_CELEBRATION state */}
          {drawState === 'WINNER_CELEBRATION' && <FireworksLayer isActive={true} />}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="winner-reveal-stage"
          >
            <motion.h2
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="winner-reveal-title"
            >
              CONGRATULATIONS!
            </motion.h2>
            
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="winner-card-cinematic"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="winner-trophy-icon"
              >
                <Award />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="winner-number-badge"
              >
                WINNER {currentWinnerIndex + 1}
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="winner-name-cinematic"
              >
                {selectedWinners[currentWinnerIndex].name}
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="winner-id-cinematic"
              >
                MEMBER ID: {selectedWinners[currentWinnerIndex].memberId}
              </motion.p>
              
              <div className="winner-prize-display">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="winner-prize-image-cinematic"
                >
                  <img 
                    src={selectedWinners[currentWinnerIndex].prizeImage} 
                    alt={selectedWinners[currentWinnerIndex].prize}
                  />
                </motion.div>
                
                <motion.h4
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="winner-prize-name-cinematic"
                >
                  {selectedWinners[currentWinnerIndex].prize}
                </motion.h4>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}

      {/* FINAL WINNERS & COMPLETED */}
      {(drawState === 'FINAL_WINNERS' || drawState === 'COMPLETED') && (
        <div className="live-draw-overlay-cinematic">
          <div className="final-winners-stage">
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="final-winners-header-cinematic"
            >
              <PartyPopper size={60} className="final-trophy-icon" />
              <h2 className="final-winners-title-cinematic">CONGRATULATIONS</h2>
              <h3 className="final-winners-subtitle">TO ALL WINNERS!</h3>
              <p className="final-draw-info">Millance Lucky Draw • Month {upcomingDraw.month}</p>
            </motion.div>
            
            <div className="final-winners-grid-cinematic">
              {selectedWinners.map((winner, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="final-winner-card-cinematic"
                >
                  <div className="final-winner-badge">#{index + 1}</div>
                  <div className="final-winner-info">
                    <h4>{winner.name}</h4>
                    <p>{winner.memberId}</p>
                  </div>
                  <div className="final-winner-prize-img">
                    <img src={winner.prizeImage} alt={winner.prize} />
                  </div>
                  <p className="final-winner-prize-label">{winner.prize}</p>
                </motion.div>
              ))}
            </div>
            
            {drawState === 'COMPLETED' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={resetDraw}
                className="close-draw-btn-cinematic"
              >
                Close
              </motion.button>
            )}
          </div>
        </div>
      )}
        </UserLayout>
      )}

      {/* ACTIVE DRAW STATES - FULLSCREEN WITHOUT LAYOUT */}
      {isDrawActive && (
        <>
          {/* FINAL COUNTDOWN STATE */}
          {drawState === 'FINAL_COUNTDOWN' && finalCountdown > 0 && (
            <div className="live-draw-overlay-cinematic">
              <div className="cinematic-countdown-container">
                <motion.div
                  key={finalCountdown}
                  className="cinematic-countdown-number"
                  initial={{ scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  {finalCountdown}
                </motion.div>
                
                <div className="countdown-rings-cinematic">
                  <div className="countdown-ring-cinematic"></div>
                  <div className="countdown-ring-cinematic"></div>
                  <div className="countdown-ring-cinematic"></div>
                </div>
              </div>
            </div>
          )}

          {/* SHUFFLING / SLOWING / WINNER_LOCKED STATES - CLEAN MINIMAL */}
          {(drawState === 'SINGLE_SHUFFLE' || drawState === 'SHUFFLE_SLOWING' || drawState === 'ALL_WINNERS_LOCKED') && (
            <div className="live-draw-overlay-cinematic">
              <div className="cinematic-draw-stage">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="cinematic-header"
                >
                  <h2 className="cinematic-title">MILLANCE</h2>
                  <h1 className="cinematic-live-title">LIVE DRAW</h1>
                  <p className="cinematic-subtitle">
                    {drawState === 'ALL_WINNERS_LOCKED' ? 'WINNERS SELECTED!' : 'SELECTING WINNERS...'}
                  </p>
                </motion.div>

                <div className="cinematic-prize-badge">
                  Selecting {drawPrizes.reduce((sum, p) => sum + p.winners, 0)} Winners
                </div>

                {/* ONLY Digital Number Display - NO LOTTERY MACHINE */}
                <DigitalNumberDisplay 
                  number={displayNumber} 
                  isAnimating={drawState === 'SINGLE_SHUFFLE' || drawState === 'SHUFFLE_SLOWING'}
                />
              </div>
            </div>
          )}

          {/* CONGRATULATIONS POPUP - After shuffle, before individual winners */}
          {drawState === 'CONGRATULATIONS_POPUP' && (
            <div className="live-draw-overlay-cinematic">
              {/* Fireworks during congratulations */}
              <FireworksLayer isActive={true} />
              
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="congratulations-popup-center"
              >
                <motion.h1
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.1, 1] }}
                  transition={{ duration: 0.8, times: [0, 0.6, 1] }}
                  className="congratulations-popup-title"
                >
                  CONGRATULATIONS!
                </motion.h1>
              </motion.div>
            </div>
          )}

          {/* WINNER REVEAL & CELEBRATION */}
          {(drawState === 'WINNER_REVEAL' || drawState === 'WINNER_CELEBRATION') && selectedWinners[currentWinnerIndex] && (
            <div className="live-draw-overlay-cinematic">
              {/* Fireworks ONLY during WINNER_CELEBRATION state */}
              {drawState === 'WINNER_CELEBRATION' && <FireworksLayer isActive={true} />}
              
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="winner-reveal-stage"
              >
                <motion.h2
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="winner-reveal-title"
                >
                  CONGRATULATIONS!
                </motion.h2>
                
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="winner-card-cinematic"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="winner-trophy-icon"
                  >
                    <Award />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="winner-number-badge"
                  >
                    WINNER {currentWinnerIndex + 1}
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="winner-name-cinematic"
                  >
                    {selectedWinners[currentWinnerIndex].name}
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="winner-id-cinematic"
                  >
                    MEMBER ID: {selectedWinners[currentWinnerIndex].memberId}
                  </motion.p>
                  
                  <div className="winner-prize-display">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7, type: 'spring' }}
                      className="winner-prize-image-cinematic"
                    >
                      <img 
                        src={selectedWinners[currentWinnerIndex].prizeImage} 
                        alt={selectedWinners[currentWinnerIndex].prize}
                      />
                    </motion.div>
                    
                    <motion.h4
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="winner-prize-name-cinematic"
                    >
                      {selectedWinners[currentWinnerIndex].prize}
                    </motion.h4>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}

          {/* FINAL WINNERS & COMPLETED */}
          {(drawState === 'FINAL_WINNERS' || drawState === 'COMPLETED') && (
            <div className="live-draw-overlay-cinematic">
              <div className="final-winners-stage">
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="final-winners-header-cinematic"
                >
                  <PartyPopper size={60} className="final-trophy-icon" />
                  <h2 className="final-winners-title-cinematic">CONGRATULATIONS</h2>
                  <h3 className="final-winners-subtitle">TO ALL WINNERS!</h3>
                  <p className="final-draw-info">Millance Lucky Draw • Month {upcomingDraw.month}</p>
                </motion.div>
                
                <div className="final-winners-carousel-wrapper">
                  <div className="final-winners-grid-cinematic">
                    {/* Original winners */}
                    {selectedWinners.map((winner, index) => (
                      <motion.div
                        key={`winner-${index}`}
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="final-winner-card-cinematic"
                      >
                        <div className="final-winner-badge">#{index + 1}</div>
                        <div className="final-winner-info">
                          <h4>{winner.name}</h4>
                          <p>{winner.memberId}</p>
                        </div>
                        <div className="final-winner-prize-img">
                          <img src={winner.prizeImage} alt={winner.prize} />
                        </div>
                        <p className="final-winner-prize-label">{winner.prize}</p>
                      </motion.div>
                    ))}
                    
                    {/* Duplicate for seamless loop */}
                    {selectedWinners.map((winner, index) => (
                      <div
                        key={`winner-duplicate-${index}`}
                        className="final-winner-card-cinematic"
                      >
                        <div className="final-winner-badge">#{index + 1}</div>
                        <div className="final-winner-info">
                          <h4>{winner.name}</h4>
                          <p>{winner.memberId}</p>
                        </div>
                        <div className="final-winner-prize-img">
                          <img src={winner.prizeImage} alt={winner.prize} />
                        </div>
                        <p className="final-winner-prize-label">{winner.prize}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {drawState === 'COMPLETED' && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    onClick={resetDraw}
                    className="close-draw-btn-cinematic"
                  >
                    Close
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserDraws;
