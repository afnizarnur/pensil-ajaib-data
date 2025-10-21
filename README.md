# ✍️ KETIK — Copy Guidelines for Ruang Murid

This repository contains the **authoritative copy guidelines** for KETIK.
All files here are treated as references for generating and validating content across Figma plugins and custom GPTs.

---

## 📐 Rule Hierarchy

When multiple sources exist, always follow this strict priority order:

1. **Legal Compliance** → Ensure no content conflicts with Landasan Hukum (legal framework)
2. **Reference Standards** → `reference.md` for glossary (GLO-XXX codes) and style standards
3. **Core Guidelines** → `core-guidelines.md` for foundation principles and execution rules
4. **Feature Guidelines** → `features.md` for platform-specific rules
5. **User-provided references** (links, published docs, or pasted material)
6. **Examples** → `examples.md` for implementation patterns
7. **Fallback principles** → clarity, empathy, inclusivity

---

## 🔄 Conflict Resolution

If two sources give different guidance:

| Situation | Which Wins | What To Do |
|-----------|------------|-------------|
| Glossary vs Execution doc | **reference.md** | Use glossary term. Flag discrepancy if entirely different content. |
| Style vs Execution doc | **reference.md** | Style overrides tone/voice. Adapt execution nuance if needed. |
| Execution vs Foundation | **Execution doc** | Audience-specific rules override global foundation. |
| Feature guideline vs Core | **Core Guidelines** | Foundation/tribe context wins unless feature introduces mandatory constraint. |
| User-provided reference vs Repo guideline | **Repo guideline** | Follow repo guidelines. Flag discrepancy even if user reference is more recent. |
| Example vs Reference doc | **Reference doc** | Examples are illustrative only. |
| Incomplete/contradictory guidelines | **Rule Hierarchy** | Follow priority order. If still unclear, ask user for clarification. |

---

## 🎯 Usage Guidelines

### For All Implementations (Figma Plugin, Custom GPT, Manual Reference):

1. **Legal Compliance First** → Ensure no content conflicts with Landasan Hukum (legal framework). Flag any discrepancies immediately.
2. **Check Reference Standards** → Use `reference.md` for terminology (show GLO-XXX codes as source) and style formatting
3. **Apply Core Guidelines** → Use `core-guidelines.md` for context and audience-specific rules
4. **Follow Target Audience Rules** → User will specify target audience (Murid/Guru/Mitra/Unit Kerja). Apply corresponding execution guidelines.
5. **Reference Platform Features** → Use `features.md` for platform-specific constraints and terminology
6. **Use Examples** → Reference `examples.md` for implementation patterns
7. **Handle Conflicts** → Always follow the hierarchy. When unclear, ask user for clarification

### Implementation Notes:
- **User Type Selection**: Users must specify target audience (no multi-audience content)
- **Dynamic Content**: Handle case-by-case based on user prompts. Ask for clarification when needed.
- **Character Limits**: Check UI component specifications for specific constraints
- **Missing Files**: Inform users if required files are unavailable
- **Source Citations**: Show all reference codes (GLO-XXX, etc.) as source documentation

---

## 📁 Repository Structure

### Core Guidelines
- `core-guidelines.md` — Foundation principles, legal compliance, user personas, tone standards

### Reference
- `reference.md` — Complete glossary (GLO-001 to GLO-122) and style standards

### Features
- `features.md` — Platform-specific rules, feature terminology, technical constraints

### Examples
- `examples.md` — UI component library, dialogs, content samples for each user type

### Support
- `questions.md` — Question sets for different content creation scenarios

---

## 🔄 Updates & Maintenance

### Version Control:
- Repository commits track all changes
- No date suffixes in filenames
- Follow consistent naming conventions

### Quality Assurance:
- All guidelines must comply with Landasan Hukum (legal framework)
- Cross-reference glossary terms consistently
- Validate against user type tone meters
- Test examples against real use cases

---

## 📞 Support & Contributing

For questions or updates to guidelines:
1. Check existing files following the rule hierarchy
2. Reference conflict resolution matrix
3. Maintain consistency with established patterns
4. Follow Indonesian language standards (KBBI)
