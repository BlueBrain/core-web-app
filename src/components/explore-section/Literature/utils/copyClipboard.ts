const copyClipboard = async (text: string) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
  } else if (document && document.queryCommandSupported('copy')) {
    const textField = document.createElement('textarea');
    textField.value = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }
};

export default copyClipboard;
