---
name: Batch Instructions
description: Instructions for processing multiple text nodes in batch
---

# Batch Processing Instructions

You will receive multiple text nodes to improve in a single request. Process them efficiently and consistently.

## INPUT FORMAT

Each text node will include:
- **Original text**: The current copy
- **Context information**:
  - Hierarchy (parent containers)
  - Hierarchy depth (UI nesting level)
  - Position (x, y, width, height)
  - Parent names (breadcrumb path)

## OUTPUT FORMAT (CRITICAL)

Generate **exactly {{VARIANTS_COUNT}} variants** for EACH text node.

**Required format:**
```
1.A [First variant for text #1]
1.B [Second variant for text #1]
1.C [Third variant for text #1]

2.A [First variant for text #2]
2.B [Second variant for text #2]
2.C [Third variant for text #2]

3.A [First variant for text #3]
3.B [Second variant for text #3]
3.C [Third variant for text #3]
```

**Format rules:**
- Number = text node index (1-based)
- Letter = variant (A, B, C, ...)
- Space after the letter prefix
- Each variant on its own line
- Blank line between text nodes for readability

## PROCESSING STRATEGY

### For Each Text Node:

1. **Understand Context**
   - Note hierarchy depth (0-1 = prominent, 4+ = nested detail)
   - Consider parent container type (button, form, card, etc.)
   - Review any design context provided

2. **Apply All Guidelines**
   - Reference standards (terminology, glossary)
   - Foundation (brand voice, core principles)
   - Tribe execution (audience-specific tone)
   - Feature guidelines (if AI product, etc.)

3. **Generate Diverse Variants**
   - Variant A: More formal/conservative approach
   - Variant B: Balanced/standard approach
   - Variant C: More casual/friendly approach
   - **All must comply with ALL guidelines**

4. **Quality Check Each Variant**
   - Proper Bahasa Indonesia (KBBI)
   - No forbidden terms
   - Within character limits (if specified)
   - Appropriate tone for audience
   - Grammatically correct (PUEBI)

## CONSISTENCY RULES

When processing multiple nodes in batch:

- **Maintain consistent tone** across related UI elements
- **Use glossary terms uniformly** throughout
- **Respect visual hierarchy** (headings vs body text)
- **Consider user flow** (sequence of text nodes)

## SPECIAL CASES

### Very Short Text (< 5 words)
- Variants may be similar but with subtle differences
- Focus on word choice and tone nuance
- Ensure each variant is still distinct

### Error Messages
- Variant A: Technical/precise
- Variant B: Balanced clarity
- Variant C: Empathetic/supportive
- All must help user understand and resolve issue

### Call-to-Action (CTA) Buttons
- Variant A: Action-focused (verb-led)
- Variant B: Benefit-focused
- Variant C: Friendly/encouraging
- All must clearly indicate action

### Empty States
- Variant A: Informative (what/why)
- Variant B: Action-oriented (what to do)
- Variant C: Encouraging (opportunity framing)

## REMEMBER

- **Speed AND quality**: Process efficiently but maintain standards
- **Independence**: Each variant should stand alone
- **Format precision**: Follow number.letter format exactly
- **User first**: Every variant must serve user needs effectively
