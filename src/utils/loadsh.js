// 节流函数
const throttle = (callback, delay) => {
    let isThrottle = true;
    return () => {
      if (!isThrottle) return;
      isThrottle = false;
  
      setTimeout(() => {
        callback();
        isThrottle = true;
      }, delay);
    };
  };
  
  // 防抖函数
  const debounce = (callback, delay) => {
    let timer = null;
    return () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        callback();
      }, delay);
    };
  };
  
  export { throttle, debounce };