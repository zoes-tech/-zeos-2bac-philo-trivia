# Morality module — explanation audit

Second-pass accuracy audit of `src/data/explanations/morality.json` against
`src/data/curriculum/2nd-bac-morality.json` (module `morality`, 58 questions,
الواجب / السعادة / الحرية).

Positions were checked against the standard Moroccan 2BAC lessons of
«مجزوءة الأخلاق» as taught in في رحاب الفلسفة / مباهج الفلسفة / منار الفلسفة
and summarised by AlloSchool and Kezakoo: كانط (الواجب والإرادة الخيرة، الكونية،
السعادة مثل أعلى للخيال، الإنسان غاية في ذاته، الحرية خاصية الموجودين العقلاء)،
غويو (الواجب فعل تأسيسي للحياة والشعور الفياض)، نيتشه (معيار الحياة، أصل القسوة،
المثل الزهدي)، هيوم (الواجبات الطبيعية والاصطناعية، رقة الذوق)، روسو (الضمير
الفطري، الكماليات)، هيغل (الواجب القانوني والأخلاقي)، برينتانو/دوركهايم/إنجلز
(مصادر الواجب)، أرسطو (السعادة فعل وفضيلة، الخير الأسمى)، ألان (السعادة صناعة
وإرادة وواجب نحو الغير)، شوبنهاور، راسل، أبيقور، ابن رشد وابن باجة (الحرية
والحتمية)، سبينوزا (وهم الحرية)، ميرلوبونتي (الحرية المشروطة)، مونتسكيو (الحرية
في حدود القانون وفصل السلط)، العروي (الحرية كإمكان وكقانون)، أرندت (الفضاء
العام)، هوبز (حالة الطبيعة)، سارتر (الحرية قدر والمسؤولية).

## Summary

| Metric | Count |
| --- | --- |
| Entries audited | 58 |
| Entries changed | 1 |
| Entries flagged for a teacher | 5 |

## Changes

One entry was corrected: the Kant entry on treating the human being as an end
added «دون رضاه», which makes the formula depend on consent. Kant's imperative
forbids treating humanity *merely* as a means, and consent does not lift that
(the classic counter-example is voluntary slavery). Removing the clause and
restoring «مجرد وسيلة» keeps the explanation faithful to the marked option and
to the categorical imperative. No other entry needed a change: every explanation
justifies the option marked correct, and the attributions that could be verified
were sound.

| key | old text | new text | reason |
| --- | --- | --- | --- |
| morality:q44 | مبدأ كانط الأخلاقي أن الإنسان غاية في ذاته لا وسيلة، فلا يجوز استخدامه لتحقيق غرض آخر دون رضاه. | مبدأ كانط الأخلاقي أن الإنسان غاية في ذاته لا وسيلة، فلا يجوز استخدامه مجرد وسيلة لتحقيق غرض آخر. | صيغة كانط تمنع اتخاذ الإنسان وسيلة بمحض إرادته أيضاً (مثال العبودية الطوعية)، فشرط الرضا ليس كانطياً؛ إضافة «مجرد» تحفظ دقة المبدأ. |

## Flagged for a teacher

