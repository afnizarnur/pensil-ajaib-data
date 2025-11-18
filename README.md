# PENSILAJAIB — Copy Guidelines for Ruang Murid (Figma Plugin)
_Last updated: 18 Nov 2025_

This repository contains the **authoritative copy guidelines** for PENSILAJAIB Figma Plugin.  
All files here are treated as references for generating and validating content.o 

---

## Rule Hierarchy

When multiple sources exist, always follow this strict priority order:

0. **Legal Compliance** → Landasan Hukum (PP No. 57/2021, UU No. 20/2003, Permendikbudristek No. 8/2024, No. 119/2014) overrides ALL other rules
1. **Reference Standards** → `Reference/style-standards.md`, `Reference/error-templates.md`
2. **Core Guidelines** → `Core Guidelines/general-foundation.md`, `Core Guidelines/ruang-murid-tribe/tribe.md`, `Core Guidelines/ruang-murid-tribe/glossary.md`
3. **Execution Rules** → `Core Guidelines/ruang-murid-tribe/user/murid.md`, `guru.md`, `mitra.md`, `unit-kerja.md`
4. **Feature Guidelines** → `Feature Guidelines/ai-powered-features.md`
5. **UI Components** → `Reference/ui-component-specs.md`, `Reference/error-templates.md`
6. **User-provided references** (links, published docs, or pasted material)
7. **Examples** → `Examples/component-copy-samples.md`, `dialog-examples.md`, `onboarding-samples.md`, `toast-message-library.md`
8. **Fallback principles** → clarity, empathy, inclusivity

---

## Conflict Resolution

If two sources give different guidance:

| Situation | Which Wins | What To Do |
|-----------|------------|-------------|
| **Legal vs Anything** | **Legal Compliance (Priority 0)** | ⚠️ **CRITICAL**: Always follow Landasan Hukum. Immediately flag conflict in output with: **"⚠️ LEGAL CONFLICT: [brief issue] - Applied legal requirement over [conflicting source]."** |
| Glossary vs Execution doc | **Core Guidelines/ruang-murid-tribe/glossary.md (Priority 2)** | Use glossary term from Priority 2. Flag discrepancy if entirely different content. |
| Style vs Execution doc | **Reference/style-standards.md (Priority 1)** | Style overrides tone/voice. Adapt execution nuance if needed. |
| Execution vs Foundation | **Execution doc (Priority 3)** | Audience-specific rules override global foundation (Priority 2). |
| Feature vs Execution/Foundation | **Execution/Foundation (Priority 2-3)** | Use execution rules unless feature introduces legal/technical constraint. |
| UI Component vs Other sources | **Follow hierarchy** | UI specs are Priority 5. Check higher priorities (0-4) first. |
| User-provided reference vs Repo guideline | **Repo guideline (Priority 1-5)** | Follow repo guidelines. Flag discrepancy even if user reference is more recent: "User reference differs from official guide — following guide per hierarchy." |
| Example vs Reference doc | **Reference doc (Priority 1-6)** | Examples are illustrative only. |
| Incomplete/contradictory guidelines | **Rule Hierarchy (0-8)** | Follow priority order. If still unclear after checking all priorities, flag as **"INCOMPLETE GUIDANCE"** and use fallback principles. |

---

## Usage Guidelines

### For Figma Plugin Implementation:

1. **Legal Compliance Gate (Priority 0)**  
   → Verify content does not conflict with Landasan Hukum.  
   → **If conflict detected, MUST flag in output before proceeding.**

2. **Reference Standards (Priority 1)**  
   → Use `Core Guidelines/ruang-murid-tribe/glossary.md` (show GLO-XXX codes as source)  
   → Apply `Reference/style-standards.md` for formatting

3. **Core Guidelines (Priority 2)**  
   → Apply `Core Guidelines/general-foundation.md` and `Core Guidelines/ruang-murid-tribe/tribe.md` for context

4. **Execution Rules (Priority 3)**  
   → User specifies audience (Murid/Guru/Mitra/Unit Kerja)  
   → Use corresponding file in `Core Guidelines/ruang-murid-tribe/user/`

5. **Feature Guidelines (Priority 4)**  
   → Check `Feature Guidelines/ai-powered-features.md` for platform-specific constraints

6. **UI Components (Priority 5)**  
   → Reference `Reference/ui-component-specs.md` and `Reference/error-templates.md` for technical specifications

7. **Examples (Priority 7)**  
   → Use files in `Examples/` folder for implementation patterns

8. **Handle Conflicts**  
   → Follow hierarchy table above  
   → Always flag legal conflicts prominently

### Implementation Notes:

- **Legal Conflict Flagging**: Any discrepancy between legal requirements and other guidelines MUST be flagged in output with clear explanation
- **User Type Selection**: Users must specify target audience (no multi-audience content)
- **Dynamic Content**: Handle case-by-case based on user prompts
- **Character Limits**: Check UI component specifications for specific constraints
- **Missing Files**: Flag if required files are unavailable: **"MISSING SOURCE FILE: [filename]"**
- **Source Citations**: Show all reference codes (GLO-XXX, Priority X, etc.) only when flagging issues

