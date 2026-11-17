export function sameAnswers(selected, expected) {
  return selected.length === expected.length && expected.every(i => selected.includes(i));
}
export function toggleAnswer(selected, index, count) {
  if (count === 1) return [index];
  return selected.includes(index) ? selected.filter(i => i !== index) : [...selected, index];
}
export function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
export function examScore(questions, selections) {
  return questions.reduce((score, q) => score + Number(sameAnswers(selections[q.id] || [], q.answers)), 0);
}
