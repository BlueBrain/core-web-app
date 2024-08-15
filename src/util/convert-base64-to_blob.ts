export default function getBlobFromPlotImage(url: string) {
  return fetch(url).then((v) => v.blob());
}
