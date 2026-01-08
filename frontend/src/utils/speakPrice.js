export function speakBestMarket({ crop, market, price, state, greeting }) {
  if (!("speechSynthesis" in window)) return;

  const text = `${greeting}. Today’s best market is ${market} in ${state}. ${crop} price is rupees ${price}`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 0.9;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export function speakPrice({ crop, market, price, state }) {
  if (!("speechSynthesis" in window)) return;

  const text = `The price of ${crop} in ${market}, ${state} is rupees ${price}`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.rate = 0.9;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
