# 🖥️ UI Component Specifications
_Only when building specific components_
_Last updated: 11 Sept 2025_

## [UI-CTA] CTA Buttons
**Rules:**
- MUST use action verbs
- Max 2-3 words
- Title Case, no period
- Context-specific and direct

**Universal CTAs:**
- **Login**: Masuk
- **Back**: Kembali / Sebelumnya
- **Search**: Cari
- **Save**: Simpan
- **Share**: Bagikan
- **Next**: Selanjutnya
- **Refresh**: Muat Ulang
- **Home**: Kembali ke Beranda

## [UI-TTP] Tooltip
**Rules:**
- Max 1-2 sentences
- Sentence case only
- Provide brief, relevant info
- Avoid excessive detail or jargon

## [UI-TST] Toast Messages (Snackbar)
**Rules:**
- Max 1 sentence or 2 lines
- Add CTA only if essential
- Prioritize clarity and relevance

**Common Patterns:**
- Success: "Berhasil [action]"
- Error: "Terdapat kendala. Silakan coba lagi."
- Info: "[Status update message]"

## [UI-CNF] Confirmation Dialog
**Structure:**
1. **Clear question as title**
2. **Consequence explanation**
3. **Specific action CTA + Cancel option**

**Rules:**
- Clarify action + consequence
- Use exact verbs in CTA
- Avoid unnecessary details

## [UI-EMP] Empty State
**Structure:**
1. **Clear title** explaining why empty
2. **Helpful subtitle** with next steps
3. **Optional CTA** for primary action

**Rules:**
- Explain why the screen is empty
- Provide clear next steps
- Stay optimistic and solution-oriented

## [UI-ERR] Error Messages
**Rules:**
- Avoid technical jargon or error codes
- Keep tone neutral, not blaming
- Provide actionable solutions

**Standard Errors:**
- **General**: "Terdapat Kendala Sistem. Silakan coba beberapa saat lagi."
- **Connection**: "Terdapat Gangguan Koneksi. Periksa kembali koneksi internetmu dan muat ulang dalam beberapa saat."
- **404**: "Halaman Tidak Ditemukan. Halaman ini sedang tidak dapat diakses..."

## [UI-HLP] Helper Text (Form Input)
**Rules:**
- Simple and direct
- Reinforce the input's purpose
- Use positive phrasing

**Pattern:**
```
**[Field Name]**
[Clear instruction or example]
```

## [UI-LOD] Loading States
**Rules:**
- Be practical and straightforward
- Be clear about what user can expect
- Give assurance

**Pattern:**
```
**[Action] Sedang [Process]**
[Brief explanation if needed]
[Optional tip for better experience]
```

## [UI-CHK] Checkboxes
**Rules:**
- Use positive statement format
- Short and unambiguous
- Explain consequences where needed

## [UI-ONB] Onboarding Screens
**Rules:**
- Explain benefits clearly
- Encourage first actions
- One short paragraph per screen
- Use "Mulai Sekarang" type CTAs

## [UI-INF] Information Cards
**Rules:**
- Clear title
- Max 12 concise sentences
- Active voice
- Scannable format

## [UI-CMK] Coach Marks
**Rules:**
- Be action-oriented
- Limit to necessary guidance only
- No fluff
- Point to specific UI elements
