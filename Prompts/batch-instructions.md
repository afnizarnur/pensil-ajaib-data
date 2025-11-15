---
name: Batch Instructions
description: Instructions for processing multiple text nodes in batch
---

# Batch Processing Instructions

Process all provided text nodes and generate exactly **{{VARIANTS_COUNT}} variants** per text, following the guidelines and context provided above.

## OUTPUT FORMAT (STRICT)

Use this exact format:

```
1.A <variant 1 for first text>
1.B <variant 2 for first text>
1.C <variant 3 for first text>
[... up to {{VARIANTS_COUNT}} variants]

2.A <variant 1 for second text>
2.B <variant 2 for second text>
2.C <variant 3 for second text>
[... up to {{VARIANTS_COUNT}} variants]

...and so on for all texts
```

**Formatting Rules:**
- Start each line: `[NUMBER].[LETTER] [content]`
- ONE space after the letter-dot
- Output ONLY the improved text (no labels, IDs, colons, quotes, or layer names)
- Blank line between text groups for readability
- Process ALL texts in order listed

## CRITICAL: Multi-Line Preservation ⚠️

**DO NOT condense multi-line content into a single line.**

This is a common error - avoid it:

❌ **WRONG** (condensed):
```
Original (3 lines):
"Simpan perubahan?
Perubahan belum tersimpan akan hilang.
Lanjutkan?"

Bad output:
1.A Simpan perubahan? Perubahan belum tersimpan akan hilang. Lanjutkan?
```

✅ **CORRECT** (preserved):
```
1.A Simpan perubahan?
Perubahan belum tersimpan akan hilang.
Lanjutkan?
```

**Always preserve:**
- Line breaks (`\n`)
- Bullet points (•, -, *, 📚, etc.) and numbered lists
- Paragraph separation
- Dialog/modal structures
- Multi-step instructions
- Empty lines for spacing

**Example with bullets:**
```
Original:
📚 Get 3 copy suggestions per UI element
📚 Add specific context to make it sharper
📚 Review and rephrase your placeholder texts

Correct:
1.A 📚 Dapatkan 3 saran salinan untuk setiap elemen antarmuka
📚 Tambahkan konteks spesifik agar lebih tajam
📚 Tinjau dan perbaiki teks placeholder Anda
```

## CONTEXT-AWARE PROCESSING

Use the context information provided for each text:

### Hierarchy Depth (indicates importance level)

- **depth: 0-1** → Headlines, primary CTAs
  - Use strong, attention-grabbing language
  - Direct and impactful
  - Clear call to action

- **depth: 2-3** → Section headers, secondary actions
  - Use clear, organizing language
  - Balanced and structured
  - Guide user through interface

- **depth: 4+** → Helper text, tertiary content
  - Use supportive, detailed language
  - Explanatory and informative
  - Provide context and assistance

### Parent Container (indicates UI element type)

- **Button, Link** → Action-oriented, concise, concrete verbs
- **Dialog, Modal** → Clear decision context, explain consequences
- **Toast, Snackbar** → Brief, informative, status updates
- **Empty State** → Encouraging, actionable, opportunity framing
- **Error Message** → Specific problem, actionable solution, empathetic tone
- **Form Field** → Clear expectation, helpful placeholder/label

## VARIANT GENERATION STRATEGY

Generate {{VARIANTS_COUNT}} distinct variants offering different approaches:

### Vary by Tone (as allowed by Tribe Execution rules)

- **Formal/Professional**: Precise, respectful, authoritative
- **Balanced/Standard**: Clear, friendly, approachable
- **Accessible/Casual**: Conversational, empathetic, warm (if tribe allows)

### Vary by Focus

- **Action-Oriented**: Emphasizes what user should do
- **Benefit-Focused**: Highlights value and outcomes
- **Empathetic**: Acknowledges user feelings and context

### Vary by Structure

- **Direct**: Straightforward statement or command
- **Explanatory**: Provides context and reasoning
- **Question-Based**: Engages user with questions (when appropriate)

**All variants must:**
- Follow the same guidelines (Reference, Foundation, Tribe Execution, Features)
- Preserve the same meaning and facts
- Be production-ready and complete
- Pass all compliance checks

## MANDATORY PRE-OUTPUT VALIDATION

For EACH variant, verify before outputting:

### Language & Grammar Compliance
- [ ] 100% Bahasa Indonesia (KBBI/PUEBI compliant)
- [ ] No English words (unless glossary-approved)
- [ ] Grammatically correct and natural sounding

### Guideline Compliance
- [ ] **Terminology**: All terms match glossary
  - Required terms used correctly
  - Forbidden terms completely eliminated
