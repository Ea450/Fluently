export async function speakWithElevenLabs(
  text: string,
  voice_id: string = "Rachel"
) {
  const apiKey = process.env.ELEVENLABS_API_KEY!;
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8,
        },
      }),
    }
  );

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const audio = new Audio(url);
  await audio.play();
}
