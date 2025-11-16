---
name: Batch Instructions
description: Instructions for processing multiple text nodes
---

# Batch Processing Instructions

Process all provided text nodes and generate exactly **{{VARIANTS_COUNT}} variants** per text, following the guidelines and context provided above.

## OUTPUT FORMAT (STRICT)

**IMPORTANT**: Your response must be ONLY valid JSON. Do not include any text, explanation, or markdown before or after the JSON object.

Return a JSON object with this exact structure:

```json
{
  "variants": [
    {
      "nodeIndex": 1,
      "letter": "A",
      "text": "improved text variant A for first node"
    },
    {
      "nodeIndex": 1,
      "letter": "B",
      "text": "improved text variant B for first node"
    },
    {
      "nodeIndex": 1,
      "letter": "C",
      "text": "improved text variant C for first node"
    },
    {
      "nodeIndex": 2,
      "letter": "A",
      "text": "improved text variant A for second node"
    },
    {
      "nodeIndex": 2,
      "letter": "B",
      "text": "improved text variant B for second node"
    },
    {
      "nodeIndex": 2,
      "letter": "C",
      "text": "improved text variant C for second node"
    }
  ]
}
```

**JSON Structure Rules:**
- `variants`: Array containing all variant objects
- `nodeIndex`: Number indicating which text node (1-based index, matches input order)
- `letter`: Variant letter ("A", "B", "C", etc. - must match {{VARIANTS_COUNT}})
- `text`: The improved text content (string)

**CRITICAL JSON FORMATTING RULES:**

1. **Your ENTIRE response must be valid JSON**
   - No text before the opening `{`
   - No text after the closing `}`
   - No markdown code blocks (```json)
   - No explanations or comments

2. **Escape special characters properly:**
   - Double quotes inside text: `\"`
   - Backslashes: `\\`
   - Newlines: `\n`
   - Tabs: `\t`

3. **Generate exactly {{VARIANTS_COUNT}} variants per node**
   - If 3 variants requested and 2 nodes provided → 6 total variants
   - Order by nodeIndex: all variants for node 1, then all for node 2, etc.

4. **Preserve all formatting:**
   - Line breaks as `\n`
   - Bullet points with their symbols
   - Paragraph spacing
   - Emoji and special characters

## CRITICAL: Multi-Line Preservation ⚠️

**DO NOT condense multi-line content into a single line.**

This is a common error - avoid it:

❌ **WRONG** (condensed):
```json
{
  "text": "Simpan perubahan? Perubahan belum tersimpan akan hilang. Lanjutkan?"
}
```

✅ **CORRECT** (preserved with `\n`):
```json
{
  "text": "Simpan perubahan?\nPerubahan belum tersimpan akan hilang.\nLanjutkan?"
}
```

**Always preserve:**
- Line breaks using `\n` character
- Bullet points (•, -, *, 📚, etc.) and numbered lists
- Paragraph separation with `\n\n`
- Dialog/modal structures
- Multi-step instructions
- Empty lines for spacing

**Example with bullets:**

Original:
```
📚 Get 3 copy suggestions per UI element
📚 Add specific context to make it sharper
📚 Review and rephrase your placeholder texts
```

Correct JSON:
```json
{
  "nodeIndex": 1,
  "letter": "A",
  "text": "📚 Dapatkan 3 saran salinan untuk setiap elemen antarmuka\n📚 Tambahkan konteks spesifik agar lebih tajam\n📚 Tinjau dan perbaiki teks placeholder Anda"
}
```

**Example with dialog:**

Original:
```
Konfirmasi Hapus

Yakin ingin menghapus item ini?
Tindakan ini tidak dapat dibatalkan.
```

Correct JSON:
```json
{
  "nodeIndex": 1,
  "letter": "A",
  "text": "Konfirmasi Hapus\n\nYakin ingin menghapus item ini?\nTindakan ini tidak dapat dibatalkan."
}
```

## CONTEXT-AWARE PROCESSING

Consider the hierarchy and context of each text:

**Headlines** (depth: 1-2):
- Strong, action-oriented
- Concise (≤8 words for main headlines)
- Set clear expectations

**Helper Text** (depth: 3+):
- Supportive, clarifying details
- Match parent element's tone
- Add necessary context without redundancy

**In Lists or Groups**:
- Ensure consistency across sibling items
- Respect hierarchy (don't make child text more prominent than parent)

## GUIDELINE COMPLIANCE

Remember the strict hierarchy:
1. 📚 **Reference Standards** (highest) - terminology, formats
2. 🏛️ **Foundation Guidelines** - core principles
3. 👥 **Tribe Execution** - audience tone (can override Foundation for tone only)
4. 🤖 **Feature Guidelines** - context constraints

## COMPLETE EXAMPLE

**Input:**
```
Text Node 1: "Save changes?"
Text Node 2: "Your session will expire soon\nPlease save your work"
```

**Your Response (ENTIRE response, nothing else):**
```json
{
  "variants": [
    {
      "nodeIndex": 1,
      "letter": "A",
      "text": "Simpan perubahan?"
    },
    {
      "nodeIndex": 1,
      "letter": "B",
      "text": "Apakah ingin menyimpan perubahan?"
    },
    {
      "nodeIndex": 1,
      "letter": "C",
      "text": "Simpan data yang telah diubah?"
    },
    {
      "nodeIndex": 2,
      "letter": "A",
      "text": "Sesi Anda akan segera berakhir\nHarap simpan pekerjaan Anda"
    },
    {
      "nodeIndex": 2,
      "letter": "B",
      "text": "Sesi hampir habis\nSimpan pekerjaan untuk menghindari kehilangan data"
    },
    {
      "nodeIndex": 2,
      "letter": "C",
      "text": "Waktu sesi terbatas\nSegera simpan untuk mencegah data hilang"
    }
  ]
}
```

## VALIDATION CHECKLIST

Before responding, verify:
- [ ] Response is ONLY valid JSON (no text outside)
- [ ] Exactly {{VARIANTS_COUNT}} variants per node
- [ ] All special characters properly escaped
- [ ] Multi-line text uses `\n` correctly
- [ ] nodeIndex matches input order (1-based)
- [ ] Letters are sequential (A, B, C, ...)
- [ ] All guidelines followed (Reference > Foundation > Tribe > Feature)
- [ ] Each variant offers different approach
- [ ] All text is proper Bahasa Indonesia (KBBI/PUEBI)
