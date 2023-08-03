export default function scrollToBottom(timeout: number = 200) {
  const timeoutId = setTimeout(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: document.body.scrollHeight,
    });
    clearTimeout(timeoutId);
  }, timeout);
}
