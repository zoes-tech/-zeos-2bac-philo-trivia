# Politics module — explanation audit

Second-pass accuracy audit of `src/data/explanations/politics.json` against
`src/data/curriculum/2nd-bac.json` (module `politics`, 86 questions, محاور
الدولة، الحق والعدالة، العنف).

Positions were checked against the standard Moroccan 2BAC lessons of
«مجزوءة السياسة» as taught in في رحاب الفلسفة / مباهج الفلسفة / منار الفلسفة
and summarised by AlloSchool, Philomaroc, lfalsafa, Kezakoo, moutamadris and
philo-school: إسبينوزا (غاية الدولة الأمن والحرية)، هوبز (التعاقد وحالة الطبيعة،
الذئب لأخيه)، هيجل (الدولة كلّ أخلاقي ونقد التصور التعاقدي)، التوسير (الجهاز
القمعي والجهاز الإيديولوجي)، فوكو (السلطة شبكة علاقات)، مونتسكيو (فصل السلط)،
ميكيافيلي (الأسد والثعلب)، ابن خلدون (السياسة رفق واعتدال وعلاقة عادلة)،
إنجلز وماركس (الدولة نتاج الصراع الطبقي، الاقتصاد أساس العنف)، ماكس فيبر
(احتكار العنف المشروع، أنماط المشروعية)، جاكلين روس (دولة الحق: القانون والحق
وفصل السلط واحترام الشخص)، عبد الله العروي (الشرعية والإجماع)، كيلسن (الحق
الوضعي النسبي)، أرسطو (العدالة فضيلة والإنصاف مصحح للقانون)، أفلاطون (كلٌّ
يؤدي وظيفته)، ألان (المساواة أمام القانون)، شيشرون (القانون الطبيعي/الفطرة)،
ماكس شيلر (الإنصاف)، راولز (مبدأان والتفاوت لصالح الأقل حظاً)، هايك (نقد
العدالة التوزيعية والقواعد العامة)، إيف ميشو (العنف ملازم للتاريخ وتنوع أشكاله)،
بورديو (العنف الرمزي بموافقة الضحية)، لورنتز (العدوانية الغريزية والكوابح)،
كلوزوفيتش (الحرب استمرار للسياسة)، جيرار (الرغبة المحاكية)، فرويد (الحق قوة
الجماعة)، غاندي (اللاعنف)، كانط (رفض حق المقاومة)، إيريك فايل (الفلسفة تختار
اللاعنف).

## Summary

| Metric | Count |
| --- | --- |
| Entries audited | 86 |
| Entries changed | 1 |
| Entries flagged for a teacher | 8 |

## Changes

One entry was edited. `politics:q42` restated the marked option twice («القوانين
التي يكون الجميع أمامها سواسية» then «المساواة القانونية هي معيار العدالة»)
without giving Alain's reason; the new text states that reason (one rule applied
to all, and privilege as what breaks equal rights). All other entries justify the
marked option and their attributions checked out, so they were left untouched.

| key | old text | new text | reason |
| --- | --- | --- | --- |
| politics:q42 | القوانين العادلة عند ألان هي التي يكون الجميع أمامها سواسية، فالمساواة القانونية هي معيار العدالة ورفض الامتياز. | لأن القانون العادل عند ألان قاعدة واحدة تُطبَّق على جميع المواطنين، فأي امتياز يجعل الحقوق متفاوتة وينقض مساواة الجميع أمام القانون. | The old second clause only rephrased the key. The new text gives the reason the key needs: a single rule for all, and privilege as the negation of equal rights. |

## Flagged for a teacher

