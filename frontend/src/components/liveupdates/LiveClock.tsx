import { useState, useEffect } from 'react';


const LiveClock = () => {
  const formatTime = (
    locale: string,
    timeZone: string,
    withSeconds: boolean,
    ampmCase: 'upper' | 'lower'
  ) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      ...(withSeconds && { second: '2-digit' }),
    };

    const timeStr = new Date().toLocaleTimeString(locale, options);
    const [time, modifier] = timeStr.split(' ');
    const formattedModifier = ampmCase === 'upper' ? modifier.toUpperCase() : modifier.toLowerCase();
    return `${time} ${formattedModifier}`;
  };

  const [currentTime, setCurrentTime] = useState(() =>
    formatTime('en-IN', 'Asia/Kolkata', true, 'upper')
  );
  const [usTime, setUsTime] = useState(() =>
    formatTime('en-US', 'America/New_York', false, 'lower')
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTime('en-IN', 'Asia/Kolkata', true, 'upper'));
      setUsTime(formatTime('en-US', 'America/New_York', false, 'lower'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm text-right leading-tight">
      <div>
        {currentTime} <span className="font-medium">(IST)</span>
      </div>
      <div className="text-xs italic text-white-500">
        {usTime} <span>(US)</span>
      </div>
    </div>
  );
};

export default LiveClock;
