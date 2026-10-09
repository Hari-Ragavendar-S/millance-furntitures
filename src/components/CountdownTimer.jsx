import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

const CountdownTimer = ({ drawDate, drawTime, className = '' }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    // Calculate time remaining
    const calculateTimeRemaining = () => {
      const drawDateTime = new Date(`${drawDate}T${drawTime}:00`);
      const now = new Date();
      const diff = drawDateTime - now;

      if (diff <= 0) {
        return null; // Draw has passed
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [drawDate, drawTime]);

  if (!timeRemaining) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-red-400 font-semibold">Draw has ended</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Countdown Display */}
      <div className="grid grid-cols-4 gap-3">
        {/* Days */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-3 mb-2">
            <p className="text-2xl md:text-3xl font-bold text-white">{timeRemaining.days}</p>
          </div>
          <p className="text-xs text-gray-400 uppercase">Days</p>
        </div>

        {/* Hours */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-3 mb-2">
            <p className="text-2xl md:text-3xl font-bold text-white">
              {String(timeRemaining.hours).padStart(2, '0')}
            </p>
          </div>
          <p className="text-xs text-gray-400 uppercase">Hours</p>
        </div>

        {/* Minutes */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg p-3 mb-2">
            <p className="text-2xl md:text-3xl font-bold text-white">
              {String(timeRemaining.minutes).padStart(2, '0')}
            </p>
          </div>
          <p className="text-xs text-gray-400 uppercase">Minutes</p>
        </div>

        {/* Seconds */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-green-600 to-cyan-600 rounded-lg p-3 mb-2">
            <p className="text-2xl md:text-3xl font-bold text-white">
              {String(timeRemaining.seconds).padStart(2, '0')}
            </p>
          </div>
          <p className="text-xs text-gray-400 uppercase">Seconds</p>
        </div>
      </div>

      {/* Draw Date/Time Info */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span>
            {new Date(drawDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Clock className="w-4 h-4 text-purple-400" />
          <span>
            {new Date(`2000-01-01T${drawTime}`).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })} IST
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
