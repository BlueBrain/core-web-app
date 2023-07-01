export const removeChildren = (div: HTMLDivElement) => {
  while (div.lastChild) {
    div.removeChild(div.lastChild);
  }
};
