import { useEffect, useState } from 'react';

function useCurrentDateTime() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return now;
}

export default useCurrentDateTime;
