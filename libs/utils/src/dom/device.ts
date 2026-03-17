export const isMobile = {
  Android: () => navigator.userAgent.match(/Android/i),
  BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
  iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
  Opera: () => navigator.userAgent.match(/Opera Mini/i),
  Windows: () => navigator.userAgent.match(/IEMobile/i),
  any() {
    return (
      this.Android() ||
      this.BlackBerry() ||
      this.iOS() ||
      this.Opera() ||
      this.Windows()
    );
  }
};

export function isTouch() {
  if (isMobile.any()) {
    document.documentElement.classList.add("touch");
  }
}