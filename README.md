# ✍️ KETIK — Copy Guidelines for Ruang Murid
This repository contains the **authoritative copy guidelines** for KETIK.  
All files here are treated as references for generating and validating content across Figma plugins and custom GPTs.

---

## 📐 Rule Hierarchy
When multiple sources exist, always follow this strict priority order:

1. **Reference Standards** → `rm-glossary.md`, `style-standards.md`
2. **Core Guidelines** → `01-general-foundation.md`, `02-ruang-murid-tribe.md`
3. **Execution Rules** → `2.1-murid-execution.md`, `2.2-guru-execution.md`, `2.3-mitra-execution.md`, `2.4-unit-kerja-execution.md`
4. **Feature Guidelines** → `ai-powered-features.md`
5. **UI Components** → `ui-component-specs.md`, `error-templates.md`
6. **User-provided references** (links, published docs, or pasted material)
7. **Examples** → `component-copy-samples.md`, `dialog-examples.md`, `onboarding-samples.md`, `toast-message-library.md`
8. **Fallback principles** → clarity, empathy, inclusivity

---

## 🔄 Conflict Resolution
If two sources give different guidance:

| Situation | Which Wins | What To Do |
|-----------|------------|-------------|
| Glossary vs Execution doc | **rm-glossary.md** | Use glossary term. Flag discrepancy if entirely different content. |
| Style vs Execution doc | **style-standards.md** | Style overrides tone/voice. Adapt execution nuance if needed. |
| Execution vs Foundation | **Execution doc** | Audience-specific rules override global foundation. |
| Feature guideline vs Core | **Core Guidelines** | Foundation/tribe context wins unless feature introduces mandatory constraint. |
| User-provided reference vs Repo guideline | **Repo guideline** | Follow repo guidelines. Flag discrepancy even if user reference is more recent. |
| Example vs Reference doc | **Reference doc** | Examples are illustrative only. |
| Incomplete/contradictory guidelines | **Rule Hierarchy** | Follow priority order. If still unclear, ask user for clarification. |

---

## 📁 Repository Structure

### 📂 Core Guidelines
Foundation principles and execution rules:
- 🏛️ `01-general-foundation.md` — Legal basis, core principles, tone standards
- 🎯 `02-ruang-murid-tribe.md` — Platform context and tribal knowledge
- 😊 `2.1-murid-execution.md` — Student-focused copy execution
- 👩‍🏫 `2.2-guru-execution.md` — Teacher-focused copy execution  
- 🤝 `2.3-mitra-execution.md` — Partner/contributor execution
- 🏢 `2.4-unit-kerja-execution.md` — Work unit execution

### 📂 Reference  
Standards and terminology enforcement:
- 🔧 `style-standards.md` — Formatting, time, currency rules
- 📚 `rm-glossary.md` — Complete terminology glossary (GLO-001 to GLO-122)
- 🖥️ `ui-component-specs.md` — UI component specifications
- 🚫 `error-templates.md` — Error message templates

### 📂 Feature Guidelines
Platform-specific rules:
- 🤖 `ai-powered-features.md` — AI feature guidelines and constraints

### 📂 Examples
Practical implementation samples:
- 🎯 `onboarding-samples.md` — User onboarding flows
- 💬 `dialog-examples.md` — Dialog and confirmation examples  
- 📱 `toast-message-library.md` — Toast/snackbar message library
- 📋 `component-copy-samples.md` — UI component copy samples

---

## 🎯 Usage Guidelines

### For All Implementations (Figma Plugin, Custom GPT, Manual Reference):
1. **⚖️ Legal Compliance First** → Ensure no content conflicts with Landasan Hukum (legal framework). Flag any discrepancies immediately.
2. **📚 Check Reference Standards** → Use `rm-glossary.md` for terminology (show GLO-XXX codes as source) and `style-standards.md` for formatting
3. **🏛️ Apply Core Guidelines** → Use `01-general-foundation.md` and `02-ruang-murid-tribe.md` for context
4. **👥 Follow Target Audience Rules** → User will specify target audience (Murid/Guru/Mitra/Unit Kerja). Use corresponding execution file (2.1-2.4)
5. **📋 Reference Examples** → Use sample files for implementation patterns
6. **🔄 Handle Conflicts** → Always follow the hierarchy. When unclear, ask user for clarification

### Implementation Notes:
- **User Type Selection**: Users must specify target audience (no multi-audience content)
- **Dynamic Content**: Handle case-by-case based on user prompts. Ask for clarification when needed.
- **Character Limits**: Check UI component specifications for specific constraints
- **Missing Files**: Inform users if required files are unavailable
- **Source Citations**: Show all reference codes (GLO-XXX, etc.) as source documentation

### File Naming Convention:
- **Numbers** (01-, 2.1-): Indicate hierarchy and sequence
- **Descriptive names**: Clear purpose identification
- **Consistent prefixes**: Grouped by function and priority
- **No version dates**: Repository versioning handles updates

---

## 🔄 Updates & Maintenance

### Version Control:
- Repository commits track all changes
- No date suffixes in filenames
- Branch-based updates for major revisions

### Quality Assurance:
- All guidelines must comply with Landasan Hukum (legal framework)
- Cross-reference glossary terms consistently
- Validate against user type tone meters
- Test examples against real use cases

---

## 📞 Support & Contributing

For questions or updates to guidelines:
1. Check existing files following the hierarchy
2. Reference conflict resolution matrix
3. Maintain consistency with established patterns
4. Follow Indonesian language standards (KBBI)
