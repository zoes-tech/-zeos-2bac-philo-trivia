# Content guide

Everything a student reads lives in two places:

| Content | Location | Format |
| --- | --- | --- |
| Questions, options, answers, concepts, philosophers | `src/data/curriculum/*.json` | one array of modules per level |
| Explanations shown after a mistake and on theme pages | `src/data/explanations/*.json` | flat map keyed `moduleId:questionId` |

The split is deliberate: a teacher can rewrite explanations without touching the
question banks, and a question can be edited without re-keying its explanation.

## Question schema

```json
{
  "id": "q1",
  "question": "…",
  "options": ["…", "…", "…", "…"],
  "correctAnswer": 1,
  "category": "الشخص"
}
```

- `id` is only unique **inside a module**, which is why explanation keys use
  `moduleId:questionId`.
- `category` should match a concept `name` in the same module when possible; the
  quiz uses it to show the related concept after a mistake.

## Explanation schema

`src/data/explanations/<module-id>.json`:

```json
{
  "human-condition:q1": "تعبّر الهوية عن وحدة الذات وثباتها عبر الزمن، وهي ما يجعل الشخص هو نفسه لا شخصاً آخر."
}
```

Rules enforced by `scripts/check-content.mjs` (runs in `npm run build`):

- every question must have a non-empty explanation;
- no orphan keys for questions that no longer exist;
- 20–420 characters;
- no Latin letters (the app is Arabic).

Style rules for humans and for drafts:

1. Say **why** the correct answer is right: a definition, a distinction, or a
   philosopher's thesis the question tests.
2. Do not merely repeat the question or write "الإجابة الصحيحة هي…" alone.
3. One to two sentences, ~35 words maximum.
4. Stay inside the Moroccan curriculum axes. Do not invent quotations, exam
   questions or historical claims.
5. Do not mention option letters or positions; options are shuffled at runtime.

## Provenance and review status

The questions come from the original project data.

The explanations in `src/data/explanations/` were **drafted from each question's
text, options, correct answer and the official program axes** (الوضع البشري،
المعرفة، السياسة، الأخلاق for 2BAC; الإنسان والفاعلية for 1BAC; نشأة الفلسفة for
tronc commun). They are intentionally short and definitional.

They are **drafts pending teacher review**. The UI labels them "شرح مبسط" and the
theme pages state that they do not replace the teacher. Before presenting them as
authoritative:

- [ ] a philosophy teacher reviews every explanation for the 2BAC modules first;
- [ ] disputed items are corrected in the JSON (no code changes needed);
- [ ] the `docs/ROADMAP.md` item is ticked and the wording moves from "draft" to
      "reviewed".

This is also the prerequisite for expanding `concepts[].content` into real lesson
summaries.

Internal second-pass audits for the 2BAC modules are recorded in
[`docs/reviews/`](reviews/README.md). They document corrections and open
questions; they do not replace the teacher review above.

## Adding a module

1. Add it to the appropriate curriculum JSON.
2. Add its questions.
3. Create `src/data/explanations/<module-id>.json` with a key for every question.
4. Add the import to `src/lib/explanations.ts`.
5. Run `npm run build`; the content check will name any missing key.

The theme page, sitemap entry and `llms.txt` entry are generated automatically
from the module data.

## Review checklist

For each explanation, a reviewer should confirm:

- the stated reason actually supports the marked correct option;
- no other option is defensible under the curriculum;
- the vocabulary matches the textbook (مفهوم، محور، أطروحة، إشكال);
- no claim about an exam or an official text is invented;
- the wording is understandable to a 2BAC student, not academic jargon.
