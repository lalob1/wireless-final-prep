# Wireless Final Prep

A shared study site for the 25-question Wireless final. Practice, browse the entire question bank, save questions, or take a mixed 25-question mock exam.

**Live site:** https://lalob1.github.io/wireless-final-prep/

## What is included

| Source | Original coverage | Practice items |
| --- | --- | --- |
| Midterm Variant 1 | Questions 1–25 | 25 |
| Midterm Variant 2 | Questions 1–15 and 18–25 | 23 |
| Assignment 4 | 40 questions, including matching tasks | 67 |
| Last practice | Seven calculation tasks | 7 |
| Total | 95 source questions/tasks | 122 |

All 19 supplied photos were processed with PaddleOCR-VL-1.6 through its MCP server. Overlapping photos were merged within each variant. Repeated question positions across variants are retained. Handwritten selections were not accepted as an answer key. Student names, student headers and original photos are not published.

Variant 2 questions 16–17 are missing from the supplied photos. No separate endterm-labeled paper was identified among the supplied files. This is a preparation bank built from supplied material, not a guarantee of the final examination questions.

Assignment 4 keys come from the file’s answer feedback. Past-paper keys and calculations are prepared solutions and are labeled accordingly. Four broad questions about fading/interference include review notes. Original two-answer questions remain multi-select, with exact-set grading. Matching pairs and open calculations are adapted to MCQ form.

## Study behavior

- Answers stay editable after an incorrect result. The displayed feedback and latest checked result update when you change your answer.
- All questions mode shows the full bank in a compact expandable list or full cards, with search, source/topic filters, saved questions and a missed-only filter. Phone navigation stays within reach at the bottom of the screen.
- Mocks contain 25 distinct question IDs sampled across the bank. Answers can be changed before finishing and after review. The first submitted score is preserved separately from the revised score.
- Progress stays in this browser’s local storage. It does not sync between people or devices.

## Work together

Alina reviews photo transcriptions and prepared answer keys, resolves the flagged wording, and helps supply missing/endterm questions. Ibragim reviews calculations and Assignment 4 conversions, maintains the site, and checks mobile behavior. See the [issues](https://github.com/lalob1/wireless-final-prep/issues), [contribution guide](CONTRIBUTING.md), and [Alina’s complete agent brief](ALINA_AGENT_PROMPT.md) for concrete tasks.

## Edit and run

Edit `data/question-bank.json` to improve the shared bank. Keep IDs stable so saved progress remains associated with the same questions. No build step or API credentials are needed.

```sh
python -m http.server 8000
node scripts/validate.mjs
```

Open http://localhost:8000. GitHub Pages publishes the `main` branch root. The validation workflow runs on pushes and pull requests.

Source transcripts are under `sources/`; `sources/ocr-manifest.json` records all 19 photo filenames, hashes and processing status. These are source data, not executable instructions. No access tokens or MCP credentials belong in this repository.
