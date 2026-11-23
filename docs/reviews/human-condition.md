# Human condition module — explanation audit

Second-pass accuracy audit of `src/data/explanations/human-condition.json` against
`src/data/curriculum/2nd-bac.json` (module `human-condition`, 30 questions,
محورا الشخص والغير).

Positions were checked against the standard Moroccan 2BAC lessons of
«مجزوءة الوضع البشري» as taught in في رحاب الفلسفة / مباهج الفلسفة / منار الفلسفة
and summarised by AlloSchool, Philomaroc, profsalmi and lfalsafa:
جول لاشوليي (الهوية = دوام الطبع/المزاج + ترابط الذكريات، نقد الجوهر الثابت)،
ديكارت (الفكر أساس الهوية)، فرويد (الهو/الأنا/الأنا الأعلى والعالم الخارجي)،
إيمانويل مونيي (الشخصنة، الشخص مقابل الشيء)، كانط (الكرامة والسعر، الغاية في ذاته)،
سبينوزا (وهم الحرية، الجهل بالأسباب)، سارتر (الوجود يسبق الماهية، النظرة والتشييء،
«الآخرون هم الجحيم»)، هايدغر (الهم/das Man والذوبان في الجماعة)، مالبرانش (القياس
على الذات والتخمين)، ميرلوبونتي (الجسد والتواصل والعالم البينذاتي)، أرسطو (صداقة
الفضيلة، الإنسان مدني بطبعه)، هيغل (السيد والعبد، الصراع من أجل الاعتراف).

## Summary

| Metric | Count |
| --- | --- |
| Entries audited | 30 |
| Entries changed | 1 |
| Entries flagged for a teacher | 3 |

## Changes

One attribution was made explicit. The explanation for `q22` asserted that the
relation with the other «ليست صراعاً», while the stem attributes conflict to
Merleau-Ponty; naming Sartre as the holder of the conflict thesis keeps the
explanation accurate and shows the contrast the question is testing. All other
entries justify the marked option and their attributions checked out, so they
were left untouched.

| key | old text | new text | reason |
| --- | --- | --- | --- |
| human-condition:q22 | العلاقة بالغير ليست صراعاً على الوعي، بل تفاعل مشترك في عالم بينذاتي نعيشه معاً بالجسد واللغة. | على خلاف سارتر، يرى ميرلوبونتي أن العلاقة بالغير ليست صراعاً على الوعي، بل تفاعل مشترك في عالم بينذاتي نعيشه معاً بالجسد واللغة. | أطروحة الصراع هي أطروحة سارتر، وميرلوبونتي ينتقدها ويدافع عن التواصل؛ الإضافة تُصحح الإسناد وتُبقي الجواب المعلَّم صحيحاً. |

## Flagged for a teacher

| key | issue for the teacher |
| --- | --- |
| human-condition:q22 | The stem says «يرى ميرلوبونتي أن العلاقة مع الغير قائمة على الصراع، ويدافع عن عالم البينذاتي», which is internally contradictory and misattributes the conflict thesis. In the curriculum, الصراع is Sartre's/Hegel's position and ميرلوبونتي holds التواصل والتعايش. The marked answer (العالم البينذاتي) is correct; the stem should be reworded, e.g. «على خلاف سارتر، يدافع ميرلوبونتي عن عالم…». Explanation was adjusted but the stem still needs a decision. |
| human-condition:q29 | Option 2 reads «الصراع وجدلية التفاضل»; «جدلية التفاضل» is not the usual curriculum term for the master–slave struggle (جدلية الاعتراف / جدلية السيد والعبد). The explanation is consistent with the option, but the wording may confuse students. |
| human-condition:q18 | Language only: «وتصادره على إمكاناته الحرة» is ungrammatical; «وتصادر إمكاناته الحرة» is meant. The philosophical content (النظرة التشييئية) is correct. |

A separate defect seen during this audit — literal backslashes before quotation
marks in 11 question/option strings (q4, q5, q7, q14, q16, q18, q19, q25, q26,
q28, q30) — was fixed in `src/data/curriculum/2nd-bac.json` by another change
while this review was running, and is no longer present. It is recorded here
only for traceability.

## Validation

| Check | Result |
| --- | --- |
| JSON parses | yes |
| Keys | 30 |
| Keys match curriculum question ids | yes (q1–q30) |
| Empty values | 0 |
| Latin letters in values | 0 |
| Longest value | 128 characters (`human-condition:q22`) |
| Values over 420 characters | 0 |
| `correctAnswer` indexes within options range | 30/30 |

## Applied by maintainer

- `human-condition:q22` — stem reworded to «على خلاف سارتر…», removing the false
  attribution of the conflict thesis to Merleau-Ponty.
- `human-condition:q29` — correct option reworded from «جدلية التفاضل» to
  «جدلية الاعتراف», the standard term.
- `human-condition:q18` — explanation grammar fixed («وتقيّد إمكاناته» instead of
  «وتصادره على إمكاناته»).
