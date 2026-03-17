export function isPageLoad() {
  if (!document.body.classList.contains("_loading")) {
    window.addEventListener("load", () => {
      document.body.classList.add("_loaded");
    });
  }
}