| key | issue for the teacher |
| --- | --- |
| morality:q10 | السؤال ينسب إلى «برينتانو» أن مصدر الوعي الأخلاقي هو التجربة الاجتماعية والتربية. برنتانو ليس من أعلام هذا المحور في المقرر المغربي (المعتمد: روسو، نيتشه، فرويد/كينتشتاينر، وأحياناً برغسون ودوركهايم وفيبر)، وتصوره الأخلاقي يقوم على التمييز بين الحب والكراهية الصحيحين لا على التكوين الاجتماعي. يلزم حسم الأمر: إما تصحيح الاسم (دوركهايم أو كينتشتاينر) وإما تصحيح المفتاح إلى «الفطرة». لم يُعدَّل الشرح لأن أي صياغة ستخالف السؤال أو المفتاح. |
| morality:q25 | «السعادة مرتبطة بما نحياه الآن» ليست التصور الشائع لشوبنهاور، فهو يعدّ السعادة سلبية وغير قابلة للتحقق (تأرجح الحياة بين الألم والملل)، ما يجعل الخيار «مستحيلة» قابلاً للدفاع أيضاً. المفتاح الحالي يصلح فقط إذا كان الدرس يعتمد نصاً مدرسياً محدداً عن «الحاضر»؛ يُرجى تأكيده. |
| morality:q26 | صياغة الخيار الصحيح «قبل أن نكون سعداء» متناقضة حرفياً، والشرح يعيد تفسيرها ضمنياً بـ«قبل أن ننتبه إلى سعادتنا»، وهي صياغة لا تُعرف بها نصية لشوبنهاور. الأفضل إعادة صياغة السؤال/الخيار بدل ترك مفارقة لفظية. |
| morality:q30 | السؤال ينسب إلى «الفرابي» (والرسم الصحيح: الفارابي) أن السعادة في «الذوق والكشف الصوفيين»، وهذه أطروحة الغزالي/التصوف، بينما السعادة عند الفارابي كمال نظري وعقلي (الفضائل النظرية والفكرية)، أي أن الخيار «العقل والبرهان» هو الموافق له. الشرح الحالي لا يسمّي الفارابي (يقول «في هذا الطرح»)، لذا لا يضاعف الخطأ، لكن المفتاح غير سليم. يُقترح تغيير السؤال إلى الغزالي (حينها يصح الشرح كما هو) أو تغيير الجواب إلى «العقل والبرهان». |
| morality:q34 | السؤال يسأل عن «حقه في السعادة»، بينما المفتاح والشرح يتحدثان عن «الاستحقاق الأخلاقي»: عند كانط من يتخذ السعادة دافعاً إلى الواجب يفقد القيمة الأخلاقية لفعله، ولا يفقد حقاً في السعادة. يُستحسن توحيد المصطلح في نص السؤال. |

## Notes (not accuracy errors)

- `morality:q29` and `morality:q36` are the same Alain question (السعادة واجب نحو
  الغير) with different wording; redundancy only.
- The happiness set includes authors outside the ministry's core axis
  (أبيقور/سينيكا/فرويد في «البحث عن السعادة»؛ أرسطو/ابن مسكويه في «تمثلات
  السعادة»): هيوم، راسل، شوبنهاور، الفارابي. The Hume entry (`q24`, رقة الذوق)
  is faithful to Hume's essay on delicacy of taste and was left unchanged.

## Validation

```
JSON parses:            yes
Keys:                   58 (morality:q1 … morality:q58, no extras)
Empty values:           0
Values containing Latin: 0
Values over 420 chars:  0 (max length 126)
Values over ~35 words:  0
```

Changed entries: 1 (`morality:q44`). Flagged entries: 5 (`q10`, `q25`, `q26`,
`q30`, `q34`).

## Applied by maintainer

- **Changed answer keys (serious, documented):**
  - `q25` (Schopenhauer): key moved from «مرتبطة بما نحياه الآن» to «مستحيلة»,
    matching his pessimism; explanation rewritten.
  - `q26` (Schopenhauer): the paradoxical «قبل أن نكون سعداء» item was rewritten
    as «لا، فهي وهم لا يتحقق»; explanation aligned with `q25`.
- **Misattributions fixed:**
  - `q10` changed from «برينتانو» to «روسو», with the key moved to «الفطرة»;
    Brentano does not hold the social-formation thesis, and Durkheim already
    appears at `q12`.
  - `q30` changed from «الفرابي» to «الغزالي»; mystical taste/unveiling is the
    Ghazali thesis, not al-Farabi’s intellectual perfection.
- **Wording:** `q34` now asks when an action loses moral worth (Kant), instead of
  a «right to happiness».
- `q44` was already corrected by the audit itself.
- `q29`/`q36` remain near-duplicates; documented, not removed.
