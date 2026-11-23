# Knowledge module — explanation audit

Second-pass accuracy audit of `src/data/explanations/knowledge.json` against
`src/data/curriculum/2nd-bac-knowledge.json` (module `knowledge`, 25 questions).

Positions were checked against the standard Moroccan 2BAC lessons of
«مجزوءة المعرفة» (النظرية والتجربة، الحقيقة) as taught in في رحاب الفلسفة /
مباهج الفلسفة / منار الفلسفة and summarised by AlloSchool, Philomaroc and
9rayti: كلود برنار (خطوات المنهج التجريبي)، روني طوم (الخيال والتجربة الذهنية)،
ألكسندر كويري (التجربة الخام عائق)، أينشتاين (المبادئ إبداعات حرة للعقل الرياضي)،
باشلار (العقلانية المطبقة، الرأي عائقاً)، بوبر (القابلية للتكذيب)،
بيير تويليي (الفروض الإضافية وربط النظرية بنظريات أخرى)، ابن الهيثم (النقد)،
رايشنباخ (العقل مطبقاً على مادة الملاحظة).

## Summary

| Metric | Count |
| --- | --- |
| Entries audited | 25 |
| Entries changed | 0 |
| Entries flagged for a teacher | 4 |

## Changes

No explanation was edited. Every entry justifies the option marked correct, and
every attribution checked out (including the less common ones: روني طوم،
بيير تويليي، إيريك فايل، هايدغر). Wording was left untouched per the audit rules.

| key | old text | new text | reason |
| --- | --- | --- | --- |
| — | — | — | No clear error found |

## Flagged for a teacher

| key | issue for the teacher |
| --- | --- |
| knowledge:q10 | The question presents «إن للقلب حقائق يعجز العقل عن إدراكها» as a literal quotation, but Pascal's formula is «القلب له أسبابه التي لا يعرفها العقل». The explanation is correct (القلب يدرك المبادئ الأولى), so only the quotation wording needs a decision. |
| knowledge:q14 | The explanation is accurate on the conclusion (واجب مطلق), but justifies it by the collapse of trust and communication — a consequence-based reason. Kant grounds the duty of veracity in its unconditionality; a teacher may want a wording closer to that. |
| knowledge:q20 | The question credits Leibniz with a «دور ريادي وثوري» for opinion. The curriculum wording is «معرفة احتمالية» with a preparatory role; «ثوري» is unusual and may overstate the position. Explanation itself is consistent. |
| knowledge:q3, q5, q9, q10, q11, q18, q23 | Not an explanation defect: these question strings contain literal backslashes before the quotation marks (e.g. `\"الرأي\"`), which will display as `\"` in the UI. Also `knowledge:q12` option 2 reads «(ك النور)» instead of «كالنور». Needs a fix in the curriculum file, which was out of scope here. |

## Validation

| Check | Result |
| --- | --- |
| JSON parses | yes |
| Keys | 25 |
| Empty values | 0 |
| Latin letters in values | 0 |
| Longest value | 136 characters |
| Values over 420 characters | 0 |

## Applied by maintainer

After the audit, the three flagged content items were fixed:

- `knowledge:q10` — replaced the non-literal Pascal paraphrase with the canonical
  «القلب له أسبابه التي لا يعرفها العقل».
- `knowledge:q14` — explanation re-grounded in Kant's unconditionality and
  universalisability instead of the collapse of trust.
- `knowledge:q20` — question wording changed from «دوراً ريادياً وثورياً» to
  «دوراً تمهيدياً», matching the curriculum's probable/preparatory role.
- The literal backslashes before quotation marks (q3, q5, q9, q10, q11, q18,
  q23) and the `(ك النور)` typo (q12) were fixed in the curriculum JSON.
