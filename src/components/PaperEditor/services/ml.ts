export async function summarize(text: string): Promise<string> {
  const prompt = `
      ### Instruction:
      Summarize the following text: ${text}

      ### Result:`.split('\n').map(line => line.trim()).join('\n');

    const result = await fetch('http://bbp.courcol.ch:8080/completion', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        prompt,
        n_predict: 128,
      })
    }).then(res => res.json());

    const summary = result.content ?? 'Error';

    return summary;
}

export async function expand(text: string): Promise<string> {
  const result = await fetch('http://bbp.courcol.ch:8080/completion', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      prompt: text,
      n_predict: 512,
    })
  }).then(res => res.json());

  const expandedText = result.content ?? 'Error';

  return expandedText;
}