---

## Repository Structure

This structure reflects GitHub SSOT for dynamic plugin access:

### Core Guidelines
Foundation principles and execution rules:
- `general-foundation.md` — Legal basis, core principles, tone standards
- `ruang-murid-tribe/`
  - `tribe.md` — Platform context and tribal knowledge
  - `glossary.md` — Complete terminology glossary (GLO-001 to GLO-122)
  - `user/`
    - `murid.md` — Student-focused copy execution
    - `guru.md` — Teacher-focused copy execution  
    - `mitra.md` — Partner/contributor execution
    - `unit-kerja.md` — Work unit execution

### Reference  
Standards and terminology enforcement:
- `style-standards.md` — Formatting, time, currency rules
- `ui-component-specs.md` — UI component specifications
- `error-templates.md` — Error message templates

### Feature Guidelines
Platform-specific rules:
- `ai-powered-features.md` — AI feature guidelines and constraints

### Examples
Practical implementation samples:
- `onboarding-samples.md` — User onboarding flows
- `dialog-examples.md` — Dialog and confirmation examples  
- `toast-message-library.md` — Toast/snackbar message library
- `component-copy-samples.md` — UI component copy samples

---

## Quality Assurance & Heuristic Review

All outputs must pass two validation layers:

### ⚙️ System Validation (Objective Checks)

| Category | Checkpoint | Expected Behavior |
|-----------|-------------|------------------|
| **Legal Compliance** | Output must not violate Landasan Hukum (PP No. 57/2021, UU No. 20/2003, Permendikbudristek No. 8/2024, No. 119/2014). | ⚠️ If conflict detected → flag: **"⚠️ LEGAL CONFLICT: [brief issue] - Applied legal requirement over [conflicting source]."** |
| **Terminology & Glossary** | Use official terms from `Core Guidelines/ruang-murid-tribe/glossary.md` (GLO-XXX). | All terminology consistent and valid. |
| **Style & Formatting** | Follow `Reference/style-standards.md` (numbers, capitalization, time format, etc.). | No deviation from defined style rules. |
| **Tone Alignment** | Match tone ratios defined in `Core Guidelines/general-foundation.md` → Tone & Voice Meters. | Example: Teacher = 7/10 Respectful, 3/10 Encouraging. |
| **Audience Match** | Use audience-specific execution file (`murid.md`, `guru.md`, `mitra.md`, `unit-kerja.md`). | Do not mix audiences in one output. |
| **File Integrity** | All referenced files exist and are accessible in the repository. | If missing → flag: **"MISSING SOURCE FILE: [path]"** |

**Note:** Structural Completeness validation not applicable — plugin outputs final copy only, not multi-part responses.

---

### 💬 Heuristic Validation (UX Writer's Lens)

Use these questions to evaluate if output "feels right" to humans:

| Dimension | Guiding Question | Ideal Outcome |
|------------|------------------|----------------|
| **Clarity** | Can users understand the message in one read? | Short sentences (<20 words), one idea per sentence. |
| **Empathy** | Does the tone consider the user's mindset and emotional state? | Supportive, non-patronizing, solution-oriented. |
| **Relevance** | Does the content directly help users complete their task? | No filler; actionable and purpose-driven. |
| **Inclusivity** | Is the language neutral, bias-free, and compliant with KBBI/PUEBI? | No gendered or exclusionary phrases. |
| **Accessibility** | Is it easy to read and free from jargon or nested phrasing? | Readability ≈ Grade 8 level; mostly active voice. |
| **Consistency** | Does tone and structure remain uniform across UI elements? | Matches reference patterns in `Examples/` or `Reference/ui-component-specs.md`. |
| **Tone Effectiveness** | Does the tone match the context (e.g., success, error, info)? | Adheres to tone meter; no exaggeration. |
| **Actionability** | Is the next step obvious after reading? | CTA is clear, relevant, and context-specific. |
| **Human Touch** | Does it sound natural and empathetic, not mechanical? | Human rhythm, warm yet concise phrasing. |

---

### Implementation Behavior (Figma Plugin-Specific)

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

## Support & Contributing

For questions or updates to guidelines:

1. Check existing files following the hierarchy (Priority 0-8)
2. Reference conflict resolution matrix
3. Maintain consistency with established patterns
4. Follow Indonesian language standards (KBBI/PUEBI)
5. **Flag any legal compliance issues immediately with Priority 0 override**

### Contributing to Repository:
- All changes must maintain hierarchy integrity
- New guidelines must specify priority level (0-8)
- Include conflict resolution rules for new guideline types
- Update this README if new file categories are added

---

**Combined Goal:**  
System Validation ensures _compliance and consistency_ (objective).  
Heuristic Validation ensures _empathy and usability_ (subjective).  

Together, they enable PENSILAJAIB to behave like a real UX writer:  
> **"Accurate by rule, but also right by feeling."**
