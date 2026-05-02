# Next Step: الوضع البشري Subs Ready

**Structure**:
- `2nd-bac-human-condition-sub.json`: "الشخص" & "الغير" as separate modules (empty quiz).
- Types: `subModules?: Module[]` added.
- page.tsx: Loads as 6 items in 2nd-bac (hierarchical flat for now).

**To Make True Nested** (main → subs):
- Update page.tsx for conditional sub-list render.
- Or keep flat (simpler UX).

**Dev Clean**: Modules visible in الثانية باك.

Provide Qs for الشخص/الغير → Fill quiz[]. 

Test: localhost:3000 → 2nd-bac → Scroll to subs.
