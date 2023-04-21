// eslint-disable-next-line import/prefer-default-export
export const removeChildren = (div: HTMLDivElement) => {
  while (div.lastChild) {
    div.removeChild(div.lastChild);
  }
};