- [ ] **Formats**: Follow Reference/style-standards.md exactly
  - Dates: per specified format
  - Times: per specified format (include timezone if required, e.g., "14.30 WIB")
  - Numbers: per specified format (thousands separator, decimals)
  - Currency: per specified format (e.g., "Rp" with proper spacing)
- [ ] **Tone**: Matches Tribe Execution user profile
  - Formal vs balanced vs casual (as specified)
- [ ] **Addressing**: Correct per Tribe rules
  - Kamu vs Anda vs other forms
  - Consistent throughout related elements

### Structure Preservation
- [ ] Multi-line structure NOT condensed
- [ ] Placeholders intact: `{var}`, `{{var}}`, `%s`, `$variable`, etc.
- [ ] Markup preserved: `<b>`, `<i>`, `*`, `**`, etc.
- [ ] Code/keys/IDs unchanged: `error_code_404`, `api_key`, etc.
- [ ] Bullet points and list formatting maintained

### Quality Standards
- [ ] Meaning preserved (no invented features or data)
- [ ] Facts accurate (no altered numbers, dates, or promises)
- [ ] Clarity appropriate for target audience
- [ ] Actionable (especially for errors and CTAs - provide clear next steps)
- [ ] Character limits respected (if specified in context)

## SPECIAL HANDLING BY TEXT TYPE

### Error Messages
- Explain what happened clearly (avoid technical jargon)
- Provide specific, actionable next steps
- Use empathetic tone (as allowed by Tribe rules)
- Include helpful details (what to check, who to contact)

**Example variants:**
- Variant A: Technical/precise → "Koneksi ke server gagal. Periksa jaringan Anda."
- Variant B: Balanced clarity → "Tidak dapat terhubung. Periksa koneksi internet Anda dan coba lagi."
- Variant C: Empathetic → "Sepertinya ada masalah dengan koneksi. Periksa jaringan Anda dan kami akan coba lagi."

### Call-to-Action (CTA) Buttons
- Use concrete action verbs
- Keep concise (2-4 words typically)
- Make outcome clear
- Create urgency when appropriate

**Example variants:**
- Variant A: Action-focused → "Simpan Perubahan"
- Variant B: Benefit-focused → "Simpan Progres Saya"
- Variant C: Encouraging → "Ya, Simpan"

### Empty States
- Acknowledge the empty state
- Explain why it's empty (if not obvious)
- Provide clear action to resolve or begin

**Example variants:**
- Variant A: Informative → "Belum ada tugas. Guru akan menambahkan tugas di sini."
- Variant B: Action-oriented → "Tidak ada tugas saat ini. Periksa lagi nanti atau hubungi guru."
- Variant C: Opportunity → "Belum ada tugas! Gunakan waktu ini untuk mengulas materi."

### Multi-Step Instructions
- Maintain numbered or bulleted structure
- Keep steps in logical order
- Preserve step granularity (don't combine or split steps)
- Ensure each step is actionable

### Very Short Text (< 5 words)
- Variants may be similar but with subtle differences
- Focus on word choice and tone nuance
- Ensure each variant is still distinct and valid

## CONSISTENCY RULES FOR BATCH PROCESSING

When processing multiple text nodes in a single batch:

- **Maintain consistent tone** across related UI elements in the same flow
- **Use glossary terms uniformly** throughout (don't vary terminology)
- **Respect visual hierarchy** (headlines should feel more prominent than body text)
- **Consider user flow sequence** (text should make sense in the order presented)

## FINAL COMPLIANCE SWEEP

Before submitting your output, perform one final check across ALL variants:

1. **Language scan**: Any English words? → Replace with Bahasa Indonesia
2. **Format verification**: Dates/times/numbers/currency correct? → Standardize per guidelines
3. **Addressing consistency**: Kamu/Anda usage consistent? → Unify per Tribe rules
4. **Multi-line check**: Line breaks preserved? → Restore if condensed
5. **Placeholder verification**: All `{variables}` and markup intact? → Fix if broken
6. **Forbidden terms scan**: Any forbidden terms? → Replace with required alternatives

## OUTPUT DISCIPLINE

**Output ONLY the formatted variants:**
- No preamble or introduction
- No explanations or reasoning
- No commentary or notes
- No quotes around the text
- No labels like "Text:", "Content:", "Improved:"
- No layer names, element IDs, or technical metadata

Process ALL texts in order before outputting. Your output should be pure, formatted variants ready for direct use in the UI.

## REMEMBER

- **Speed AND quality**: Process efficiently but maintain all standards
- **Independence**: Each variant should stand alone as a complete option
- **Format precision**: Follow `number.letter` format exactly
- **User first**: Every variant must serve user needs effectively
- **Multi-line preservation**: NEVER condense multi-line text into single lines
- **Guideline hierarchy**: Reference > Foundation > Tribe Execution > Features
