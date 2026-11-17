import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

// These checks guard the reviewed source mapping, not the truth of a worked key.
// Source-backed additions/corrections must update these expectations explicitly.
export function validatePastPaperReview(bank, root) {
  const papers = bank.questions.filter(q => /^m[12]-/.test(q.id));
  const byId = new Map(papers.map(q => [q.id, q]));
  const expectedNumbers = {
    1: Array.from({length: 25}, (_, i) => i + 1),
    2: Array.from({length: 25}, (_, i) => i + 1).filter(n => n !== 16 && n !== 17)
  };
  const reviewedKeys = {
    1: ['B','C','C','B','C','B','B','C','B','A','B','A','A','AC','C','B','C','D','C','B','C','BD','B','AC','BC'],
    2: ['A','C','B','A','B','C','A','A','A','A','A','A','B','C','C','C','C','AB','A','B','A','AB','AC']
  };
  for (const variant of [1, 2]) {
    const items = papers.filter(q => q.source === `Midterm Variant ${variant}`);
    assert.deepEqual(items.map(q => Number(q.sourceNumber)), expectedNumbers[variant], `Variant ${variant} source coverage changed`);
    items.forEach((q, index) => {
      assert.equal(q.id, `m${variant}-${String(q.sourceNumber).padStart(2, '0')}`, `Unstable source ID ${q.id}`);
      assert.equal(q.sourceRef, `${q.source} · ${q.sourceNumber}`, `Source reference mismatch ${q.id}`);
      assert.equal(q.answers.map(i => String.fromCharCode(65 + i)).join(''), reviewedKeys[variant][index], `Reviewed key changed ${q.id}`);
      assert.notEqual(q.answerStatus, 'Source feedback', `Past-paper key is not official feedback ${q.id}`);
      assert(q.transcriptionStatus?.trim(), `Missing transcription verification status ${q.id}`);
      assert(Array.isArray(q.evidence) && q.evidence.length > 0, `Missing technical evidence ${q.id}`);
      for (const source of q.evidence) {
        assert(source.title?.trim(), `Missing evidence title ${q.id}`);
        const url = new URL(source.url);
        assert.equal(url.protocol, 'https:', `Evidence must use HTTPS ${q.id}`);
        assert(!url.username && !url.password, `Credentials in evidence URL ${q.id}`);
      }
    });
  }
  assert.equal(papers.length, 48);
  assert.equal(papers.filter(q => q.selectionCount === 2).length, 7);
  assert(!byId.has('m2-16') && !byId.has('m2-17'), 'Missing questions require new source evidence');
  assert(bank.coverage.missing.some(note => /Variant 2.*16.*17/.test(note)), 'Missing Variant 2 coverage note');
  assert(bank.coverage.missing.some(note => /endterm/i.test(note)), 'Missing endterm coverage note');
  for (const id of ['m1-10', 'm1-25', 'm2-22', 'm2-23']) {
    assert(byId.get(id).needsReview, `Ambiguous source wording must remain flagged ${id}`);
    assert(byId.get(id).reviewNote?.trim(), `Missing ambiguity explanation ${id}`);
  }

  // Compare every transcribed prompt, option, instruction, source and key.
  // This detects drift between public representations; photos are a separate review.
  const transcript = fs.readFileSync(path.join(root, 'sources/past-paper-transcription.md'), 'utf8').replace(/\r\n/g, '\n');
  const sections = transcript.split(/\n(?=## Midterm Variant [12] · \d+\n)/).slice(1);
  assert.equal(sections.length, papers.length, 'Transcript coverage differs from the bank');
  const seen = new Set();
  for (const section of sections) {
    const heading = section.match(/^## Midterm Variant ([12]) · (\d+)\n/);
    const id = `m${heading[1]}-${heading[2].padStart(2, '0')}`;
    assert(!seen.has(id), `Duplicate transcript question ${id}`);
    seen.add(id);
    const q = byId.get(id);
    assert(q, `Unexpected transcript question ${id}`);
    const source = section.match(/^Source: `([^`]+)`$/m);
    assert(source, `Missing transcript source ${id}`);
    assert.equal(source[1], q.sourceFile, `Transcript source mismatch ${id}`);
    const choiceStart = section.search(/^A\. /m);
    assert(choiceStart > source.index, `Missing transcript choices ${id}`);
    assert.equal(section.slice(source.index + source[0].length, choiceStart).trim(), q.prompt, `Transcript prompt mismatch ${id}`);
    const choices = [...section.matchAll(/^([A-Z])\. (.+)$/gm)];
    assert.deepEqual(choices.map((match, i) => match[1]), q.choices.map((_, i) => String.fromCharCode(65 + i)), `Transcript option labels mismatch ${id}`);
    assert.deepEqual(choices.map(match => match[2]), q.choices, `Transcript choices mismatch ${id}`);
    const instruction = section.match(/^Choose (\d+) answer\(s\)\.$/m);
    assert(instruction, `Missing transcript selection instruction ${id}`);
    assert.equal(Number(instruction[1]), q.selectionCount, `Transcript selection count mismatch ${id}`);
    const key = section.match(/^(Worked answer|Worked calculation): ([A-Z](?:, [A-Z])*)\./m);
    assert(key, `Missing transcript worked key ${id}`);
    assert.equal(key[1], q.answerStatus, `Transcript answer status mismatch ${id}`);
    assert.deepEqual(key[2].split(', ').map(letter => letter.charCodeAt(0) - 65), q.answers, `Transcript answer indexes mismatch ${id}`);
  }

  // Independent arithmetic, using the stated quantities and units. Checking the
  // chosen option ties each computation to its actual answer rather than prose.
  const calculations = [
    ['m1-15', 24 / 3, ' MB/s'],
    ['m1-16', 100 / 20, ' seconds'],
    ['m1-17', 1000 * 8 / 100, ' seconds'],
    ['m1-18', (50 / 5) ** 2, ''],
    ['m1-19', (18 - 6) * 1.5 * 7, ' Wh'],
    ['m2-13', 50 / 5, ' MB/s'],
    ['m2-14', 80 / 8, ' MB/s'],
    ['m2-15', 400 * 8 / 80, ' seconds'],
    ['m2-18', (20 / 5) ** 2, ''],
    ['m2-19', (12 - 4) * 2, ' Wh']
  ];
  for (const [id, result, unit] of calculations) {
    const q = byId.get(id);
    assert.equal(q.answerStatus, 'Worked calculation', `Numerical answer provenance ${id}`);
    assert.equal(q.choices[q.answers[0]], `${result}${unit}`, `Calculation or keyed option mismatch ${id}`);
  }
  const cost = byId.get('m1-20');
  assert.equal(cost.answerStatus, 'Worked calculation');
  assert(120000 / 150 < 60000 / 30);
  assert.equal(cost.choices[cost.answers[0]], `2G: $${120000 / 150} per user`);
  assert.equal(byId.get('m2-02').choices[byId.get('m2-02').answers[0]], `${(1e-3 / 1e-6).toLocaleString('en-US')} microseconds`);
}
