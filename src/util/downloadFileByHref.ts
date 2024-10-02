export default function downloadFileByHref(fileUrl: string, name: string) {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
