# FE-03: AI Directing & Prompt Comparison Workflow

## 1. Executive Summary
This document compares two AI-assisted development approaches for building a Validated User Settings Form: a single vague prompt vs. a highly specified, context-aware prompt.

## 2. Comparison Analysis
- **Correctness & Functionality:** 
  - *Round 1 (Vague):* Generated basic controlled state components without robust schema validation or proper TypeScript types.
  - *Round 2 (Precise):* Produced fully type-safe code using `react-hook-form` + `zod`, accurately validating email formats and required inputs.
- **Accessibility & Edge Cases:**
  - *Round 1:* Lacked ARIA attributes, semantic HTML elements, and disable-on-submit logic.
  - *Round 2:* Included proper `aria-invalid`, helper text associations, and disabled loading states during submission.
- **Review Effort & Caught AI Mistakes:**
  - *AI Mistake Identified:* In Round 1, the AI improperly handled checkbox state resets upon form clearing. Round 2 explicitly handled default schema values, saving significant manual refactoring time.

## 3. Key Learnings & Rule Updates
Directing AI with exact specs and verification steps drastically reduces total cycle time despite taking longer to prompt initially.