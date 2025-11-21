
This repository contains the **authoritative copy guidelines** for PENSILAJAIB Figma Plugin.  
All files here are treated as references for generating and validating content.

**Current Implementation:** Ruang Murid tribe (Phase 1)

---

## Rule Hierarchy

When multiple sources exist, always follow this strict priority order:

**Priority Order (0 = highest authority, 6 = lowest):**

### 0. ⚠️ Legal Compliance (OVERRIDES ALL)
- **Source:** `Core Guidelines/ruang-murid-tribe/tribe.md` (Legal Compliance section)
- **Mandatory:** Bahasa Indonesia requirement (KBBI/PUEBI)

### 1. 📚 Reference Standards (Terminology & Style)
- `Reference/style-standards.md` - Formatting, numbers, dates, capitalization
- `Core Guidelines/ruang-murid-tribe/glossary.md` - Official terminology (GLO-XXX codes)
- `Reference/error-templates.md` - Error message patterns
- `Reference/ui-component-specs.md` - Component specifications

### 2. 🏛️ Foundation Guidelines (Core Principles)
- `Core Guidelines/general-foundation.md` - Universal principles, tone meters
- `Core Guidelines/ruang-murid-tribe/tribe.md` - Ruang Murid context, brand voice

### 3. 👥 Tribe Execution (Audience-Specific)
- `Core Guidelines/ruang-murid-tribe/user/murid.md` - Student-focused
- `Core Guidelines/ruang-murid-tribe/user/guru.md` - Teacher-focused
- `Core Guidelines/ruang-murid-tribe/user/mitra.md` - Partner-focused
- `Core Guidelines/ruang-murid-tribe/user/unit-kerja.md` - Work unit-focused
- Note: Plugin provides {{AUDIENCE_TYPE}} to select correct file

### 4. 🤖 Feature Guidelines (Context-Specific Constraints)
- `Feature Guidelines/ai-powered-features.md`

### 5. 🎨 UI Components (Inferred from Layer Metadata)
- `Reference/ui-component-specs.md`
- Component type detected from Figma layer names

### 6. 💡 Fallback Principles (Always Active)
- Clarity, empathy, inclusivity, actionability, accessibility

---

## Conflict Resolution

When guidelines from different priorities conflict:

### Primary Rule: Lower Number Wins
Priority 0 > Priority 1 > Priority 2 > Priority 3 > Priority 4 > Priority 5 > Priority 6

### Dimension-Specific Overrides:

**Terminology & Word Choice:**
- Priority 1 (📚 Glossary) ALWAYS wins
- No exceptions - glossary term overrides all others for word choice
- Adjust capitalization to fit sentence structure (not from glossary)

**Formality & Pronouns:**
- Priority 3 (👥 Tribe Execution) wins over Priority 2 (🏛️ Foundation)
- Audience-specific formality (Anda vs kamu) overrides general brand voice

**Character Limits:**
- Priority 5 (🎨 UI Component Specs) wins over Priority 1 (📚 Style Standards)
- Component-specific limits are stricter

**Tone & Emotional Expression:**
- Priority 3 (👥 Tribe Execution) wins over Priority 2 (🏛️ Foundation)
- Balance with Priority 5 (🎨 Component Type) - e.g., errors stay clear even if audience prefers friendly

### Resolution Examples:

| Conflict | Resolution | Winner |
|----------|------------|--------|
| Glossary says "pembelajaran", Murid execution prefers "belajar" | Use "pembelajaran" | 📚 Priority 1 |
| Style says "Anda", Murid execution says "kamu" | Use "kamu" | 👥 Priority 3 |
| Style says ≤25 chars, UI spec says ≤20 chars (button) | Use ≤20 chars | 🎨 Priority 5 |

### When Still Unclear:
Ask: "Which choice makes the user's task clearer/easier?" → Choose that one (Priority 6 💡)

---

## UI Component Types & Character Limits

**Refer to `Reference/ui-component-specs.md`** for the strict character limits and component codes.
**Component Detection:** AI infers component type from Figma `layerName` keywords (see System Prompt for detection rules)
**Enforcement:**
- ALL variants must stay within limit
- If can't fit: Use shortest grammatical form
- Strategies: Remove redundancy, shorter synonyms, remove articles
---

## Glossary Term Usage

**Source:** `Core Guidelines/ruang-murid-tribe/glossary.md`

