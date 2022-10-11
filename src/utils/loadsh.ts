// 节流函数
const throttle = (callback: () => void, delay: number) => {
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
const debounce = (callback: () => void, delay: number) => {
  let timer: any = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
    }, delay);
  };
};

export { throttle, debounce };