| key | issue for the teacher |
| --- | --- |
| politics:q64 | The stem asks how Lorenz sees human aggressiveness and marks «مكتسبة وفي نفس الوقت غريزية». In the Moroccan lesson Lorenz is the biological position: aggressiveness is غريزية/فطرية, shared with animals, and what humans lack is innate *brakes* (كوابح), which are cultural. Option 2 «غريزية فقط» is therefore also defensible, and the explanation's «مكتسبة» half is not Lorenz. The answer key needs a decision; the explanation was left as is so it does not contradict the key. |
| politics:q68 | The stem («ماذا يكشف التاريخ البشري عن العنف حسب ماركس؟») does not fit the marked answer «مسارات متعرجة ومعقدة», which says nothing about violence; the explanation is correspondingly vague («حركته الجدلية يقطعها الصراع الطبقي»). The item looks like a truncation and should be rewritten rather than explained. |
| politics:q51 | The marked option («لأن المساواة قد تصبح جوراً») repeats the question word for word, so it cannot be distinguished from a non-answer; the explanation gives the real reason (treating unlike cases alike). Editorial fix to the option is needed. |
| politics:q33 | Kelsen's relativism is normative: validity comes from a higher norm up to the basic norm, not from «موازين القوى». The explanation's «توازن مصالح مؤقت بين القوى» is closer to realism or Marxism. If the textbook uses this formula for Kelsen, keep it; otherwise the attribution should be reviewed. |
| politics:q55 | «نعم، كل الناس يتساوون» is absolute and sits awkwardly beside q56, which accepts inequality for the worst-off. The explanation correctly narrows equality to moral worth and basic rights, but the option wording may mislead; consider «متساوون في الحقوق الأساسية». |
| politics:q39 | Attributing to Hayek a link between justice and «الديمقراطية» is a simplification: he grounds justice in general abstract rules and the rule of law, and warns that a democratic majority can be arbitrary. The explanation is otherwise accurate (justice is not about distributing wealth). Worth checking against the lesson's exact wording. |
| politics:q62 | «يجعلها مألوفة ومشروعة لدى الجمهور» overstates Michaud, who describes banalisation, visibility and a culture of violence rather than legitimisation. «مألوفة» carries the point; a teacher may want «ومقبولة» or the removal of «ومشروعة». |
| politics:q26, politics:q27, politics:q63, politics:q84 | Not explanation defects: the question/option strings are garbled. q26 «حق إصفاء المشروعية على أية وسيلة», q27 «التنظيمي الإداري والذهني السلوكي الأخلاقي», q63 «عنف يحقق نتائج أكثر قياساً إلى العنف المادي», q84 «ماذا يختار الفيلسوف بوصفه اختياراً للخطاب العقلي المتماسك». They are readable only with difficulty and need editorial rewriting in the curriculum file. |

Two further points were checked and left alone: q2's explanation justifies
freedom-under-law without naming the key's «عدم التصرف ضد سلطة الدولة», which is
an acceptable bridge for Spinoza; and q30/q31 are near-duplicates (قوة/طبيعة
شريرة) but not contradictory.

## Validation

| Check | Result |
| --- | --- |
| JSON parses | yes |
| Keys | 86 |
| Keys match curriculum question ids | yes (q1–q86) |
| Empty values | 0 |
| Latin letters in values | 0 |
| Longest value | 156 characters (`politics:q3`) |
| Values over 420 characters | 0 |
| `correctAnswer` indexes within options range | 86/86 |

## Applied by maintainer

Clear items were fixed in the curriculum/explanation files; contested positions that
need the textbook were left flagged.

- **Changed answer keys (serious, documented):**
  - `q64` (Lorenz): the key moved from «مكتسبة وفي نفس الوقت غريزية» to
    «غريزية فقط», matching the lesson’s biological thesis (innate aggression,
    culturally supplied brakes). Explanation rewritten accordingly.
  - `q33` (Kelsen): the stem now asks about «القوانين الوضعية»; the key moved to
    «بالزمان والمكان», matching Kelsen’s normative relativism instead of
    «موازين القوى» (realist/Marxist). Explanation rewritten.
- **Wording repairs:** `q26`, `q27`, `q51`, `q55`, `q63`, `q84` (garbled or
  question-repeating options), `q39` (Hayek: general rules/rule of law, not
  democracy), `q62` (Michaud: familiar/visible, not «مشروعة»).
- **Rewritten item:** `q68` (Marx) now asks how Marx describes the course of
  history, with coherent options; explanation grounded in dialectical/class
  conflict.