**Rules:**
- Use exact glossary term for **word choice/meaning**
- **Adjust capitalization** to fit sentence structure:
  - Sentence start: Capitalize first letter
  - Mid-sentence: Lowercase (unless proper noun)
  - Title case: Follow `Reference/style-standards.md` rules

**Example:**
- Glossary: "pembelajaran" (GLO-023)
- Sentence start: "Pembelajaran dimulai pukul 08.00"
- Mid-sentence: "Mulai pembelajaran sekarang"
- Title: "Panduan Pembelajaran"

**If term not in glossary:** Use proper KBBI/PUEBI Indonesian, do not flag as error.

**Consistency:** If same concept appears in multiple text nodes, use SAME glossary term across all nodes.

---

## Repository Structure

### Core Guidelines
- `general-foundation.md` — Legal basis, core principles, tone standards
- `ruang-murid-tribe/`
  - `tribe.md` — Platform context, legal compliance section
  - `glossary.md` — Complete terminology (GLO-001 to GLO-XXX)
  - `user/`
    - `murid.md` — Student execution, tone meters, behavioral insights
    - `guru.md` — Teacher execution
    - `mitra.md` — Partner execution
    - `unit-kerja.md` — Work unit execution

### Reference
- `style-standards.md` — Formatting, time, currency rules
- `ui-component-specs.md` — UI component specifications, character limits
- `error-templates.md` — Error message templates

### Feature Guidelines
- `ai-powered-features.md` — AI feature guidelines and constraints

### Examples
- `component-copy-samples.md` — UI component copy samples
- `dialog-examples.md` — Dialog and confirmation examples
- `onboarding-samples.md` — User onboarding flows
- `toast-message-library.md` — Toast/snackbar message library

**Use examples:**
- AFTER generating variant with hierarchy rules
- For structure/format reference only
- Adapt, don't copy verbatim

**Don't use examples:**
- If conflicts with glossary (📚 Priority 1 wins)
- If conflicts with audience tone (👥 Priority 3 wins)
- As substitute for hierarchy rules

---

## Quality Assurance & Validation

### System Validation (Objective Checks)

| Category | Checkpoint | Expected Behavior |
|-----------|-------------|------------------|
| **Legal Compliance** | No violation of Landasan Hukum, 100% Bahasa Indonesia | ⚠️ Flag: "LEGAL CONFLICT: [issue]" |
| **Terminology** | Glossary terms used for word choice, capitalization adjusted | All terminology consistent |
| **Style & Formatting** | Follow `style-standards.md` rules | No deviation |
| **Tone Alignment** | Match tone meters from audience execution file | Example: Guru = 70% Respectful, 30% Encouraging |
| **Audience Match** | Use correct audience file (murid/guru/mitra/unit-kerja) | No mixing audiences |
| **Character Limits** | Respect component-specific limits | Enforced per UI component type |
| **File Integrity** | All referenced files accessible | Flag: "MISSING SOURCE FILE: [path]" |

### Heuristic Validation (UX Quality)

| Dimension | Guiding Question | Ideal Outcome |
|------------|------------------|----------------|
| **Clarity** | Understand in one read? | Sentences <20 words, one idea per sentence |
| **Empathy** | Tone matches user's emotional state? | Supportive, non-patronizing, solution-oriented |
| **Relevance** | Directly helps user's task? | Actionable, no filler |
| **Inclusivity** | Neutral, bias-free per KBBI/PUEBI? | No gendered or exclusionary phrases |
| **Accessibility** | Easy to read, no jargon? | Readability ≈ Grade 8 level, active voice |
| **Consistency** | Uniform tone across elements? | Matches reference patterns |
| **Actionability** | Next step obvious? | CTA is clear, context-specific |
| **Human Touch** | Natural and empathetic? | Human rhythm, warm phrasing |

---

## Implementation Behavior (Figma Plugin)

**Validation Mode:**
- Performs **silent validation** internally
- Only flags results that **fail System Validation checkpoints**
- Does not display reasoning or self-check notes to users
- Outputs final copy only

**Token Optimization:**
- Concise output format (no verbose explanations)
- Legal conflict flags kept brief but clear
- Source citations shown only when flagging issues

---

**Combined Goal:**  
System Validation ensures _compliance and consistency_ (objective).  
Heuristic Validation ensures _empathy and usability_ (subjective).  

Together, they enable PENSILAJAIB to behave like a real UX writer:  
> **"Accurate by rule, but also right by feeling."**
