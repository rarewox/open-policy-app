import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

const CountDownTimer = ({ time, otp_request }) => {
  const timerRef = useRef(null);
  const [timer, setTimer] = useState('00:50');

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (minutes > 9 ? minutes : '0' + minutes) +
          ':' +
          (seconds > 9 ? seconds : '0' + seconds),
      );
    } else {
      // Timer expired
      clearInterval(timerRef.current);
    }
  };

  const clearTimer = (e) => {
    setTimer('00:50');
    if (timerRef.current) clearInterval(timerRef.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    timerRef.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + (time ?? 50));
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, [time]); // Add dependency to reset timer when `time` changes

  const onClickReset = () => {
    clearTimer(getDeadTime());
    otp_request(); // Call OTP request function when resetting
  };

  return timer !== '00:00' ? (
    <TouchableOpacity className="flex-row justify-center mt-10" disabled={true}>
      <Text className="text-black text-center font-medium">
        Resend code in{' '}
      </Text>
      <Text className="text-blue-500 text-center font-medium">{timer}</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      className="mt-10"
      onPress={() => {
        onClickReset();
      }}
    >
      <Text className="text-blue-500 text-center font-medium">Resend code</Text>
    </TouchableOpacity>
  );
};

export default CountDownTimer;
