# Contributing

Alina (`alina-kovalenko`) and Ibragim (`lalob1`) can work on separate branches in parallel. Pick an assigned issue, make a focused change, run validation and open a pull request that names the issue.

## Shared question bank

Edit `data/question-bank.json`. A question needs a stable `id`, source and original number, prompt, choices, zero-based `answers`, `selectionCount`, explanation and answer status. Use `Source feedback` only when the source supplies the key; otherwise use `Worked answer` or `Worked calculation`. Describe uncertainty in `reviewNote`/`explanation`, and set `needsReview: true` when appropriate.

Keep original prompts and source references. If correcting OCR, identify the photo and question number in the pull request. Do not treat handwritten circles as an official marking scheme. Do not silently replace a broad exam question with a more precise one: preserve the prompt and explain the terminology in the solution.

When adding an absent question, use IDs `m2-16` or `m2-17` if the source confirms it belongs to Variant 2. Add new endterm material under a separate source label and stable IDs. Update coverage counts and the validation expectations when adding questions.

## Division of work

| Person | Independent work |
| --- | --- |
| Alina | Audit the 48 photo transcriptions and prepared keys; resolve four fading/interference notes; locate missing Variant 2 questions and separate endterm material. |
| Ibragim | Review seven calculation solutions and 67 Assignment 4 practice items; maintain question-bank behavior and mobile layout. |

Use one issue per bounded change and avoid editing the same question IDs at the same time. A pull request should explain the correction and its source, then list the validation performed. Request the other person’s review before merging changes to answer keys.

## Validation

Run `node scripts/validate.mjs`. For behavior changes, use a local HTTP server and verify that you can replace a wrong answer with a correct one, change a multi-select answer, browse all questions, finish a mock and revise its answers. Check narrow screens as well.

Never commit API tokens, credentials, local storage exports or student names. The OCR service is needed only when new image sources are added; the published site requires no OCR connection.
