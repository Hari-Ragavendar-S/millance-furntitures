import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LotterySphere from '../LotterySphere';
import DigitalNumberDisplay from '../DigitalNumberDisplay';
import FireworksLayer from '../FireworksLayer';
import { 
  Sparkles, Calendar, Users, Gift, Trophy, Clock,
  Award, PartyPopper
} from 'lucide-react';

const Draw = () => {
  const { user } = useAuth();
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, []);
  
  // Draw States
  const [drawState, setDrawState] = useState('WAITING');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [finalCountdown, setFinalCountdown] = useState(5);
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [displayNumber, setDisplayNumber] = useState('0000');
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [isSphereStopped, setIsSphereStopped] = useState(false);
  
  // Backend Data
  const [drawStatus, setDrawStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveDrawData, setLiveDrawData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  
  const shuffleIntervalRef = useRef(null);
  const celebrationIntervalRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Polling for live draw detection
  useEffect(() => {
    loadDrawData();
    
    // Poll every 5 seconds to detect live draws
    pollingIntervalRef.current = setInterval(() => {
      checkForLiveDraw();
    }, 5000);
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const loadDrawData = async () => {
    try {
      const [drawData, enrollmentsData] = await Promise.all([
        api.getUserDrawStatus(),
        api.getMyEnrollments()
      ]);
      
      setDrawStatus(drawData);
      setEnrollments(enrollmentsData);
      
      // Check if there's a live draw
      if (drawData?.live_draw && drawState === 'WAITING') {
        console.log('🔴 LIVE DRAW DETECTED! Starting animation...');
        startLiveDrawAnimation(drawData.live_draw);
      }
    } catch (error) {
      console.error('Failed to load draw data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForLiveDraw = async () => {
    try {
      const data = await api.getUserDrawStatus();
      setDrawStatus(data);
      
      // If live draw detected and we're in WAITING state (even if user won previously), start animation
      // This allows users who won in one group to still see draws for their other active groups
      if (data?.live_draw && (drawState === 'WAITING' || drawState === 'COMPLETED')) {
        console.log('🔴 LIVE DRAW DETECTED via polling! Starting animation...');
        console.log('Live draw data:', data.live_draw);
        startLiveDrawAnimation(data.live_draw);
      }
      
      // If draw completed (no more live_draw but we're still in animation), fetch the winner
      // This happens when the 100-second timer completes and status changes to "completed"
      if (!data?.live_draw && (drawState === 'SHUFFLE_SLOWING' || drawState === 'SINGLE_SHUFFLE' || drawState === 'ALL_WINNERS_LOCKED')) {
        console.log('✅ Draw completed! Live draw ended, fetching winner...');
        fetchDrawWinner(data);
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  const startLiveDrawAnimation = (liveDrawInfo) => {
    console.log('🎬 Starting live draw animation for draw ID:', liveDrawInfo.draw_id);
    setLiveDrawData(liveDrawInfo);
    
    // Stop polling while animation is running
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Start the animation sequence
    setDrawState('FINAL_COUNTDOWN');
    setFinalCountdown(10);
  };

  const fetchDrawWinner = async (data) => {
    try {
      console.log('📊 Fetching winner from draw status data:', data);
      
      // Get the latest draw results - check if there are any new results
      const latestResult = data.my_results?.[0];
      
      if (latestResult && latestResult.winner_name) {
        console.log('🏆 Found winner data:', latestResult);
        
        const winner = {
          memberId: latestResult.winner_mld_id,
          name: latestResult.winner_name,
          prize: latestResult.prize_name,
          amount: latestResult.prize_amount,
          isMe: latestResult.is_me
        };
        
        console.log('🎯 Winner object created:', winner);
        setSelectedWinners([winner]);
        
        // Move to winner locked state
        setDrawState('ALL_WINNERS_LOCKED');
      } else {
        console.log('⚠️ No winner data found yet, will retry on next poll');
      }
    } catch (error) {
      console.error('Failed to fetch winner:', error);
    }
  };

  // Prepare data from backend
  const nextDraw = drawStatus?.next_draw || null;
  const enrollmentStatus = drawStatus?.enrollment_status || null;
  const hasWon = enrollmentStatus?.has_won || false;
  const hasActivePlan = nextDraw !== null;
  
  // Calculate next month 10th date dynamically if not scheduled
  const getNextMonth10th = () => {
    const today = new Date();
    let targetMonth = today.getMonth() + 1; // ALWAYS next month
    let targetYear = today.getFullYear();
    
    // If next month goes to next year
    if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }
    
    const nextMonth10th = new Date(targetYear, targetMonth, 10);
    return nextMonth10th.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };
  
  const upcomingDraw = {
    month: enrollmentStatus?.months_paid + 1 || 1,
    drawDate: nextDraw?.draw_date || getNextMonth10th(),
    drawTime: nextDraw?.draw_time || '19:00',
    eligibleParticipants: nextDraw?.eligible_users_count || 0,
    totalPrizes: 5, // Could come from backend
    isScheduled: nextDraw !== null
  };

  // Use REAL prizes from backend when draw is LIVE
  const drawPrizes = useMemo(() => {
    // If there's a live draw with real prizes, use them
    if (drawStatus?.live_draw?.prizes && drawStatus.live_draw.prizes.length > 0) {
      return drawStatus.live_draw.prizes.map((p, idx) => ({
        id: idx + 1,
        name: p.name,
        amount: p.amount,
        image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/tv-entertainment-unit/x/e/c/38-185-particle-board-41-5-tu-pin-mf-bluewud-158-5-55-brown-original-imahg8fhg2eznabe.jpeg?q=70',
        winners: 1
      }));
    }
    
    // Fallback: use mock prizes if no live draw
    return [
      { 
        id: 1, 
        name: nextDraw?.prize_name || 'Premium Prize',
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
  }, [drawStatus, nextDraw]);

  // Use REAL eligible participants from backend when draw is LIVE
  const eligibleParticipants = useMemo(() => {
    // If there's a live draw with real users, use them
    if (drawStatus?.live_draw?.eligible_users && drawStatus.live_draw.eligible_users.length > 0) {
      return drawStatus.live_draw.eligible_users.map(u => ({
        memberId: u.mld_id,
        name: u.full_name
      }));
    }
    
    // Fallback: use current user + mock data if no live draw
    return [
      { memberId: user?.mld_id || '0000', name: user?.full_name || 'You' },
      { memberId: '0024', name: 'Priya Sharma' },
      { memberId: '0047', name: 'Amit Patel' },
      { memberId: '0089', name: 'Sneha Reddy' },
      { memberId: '0132', name: 'Vikram Singh' },
    ];
  }, [drawStatus, user]);

  const pastDraws = drawStatus?.my_results?.map(r => ({
    month: r.month,
    date: r.draw_date || '2026-01-01',
    status: r.status === 'won' ? 'Won' : 'Completed',
    participated: true
  })) || [];

  // Main Countdown Timer
  useEffect(() => {
    if (drawState !== 'WAITING' || !upcomingDraw.drawDate) return;
    
    const timer = setInterval(() => {
      const drawDateTime = new Date(`${upcomingDraw.drawDate}T${upcomingDraw.drawTime}:00`);
      const now = new Date();
      const diff = drawDateTime - now;

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [drawState, upcomingDraw.drawDate, upcomingDraw.drawTime]);

  // Final 5-Second Countdown
  useEffect(() => {
    if (drawState !== 'FINAL_COUNTDOWN') return;
    
    if (finalCountdown === 0) {
      selectAllWinners();
      setDrawState('SINGLE_SHUFFLE');
      return;
    }
    
    const timer = setTimeout(() => {
      setFinalCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [drawState, finalCountdown]);

  // Select ALL Winners at Once
  const selectAllWinners = () => {
    const totalWinners = drawPrizes.reduce((sum, p) => sum + p.winners, 0);
    const winners = [];
    const availableParticipants = [...eligibleParticipants];
    
    for (let i = 0; i < totalWinners; i++) {
      if (availableParticipants.length === 0) break;
      
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
      const randomIndex = Math.floor(Math.random() * availableParticipants.length);
      const participant = availableParticipants[randomIndex];
      
      winners.push({
        ...participant,
        prize: currentPrize.name,
        prizeImage: currentPrize.image
      });
      
      availableParticipants.splice(randomIndex, 1);
    }
    
    setSelectedWinners(winners);
  };

  // Number Shuffling Animation
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
    
    if (drawState === 'SINGLE_SHUFFLE') {
      setTimeout(() => {
        setDrawState('SHUFFLE_SLOWING');
        
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

  // Lock shuffle and show CONGRATULATIONS
  const lockShuffle = () => {
    if (shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current);
    }
    
    if (selectedWinners.length > 0) {
      setDisplayNumber(selectedWinners[0].memberId);
    }
    
    setIsSphereStopped(true);
    setDrawState('ALL_WINNERS_LOCKED');
    
    setTimeout(() => {
      setDrawState('CONGRATULATIONS_POPUP');
      
      setTimeout(() => {
        triggerCelebration(0);
        startContinuousCelebration();
        
        setTimeout(() => {
          stopContinuousCelebration();
          setCurrentWinnerIndex(0);
          revealNextWinner(0);
        }, 3000);
      }, 500);
    }, 2000);
  };

  // Reveal winners sequentially
  const revealNextWinner = (winnerIndex) => {
    if (winnerIndex >= selectedWinners.length) {
      setDrawState('FINAL_WINNERS');
      
      setTimeout(() => {
        triggerFinalCelebration();
        
        setTimeout(() => {
          setDrawState('COMPLETED');
        }, 5000);
      }, 1000);
      
      return;
    }
    
    setDrawState('CONGRATULATIONS_POPUP');
    setCurrentWinnerIndex(winnerIndex);
    
    setTimeout(() => {
      triggerCelebration(winnerIndex % 5);
      startContinuousCelebration();
      
      setTimeout(() => {
        stopContinuousCelebration();
        setDrawState('WINNER_REVEAL');
        
        setTimeout(() => {
          triggerCelebration(winnerIndex % 5);
          startContinuousCelebration();
          setDrawState('WINNER_CELEBRATION');
          
          setTimeout(() => {
            stopContinuousCelebration();
            setDrawState('TRANSITION');
            
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

  // Manage body class
  useEffect(() => {
    const isDrawActive = ['FINAL_COUNTDOWN', 'SINGLE_SHUFFLE', 'SHUFFLE_SLOWING', 'ALL_WINNERS_LOCKED', 'CONGRATULATIONS_POPUP', 'WINNER_REVEAL', 'WINNER_CELEBRATION', 'TRANSITION', 'FINAL_WINNERS'].includes(drawState);
    
    if (isDrawActive) {
      document.documentElement.classList.add('draw-active');
      document.body.classList.add('draw-active');
    } else {
      document.documentElement.classList.remove('draw-active');
      document.body.classList.remove('draw-active');
    }
  }, [drawState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
      if (celebrationIntervalRef.current) clearInterval(celebrationIntervalRef.current);
      document.documentElement.classList.remove('draw-active');
      document.body.classList.remove('draw-active');
    };
  }, []);

  // Demo trigger
  const startDrawNow = () => {
    setDrawState('FINAL_COUNTDOWN');
    setFinalCountdown(5);
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

  const isDrawActive = ['FINAL_COUNTDOWN', 'SINGLE_SHUFFLE', 'SHUFFLE_SLOWING', 'ALL_WINNERS_LOCKED', 'CONGRATULATIONS_POPUP', 'WINNER_REVEAL', 'WINNER_CELEBRATION', 'TRANSITION', 'FINAL_WINNERS', 'COMPLETED'].includes(drawState);

  if (loading) {
    return (
      <div className="user-dashboard-compact">
        <div className="loading-container" style={{ padding: '60px', textAlign: 'center' }}>
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', color: '#666' }}>Loading draw information...</p>
        </div>
      </div>
    );
  }

  // If user has WON - Show Congratulations (but still check for live draws)
  if (hasWon && drawState === 'WAITING') {
    return (
      <>
        {/* LIVE DRAW BANNER - Show if any active group has live draw */}
        {drawStatus?.live_draw && (
          <div 
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10001,
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              padding: '16px 24px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.6)',
              animation: 'pulse 2s ease-in-out infinite',
              maxWidth: '90vw'
            }}
          >
            <Sparkles 
              style={{ 
                width: '32px', 
                height: '32px', 
                color: 'white',
                animation: 'spin 2s linear infinite'
              }} 
            />
            <div style={{ color: 'white' }}>
              <div style={{ fontWeight: '700', fontSize: '16px' }}>
                🔴 LIVE DRAW HAPPENING NOW!
              </div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>
                Group {drawStatus.live_draw.group_id} - Month {drawStatus.live_draw.month_number}
              </div>
            </div>
          </div>
        )}

        <div className="user-dashboard-bubbles-v2">
          <div className="user-bubble-v2 user-bubble-v2-1"></div>
          <div className="user-bubble-v2 user-bubble-v2-2"></div>
          <div className="user-bubble-v2 user-bubble-v2-3"></div>
          <div className="user-bubble-v2 user-bubble-v2-4"></div>
        </div>

        <div className="user-dashboard-compact">
          {/* PRIORITY: Next Draw Countdown Card - Show at TOP even if user has won */}
          <div style={{
            background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 35%, #3B82F6 65%, #FBBF24 100%)',
            borderRadius: 'clamp(16px, 4vw, 20px)',
            padding: 'clamp(20px, 5vw, 28px)',
            marginBottom: 'clamp(16px, 4vw, 20px)',
            boxShadow: '0 8px 32px rgba(236, 72, 153, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            {/* Animated background sparkles */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 2px, transparent 2px)',
              backgroundSize: '40px 40px',
              opacity: 0.4,
              animation: 'float 15s linear infinite'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Icon and Title */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(8px, 2vw, 12px)',
                marginBottom: 'clamp(12px, 3vw, 16px)'
              }}>
                <Sparkles style={{ 
                  width: 'clamp(28px, 7vw, 36px)', 
                  height: 'clamp(28px, 7vw, 36px)', 
                  color: 'white',
                  animation: 'spin 4s linear infinite'
                }} />
                <h2 style={{
                  fontSize: 'clamp(20px, 5.5vw, 26px)',
                  fontWeight: '800',
                  color: 'white',
                  margin: 0,
                  textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  textAlign: 'center'
                }}>
                  Next Draw Live
                </h2>
              </div>

              {/* Draw Date & Time */}
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 'clamp(12px, 3vw, 14px)',
                padding: 'clamp(12px, 3vw, 16px)',
                marginBottom: 'clamp(16px, 4vw, 20px)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: 'clamp(13px, 3.5vw, 14px)',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: 'clamp(4px, 1vw, 6px)',
                  fontWeight: '600'
                }}>
                  📅 Draw Date & Time
                </div>
                <div style={{
                  fontSize: 'clamp(18px, 5vw, 22px)',
                  fontWeight: '700',
                  color: 'white',
                  wordBreak: 'break-word',
                  lineHeight: '1.3'
                }}>
                  {new Date(upcomingDraw.drawDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                <div style={{
                  fontSize: 'clamp(16px, 4.5vw, 20px)',
                  fontWeight: '700',
                  color: '#FBBF24',
                  marginTop: 'clamp(4px, 1vw, 6px)'
                }}>
                  🕐 {new Date(`2000-01-01T${upcomingDraw.drawTime}`).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>

              {/* Countdown Timer */}
              <div style={{
                textAlign: 'center',
                marginBottom: 'clamp(12px, 3vw, 16px)'
              }}>
                <div style={{
                  fontSize: 'clamp(14px, 3.8vw, 16px)',
                  color: 'white',
                  fontWeight: '600',
                  marginBottom: 'clamp(10px, 2.5vw, 12px)',
                  opacity: 0.95
                }}>
                  ⏰ Draw Starts In
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 'clamp(8px, 2vw, 12px)',
                  maxWidth: '100%'
                }}>
                  {[
                    { value: countdown.days, label: 'Days' },
                    { value: countdown.hours, label: 'Hours' },
                    { value: countdown.minutes, label: 'Min' },
                    { value: countdown.seconds, label: 'Sec' }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255,255,255,0.25)',
                      borderRadius: 'clamp(10px, 2.5vw, 12px)',
                      padding: 'clamp(10px, 2.5vw, 12px) clamp(6px, 1.5vw, 8px)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(255,255,255,0.3)',
                      minWidth: 0
                    }}>
                      <div style={{
                        fontSize: 'clamp(24px, 7vw, 32px)',
                        fontWeight: '800',
                        color: 'white',
                        lineHeight: '1',
                        marginBottom: 'clamp(4px, 1vw, 6px)',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        wordBreak: 'normal'
                      }}>
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div style={{
                        fontSize: 'clamp(10px, 2.8vw, 12px)',
                        color: 'rgba(255,255,255,0.9)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        wordBreak: 'normal'
                      }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'clamp(8px, 2vw, 10px)'
              }}>
                <div style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 'clamp(8px, 2vw, 10px)',
                  padding: 'clamp(8px, 2vw, 10px)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  minWidth: 0
                }}>
                  <div style={{
                    fontSize: 'clamp(10px, 2.8vw, 11px)',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '2px',
                    fontWeight: '600'
                  }}>
                    Participants
                  </div>
                  <div style={{
                    fontSize: 'clamp(16px, 4.5vw, 20px)',
                    fontWeight: '700',
                    color: 'white'
                  }}>
                    {upcomingDraw.eligibleParticipants}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 'clamp(8px, 2vw, 10px)',
                  padding: 'clamp(8px, 2vw, 10px)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  minWidth: 0
                }}>
                  <div style={{
                    fontSize: 'clamp(10px, 2.8vw, 11px)',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '2px',
                    fontWeight: '600'
                  }}>
                    Total Prizes
                  </div>
                  <div style={{
                    fontSize: 'clamp(16px, 4.5vw, 20px)',
                    fontWeight: '700',
                    color: 'white'
                  }}>
                    {upcomingDraw.totalPrizes}
                  </div>
                </div>
              </div>
            </div>

            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
              }
            `}</style>
          </div>

          {/* Show ALL Active Plans FIRST - PRIME LOCATION AT TOP */}
          {enrollments && enrollments.filter(e => e.status === 'active').length > 0 && (
            <div style={{
              marginTop: '24px',
              padding: '24px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 6px 20px rgba(139, 92, 246, 0.3)',
              border: '3px solid #8B5CF6'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                marginBottom: '8px',
                color: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Calendar style={{ width: '24px', height: '24px', color: '#8B5CF6' }} />
                Your Active Plans - Next Draws
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#666',
                marginBottom: '16px'
              }}>
                Track upcoming draws and increase your winning chances!
              </p>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
              }}>
                {enrollments.filter(e => e.status === 'active').map((enrollment) => {
                  const hasScheduledDraw = drawStatus?.all_scheduled_draws?.find(
                    d => d.group_id === enrollment.group_id
                  );
                  
                  return (
                    <div 
                      key={enrollment.id}
                      style={{
                        padding: '16px',
                        background: hasScheduledDraw 
                          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(96, 165, 250, 0.1))'
                          : 'linear-gradient(135deg, #F9FAFB, #F3F4F6)',
                        borderRadius: '12px',
                        border: hasScheduledDraw ? '2px solid #3B82F6' : '1px solid #E5E7EB'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '4px',
                            flexWrap: 'wrap'
                          }}>
                            <div style={{ fontWeight: '700', color: '#1a1a1a', fontSize: hasScheduledDraw ? '16px' : '14px' }}>
                              Group {enrollment.group_id}
                            </div>
                            <div style={{
                              padding: '2px 8px',
                              background: 'linear-gradient(135deg, #10B981, #059669)',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '600'
                            }}>
                              ACTIVE
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', color: '#666', marginBottom: hasScheduledDraw ? '8px' : '4px' }}>
                            Month {enrollment.months_paid + 1} • {enrollment.months_paid}/{enrollment.plan_duration || 11} paid
                          </div>
                          {hasScheduledDraw ? (
                            <div style={{
                              fontSize: '14px',
                              color: '#3B82F6',
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 12px',
                              background: 'white',
                              borderRadius: '8px'
                            }}>
                              <Calendar style={{ width: '16px', height: '16px' }} />
                              Next Draw: {new Date(hasScheduledDraw.draw_date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })} at {hasScheduledDraw.draw_time}
                            </div>
                          ) : (
                            <div style={{
                              fontSize: '12px',
                              color: '#F59E0B',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '4px'
                            }}>
                              <Clock style={{ width: '12px', height: '12px' }} />
                              Draw not scheduled yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Summary */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <div style={{
                  fontSize: '13px',
                  color: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Sparkles style={{ width: '14px', height: '14px', color: '#8B5CF6' }} />
                  <span>You have {enrollments.filter(e => e.status === 'active').length} active group{enrollments.filter(e => e.status === 'active').length > 1 ? 's' : ''} participating in upcoming draws!</span>
                </div>
              </div>
            </div>
          )}

          {/* CONGRATULATIONS MESSAGE - Show Below Active Plans */}
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            borderRadius: '20px',
            color: 'white',
            marginTop: '24px'
          }}>
            <Trophy style={{ width: '60px', height: '60px', margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>
              🎉 Congratulations!
            </h2>
            <p style={{ fontSize: '16px', margin: '0 0 6px', opacity: 0.95 }}>
              You Won: {enrollmentStatus.prize_name}
            </p>
            <p style={{ fontSize: '14px', margin: '0 0 16px', opacity: 0.9 }}>
              Won in Month {enrollmentStatus.prize_won_month || 'N/A'}
            </p>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '20px',
              fontWeight: '700'
            }}>
              Prize Amount: ₹{enrollmentStatus.prize_amount?.toLocaleString()}
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            padding: '24px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#666', fontSize: '15px', margin: '0 0 16px' }}>
              Want to increase your chances of winning again?
            </p>
            <button
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #F472B6, #EC4899)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onClick={() => {
                window.location.hash = '#home';
                window.location.reload();
              }}
            >
              Explore More Plans
            </button>
          </div>
        </div>
      </>
    );
  }

  // If user has NO active plan - Show Enrollment message
  if (!hasActivePlan && drawState === 'WAITING') {
    return (
      <>
        <div className="user-dashboard-bubbles-v2">
          <div className="user-bubble-v2 user-bubble-v2-1"></div>
          <div className="user-bubble-v2 user-bubble-v2-2"></div>
          <div className="user-bubble-v2 user-bubble-v2-3"></div>
          <div className="user-bubble-v2 user-bubble-v2-4"></div>
        </div>

        <div className="user-dashboard-compact">
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'linear-gradient(135deg, #F472B6, #EC4899)',
            borderRadius: '20px',
            color: 'white',
            marginTop: '40px'
          }}>
            <Sparkles style={{ width: '80px', height: '80px', margin: '0 auto 20px' }} />
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 12px' }}>
              No Active Plan
            </h1>
            <p style={{ fontSize: '16px', margin: '0 0 32px', opacity: 0.95 }}>
              Enroll in a plan to participate in lucky draws and win amazing prizes!
            </p>
            <button
              style={{
                padding: '14px 40px',
                background: 'white',
                color: '#EC4899',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onClick={() => {
                window.location.hash = '#home';
                window.location.reload();
              }}
            >
              View Available Plans
            </button>
          </div>
        </div>
      </>
    );
  }

  // If NO DRAW SCHEDULED - Show message
  if (hasActivePlan && !nextDraw && drawState === 'WAITING') {
    return (
      <>
        <div className="user-dashboard-bubbles-v2">
          <div className="user-bubble-v2 user-bubble-v2-1"></div>
          <div className="user-bubble-v2 user-bubble-v2-2"></div>
          <div className="user-bubble-v2 user-bubble-v2-3"></div>
          <div className="user-bubble-v2 user-bubble-v2-4"></div>
        </div>

        <div className="user-dashboard-compact">
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'linear-gradient(135deg, #60A5FA, #3B82F6)',
            borderRadius: '20px',
            color: 'white',
            marginTop: '40px'
          }}>
            <Clock style={{ width: '80px', height: '80px', margin: '0 auto 20px' }} />
            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 12px' }}>
              No Draw Scheduled Yet
            </h1>
            <p style={{ fontSize: '16px', margin: '0 0 16px', opacity: 0.95 }}>
              Your franchise will schedule the upcoming draw soon.
            </p>
            <p style={{ fontSize: '14px', margin: '0', opacity: 0.9 }}>
              Check back later or contact your franchise for more information.
            </p>
          </div>

          {/* Show Active Groups/Plans */}
          {enrollments && enrollments.length > 0 && (
            <div style={{
              marginTop: '24px',
              padding: '24px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Users style={{ width: '20px', height: '20px', color: '#60A5FA' }} />
                Your Active Plans
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {enrollments.filter(e => e.status === 'active').map((enrollment) => {
                  // Find if this group has a scheduled draw
                  const hasScheduledDraw = drawStatus?.all_scheduled_draws?.find(
                    d => d.group_id === enrollment.group_id
                  );
                  
                  return (
                    <div 
                      key={enrollment.id}
                      style={{
                        padding: '12px',
                        background: 'linear-gradient(135deg, #F9FAFB, #F3F4F6)',
                        borderRadius: '10px',
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '4px'
                          }}>
                            <div style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '14px' }}>
                              Group {enrollment.group_id}
                            </div>
                            <div style={{
                              padding: '2px 8px',
                              background: 'linear-gradient(135deg, #10B981, #059669)',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '600'
                            }}>
                              ACTIVE
                            </div>
                          </div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                            Month {enrollment.months_paid + 1} • {enrollment.months_paid}/{enrollment.plan_duration || 11} paid
                          </div>
                          {hasScheduledDraw ? (
                            <div style={{
                              fontSize: '12px',
                              color: '#3B82F6',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '4px'
                            }}>
                              <Calendar style={{ width: '12px', height: '12px' }} />
                              Next Draw: {new Date(hasScheduledDraw.draw_date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short'
                              })} at {hasScheduledDraw.draw_time}
                            </div>
                          ) : (
                            <div style={{
                              fontSize: '12px',
                              color: '#F59E0B',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '4px'
                            }}>
                              <Clock style={{ width: '12px', height: '12px' }} />
                              Draw not scheduled yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Summary info */}
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(251, 146, 60, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(251, 146, 60, 0.2)'
              }}>
                <div style={{
                  fontSize: '13px',
                  color: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertCircle style={{ width: '14px', height: '14px', color: '#F59E0B' }} />
                  <span>Your franchise will schedule draws for these groups soon</span>
                </div>
              </div>
            </div>
          )}

          {/* Past Draws if any */}
          {pastDraws.length > 0 && (
            <div className="user-card-compact" style={{ marginTop: '20px' }}>
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
                        {new Date(draw.date).toLocaleDateString('en-IN', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <span className="user-past-draw-status">{draw.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      {/* WAITING STATE - Show countdown FIRST at top */}
      {!isDrawActive && drawState === 'WAITING' && (
        <>
          <div className="user-dashboard-bubbles-v2">
            <div className="user-bubble-v2 user-bubble-v2-1"></div>
            <div className="user-bubble-v2 user-bubble-v2-2"></div>
            <div className="user-bubble-v2 user-bubble-v2-3"></div>
            <div className="user-bubble-v2 user-bubble-v2-4"></div>
          </div>

          <div className="user-dashboard-compact">
            {/* PRIORITY: Next Draw Countdown Card - Always at TOP */}
            <div style={{
              background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 35%, #3B82F6 65%, #FBBF24 100%)',
              borderRadius: 'clamp(16px, 4vw, 20px)',
              padding: 'clamp(20px, 5vw, 28px)',
              marginBottom: 'clamp(16px, 4vw, 20px)',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.5)',
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              {/* Animated background sparkles */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 2px, transparent 2px)',
                backgroundSize: '40px 40px',
                opacity: 0.4,
                animation: 'float 15s linear infinite'
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Icon and Title */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'clamp(8px, 2vw, 12px)',
                  marginBottom: 'clamp(12px, 3vw, 16px)'
                }}>
                  <Sparkles style={{ 
                    width: 'clamp(28px, 7vw, 36px)', 
                    height: 'clamp(28px, 7vw, 36px)', 
                    color: 'white',
                    animation: 'spin 4s linear infinite'
                  }} />
                  <h2 style={{
                    fontSize: 'clamp(20px, 5.5vw, 26px)',
                    fontWeight: '800',
                    color: 'white',
                    margin: 0,
                    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    textAlign: 'center'
                  }}>
                    Next Draw Live
                  </h2>
                </div>

                {/* Draw Date & Time */}
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: 'clamp(12px, 3vw, 14px)',
                  padding: 'clamp(12px, 3vw, 16px)',
                  marginBottom: 'clamp(16px, 4vw, 20px)',
                  backdropFilter: 'blur(10px)',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: 'clamp(13px, 3.5vw, 14px)',
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: 'clamp(4px, 1vw, 6px)',
                    fontWeight: '600'
                  }}>
                    📅 Draw Date & Time
                  </div>
                  <div style={{
                    fontSize: 'clamp(18px, 5vw, 22px)',
                    fontWeight: '700',
                    color: 'white',
                    wordBreak: 'break-word',
                    lineHeight: '1.3'
                  }}>
                    {new Date(upcomingDraw.drawDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div style={{
                    fontSize: 'clamp(16px, 4.5vw, 20px)',
                    fontWeight: '700',
                    color: '#FBBF24',
                    marginTop: 'clamp(4px, 1vw, 6px)'
                  }}>
                    🕐 {new Date(`2000-01-01T${upcomingDraw.drawTime}`).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>

                {/* Countdown Timer */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: 'clamp(12px, 3vw, 16px)'
                }}>
                  <div style={{
                    fontSize: 'clamp(14px, 3.8vw, 16px)',
                    color: 'white',
                    fontWeight: '600',
                    marginBottom: 'clamp(10px, 2.5vw, 12px)',
                    opacity: 0.95
                  }}>
                    ⏰ Draw Starts In
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 'clamp(8px, 2vw, 12px)',
                    maxWidth: '100%'
                  }}>
                    {[
                      { value: countdown.days, label: 'Days' },
                      { value: countdown.hours, label: 'Hours' },
                      { value: countdown.minutes, label: 'Min' },
                      { value: countdown.seconds, label: 'Sec' }
                    ].map((item, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(255,255,255,0.25)',
                        borderRadius: 'clamp(10px, 2.5vw, 12px)',
                        padding: 'clamp(10px, 2.5vw, 12px) clamp(6px, 1.5vw, 8px)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255,255,255,0.3)',
                        minWidth: 0
                      }}>
                        <div style={{
                          fontSize: 'clamp(24px, 7vw, 32px)',
                          fontWeight: '800',
                          color: 'white',
                          lineHeight: '1',
                          marginBottom: 'clamp(4px, 1vw, 6px)',
                          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          wordBreak: 'normal'
                        }}>
                          {String(item.value).padStart(2, '0')}
                        </div>
                        <div style={{
                          fontSize: 'clamp(10px, 2.8vw, 12px)',
                          color: 'rgba(255,255,255,0.9)',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          wordBreak: 'normal'
                        }}>
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 'clamp(8px, 2vw, 10px)'
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 'clamp(8px, 2vw, 10px)',
                    padding: 'clamp(8px, 2vw, 10px)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    minWidth: 0
                  }}>
                    <div style={{
                      fontSize: 'clamp(10px, 2.8vw, 11px)',
                      color: 'rgba(255,255,255,0.8)',
                      marginBottom: '2px',
                      fontWeight: '600'
                    }}>
                      Participants
                    </div>
                    <div style={{
                      fontSize: 'clamp(16px, 4.5vw, 20px)',
                      fontWeight: '700',
                      color: 'white'
                    }}>
                      {upcomingDraw.eligibleParticipants}
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 'clamp(8px, 2vw, 10px)',
                    padding: 'clamp(8px, 2vw, 10px)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    minWidth: 0
                  }}>
                    <div style={{
                      fontSize: 'clamp(10px, 2.8vw, 11px)',
                      color: 'rgba(255,255,255,0.8)',
                      marginBottom: '2px',
                      fontWeight: '600'
                    }}>
                      Total Prizes
                    </div>
                    <div style={{
                      fontSize: 'clamp(16px, 4.5vw, 20px)',
                      fontWeight: '700',
                      color: 'white'
                    }}>
                      {upcomingDraw.totalPrizes}
                    </div>
                  </div>
                </div>
              </div>

              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-20px); }
                }
              `}</style>
            </div>

            {/* Payment Reminder Card - Show if user has unpaid enrollments */}
            {enrollments.some(e => e.status === 'active' && e.months_paid < 11) && (
              <div style={{
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                borderRadius: 'clamp(14px, 3.5vw, 16px)',
                padding: 'clamp(16px, 4vw, 20px)',
                marginBottom: 'clamp(16px, 4vw, 20px)',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'clamp(10px, 2.5vw, 12px)',
                  marginBottom: 'clamp(12px, 3vw, 14px)'
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    padding: 'clamp(8px, 2vw, 10px)',
                    flexShrink: 0
                  }}>
                    <Gift style={{ 
                      width: 'clamp(20px, 5vw, 24px)', 
                      height: 'clamp(20px, 5vw, 24px)', 
                      color: 'white' 
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: 'clamp(16px, 4.5vw, 18px)',
                      fontWeight: '700',
                      color: 'white',
                      margin: '0 0 clamp(4px, 1vw, 6px) 0',
                      wordBreak: 'break-word'
                    }}>
                      Make Payment to Participate!
                    </h3>
                    <p style={{
                      fontSize: 'clamp(13px, 3.5vw, 14px)',
                      color: 'rgba(255,255,255,0.95)',
                      margin: 0,
                      lineHeight: '1.5',
                      wordBreak: 'break-word'
                    }}>
                      Pay for your active groups to be eligible for the upcoming draw
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.location.hash = '#home'}
                  style={{
                    width: '100%',
                    background: 'white',
                    color: '#EF4444',
                    border: 'none',
                    borderRadius: 'clamp(10px, 2.5vw, 12px)',
                    padding: 'clamp(12px, 3vw, 14px)',
                    fontSize: 'clamp(14px, 3.8vw, 15px)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    minHeight: '48px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  Go to My Groups →
                </button>
              </div>
            )}

            {/* Rest of existing content below */}
            <div className="user-draw-upcoming-header">
              <Sparkles className="user-draw-header-icon" />
              <div>
                <h1 className="user-draw-header-title">Your Active Groups</h1>
                <p className="user-draw-header-subtitle">
                  Month {upcomingDraw.month} • {user?.full_name}
                </p>
              </div>
            </div>

            {/* Info: Draw will start automatically when franchise starts it */}
            <div style={{
              textAlign: 'center',
              padding: '16px',
              background: 'rgba(96, 165, 250, 0.1)',
              borderRadius: '12px',
              marginTop: '16px'
            }}>
              <p style={{
                color: '#60A5FA',
                fontSize: '14px',
                fontWeight: '600',
                margin: 0
              }}>
                🔔 Draw will start automatically at the scheduled time
              </p>
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

            {/* Past Draws - Prize History Table */}
            {pastDraws.length > 0 && (
              <div className="user-card-compact">
                <h3 className="user-section-title" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <Trophy style={{ width: '20px', height: '20px', color: '#F59E0B' }} />
                  My Prize History
                </h3>
                
                {/* Desktop Table View */}
                <div style={{ 
                  overflowX: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  display: 'block'
                }} className="desktop-prize-table">
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '14px',
                    minWidth: '500px'
                  }}>
                    <thead>
                      <tr style={{
                        background: 'linear-gradient(135deg, #F3F4F6, #E5E7EB)',
                        borderBottom: '2px solid #D1D5DB'
                      }}>
                        <th style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#1a1a1a'
                        }}>Month</th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#1a1a1a'
                        }}>Draw Date</th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#1a1a1a'
                        }}>Status</th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#1a1a1a'
                        }}>Winner</th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#1a1a1a'
                        }}>Prize</th>
                        <th style={{
                          padding: '12px',
                          textAlign: 'right',
                          fontWeight: '600',
                          color: '#1a1a1a'
                        }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastDraws.map((draw) => {
                        const result = drawStatus?.my_results?.find(r => r.month === draw.month);
                        const isWon = result?.status === 'won';
                        
                        return (
                          <tr 
                            key={draw.month}
                            style={{
                              borderBottom: '1px solid #E5E7EB',
                              transition: 'background 0.2s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#F9FAFB'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{
                              padding: '12px',
                              fontWeight: '500',
                              color: '#1a1a1a'
                            }}>
                              Month {draw.month}
                            </td>
                            <td style={{
                              padding: '12px',
                              color: '#666',
                              fontSize: '13px'
                            }}>
                              {new Date(draw.date).toLocaleDateString('en-IN', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: isWon
                                  ? 'linear-gradient(135deg, #10B981, #059669)' 
                                  : draw.status === 'Completed' 
                                    ? '#F3F4F6'
                                    : '#FEF3C7',
                                color: isWon 
                                  ? 'white' 
                                  : draw.status === 'Completed' 
                                    ? '#6B7280'
                                    : '#92400E'
                              }}>
                                {isWon ? '🏆 WON' : draw.status}
                              </span>
                            </td>
                            <td style={{
                              padding: '12px',
                              color: '#666',
                              fontSize: '13px'
                            }}>
                              {result?.winner_mld_id || '-'}
                            </td>
                            <td style={{
                              padding: '12px',
                              color: '#1a1a1a',
                              fontWeight: isWon ? '600' : '400'
                            }}>
                              {result?.prize_name || '-'}
                            </td>
                            <td style={{
                              padding: '12px',
                              textAlign: 'right',
                              fontWeight: isWon ? '700' : '400',
                              color: isWon ? '#10B981' : '#666',
                              fontSize: isWon ? '15px' : '14px'
                            }}>
                              {result?.prize_amount ? `₹${result.prize_amount.toLocaleString()}` : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div style={{ display: 'none' }} className="mobile-prize-cards">
                  {pastDraws.map((draw) => {
                    const result = drawStatus?.my_results?.find(r => r.month === draw.month);
                    const isWon = result?.status === 'won';
                    
                    return (
                      <div 
                        key={draw.month}
                        style={{
                          background: isWon
                            ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5)'
                            : '#F9FAFB',
                          border: isWon
                            ? '2px solid #10B981'
                            : '1px solid #E5E7EB',
                          borderRadius: '12px',
                          padding: '16px',
                          marginBottom: '12px'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <div>
                            <div style={{
                              fontWeight: '600',
                              fontSize: '16px',
                              color: '#1a1a1a',
                              marginBottom: '4px'
                            }}>
                              Month {draw.month} Draw
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#666'
                            }}>
                              {new Date(draw.date).toLocaleDateString('en-IN', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </div>
                          </div>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: isWon
                              ? 'linear-gradient(135deg, #10B981, #059669)' 
                              : '#E5E7EB',
                            color: isWon ? 'white' : '#6B7280',
                            whiteSpace: 'nowrap'
                          }}>
                            {isWon ? '🏆 WON' : draw.status}
                          </span>
                        </div>
                        
                        {isWon && result && (
                          <>
                            <div style={{
                              fontSize: '14px',
                              color: '#1a1a1a',
                              fontWeight: '600',
                              marginBottom: '8px'
                            }}>
                              {result.prize_name}
                            </div>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: '700',
                              color: '#10B981',
                              marginBottom: '8px'
                            }}>
                              ₹{result.prize_amount?.toLocaleString()}
                            </div>
                          </>
                        )}
                        
                        <div style={{
                          fontSize: '12px',
                          color: '#666',
                          marginTop: '8px'
                        }}>
                          Winner: {result?.winner_mld_id || '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Responsive CSS */}
                <style>{`
                  @media (max-width: 640px) {
                    .mobile-prize-cards {
                      display: block !important;
                    }
                    .desktop-prize-table {
                      display: none !important;
                    }
                  }
                `}</style>
              </div>
            )}
          </div>
        </>
      )}

      {/* ACTIVE DRAW STATES - FULLSCREEN */}
      {isDrawActive && (
        <>
          {/* FINAL COUNTDOWN */}
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

          {/* SHUFFLING / SLOWING / LOCKED */}
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

                <div className="lottery-sphere-wrapper">
                  <LotterySphere isAnimating={!isSphereStopped} />
                </div>

                <DigitalNumberDisplay 
                  number={displayNumber} 
                  isAnimating={drawState === 'SINGLE_SHUFFLE' || drawState === 'SHUFFLE_SLOWING'}
                />
              </div>
            </div>
          )}

          {/* CONGRATULATIONS POPUP */}
          {drawState === 'CONGRATULATIONS_POPUP' && (
            <div className="live-draw-overlay-cinematic">
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
                  {[...selectedWinners, ...selectedWinners].map((winner, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (index % selectedWinners.length) * 0.1 }}
                      className="final-winner-card-cinematic"
                    >
                      <div className="final-winner-badge">#{(index % selectedWinners.length) + 1}</div>
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
        </>
      )}
    </>
  );
};

export default Draw;
