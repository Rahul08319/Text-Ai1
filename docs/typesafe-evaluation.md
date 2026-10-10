# TypeSafe AI Architectural Evaluation

> **Evaluation Date:** October 2026  
> **Framework:** TypeSafe System One (Jev model architecture)  
> **Scope:** Tool categorization for context compaction & Prompt engineering best practices

---

## 1. Executive Summary

This document addresses two specific architectural inquiries using the **TypeSafe** design paradigm:
1. **Whether adding a `Choice` primitive for tool categorization would improve compaction accuracy.**
2. **Analysis of question instructions in `src/core.ts` against TypeSafe's latest prompting best practices.**

---

## 2. Evaluation 1: Adding a `Choice` Primitive for Tool Categorization

### 2.1 The Problem Context: Context Compaction
In large-scale agent workflows, prompt contexts become saturated with extensive tool definition schemas, API signatures, and invocation histories. **Context Compaction** prunes or condenses tool definitions so that only relevant capabilities occupy context tokens.

### 2.2 Mechanism of TypeSafe Primitives
TypeSafe replaces unstructured LLM text generation with **System One judgments** that return typed distributions and calibrated probabilities:

- **`Choice`**: Selects exactly one item from a discrete set of candidate options. Returns a normalized probability distribution across the candidates and a concentration-based confidence metric.
- **`Noul`**: Evaluates whether a binary condition holds ($P(\text{yes})$).
- **`Score`**: Assigns probability-weighted position along ordered semantic levels.

### 2.3 Impact on Compaction Accuracy

| Dimension | Without TypeSafe `Choice` (Raw LLM) | With TypeSafe `Choice` Primitive | Verdict |
|---|---|---|---|
| **Category Hallucination** | Risk of generating non-existent categories or arbitrary taxonomy tags | Guaranteed to pick from predefined categories or explicit `other`/`fallback` option | **Major Improvement** |
| **Probability Calibration** | Softmax temperatures in generative models often produce overconfident generation | TypeSafe System One models are trained specifically for calibrated probability distributions | **Major Improvement** |
| **Ambiguity Handling** | Generative models force an arbitrary choice when a tool spans multiple boundaries | `confidence` reveals distribution spread; if confidence is low, compactor retains full schema safely | **Major Improvement** |
| **Mutual Exclusivity Constraint** | Can handle single or multiple labels in text | `Choice` enforces *exactly one* category. If a tool spans categories (e.g., both File I/O and Network), a single `Choice` forces a compromise | **Trade-off / Consideration** |

### 2.4 Architectural Recommendation
1. **Use `Choice` if taxonomy is strictly partitioned:**  
   If every tool belongs to one primary domain (e.g., `["Filesystem", "Database", "Search", "CodeExecution", "Uncategorized"]`), `Choice` **significantly improves compaction accuracy**. It guarantees zero schema invalidity and provides a confidence signal:
   - High Confidence ($\ge 0.85$): Retain only the compacted category interface summary.
   - Low Confidence ($< 0.85$): Fall back to retaining the verbatim tool definition.
2. **Use Parallel `Noul` Primitives if tools are multi-capability:**  
   If a tool can simultaneously belong to multiple categories (e.g., a tool that queries Git and edits files), use parallel `Noul` primitives ($P(\text{is_database})$, $P(\text{is_filesystem})$) rather than forcing a single `Choice`.

---

## 3. Evaluation 2: Analysis of Question Instructions in `src/core.ts`

### 3.1 Repository Audit Finding
In the current repository structure (`Text-Ai1`), `src/core.ts` is not present in the frontend tree (the application is structured as a Vite + React 19 application in `App.tsx`, `components/`, and `services/`). 

However, below is the normative audit checklist against **TypeSafe's Latest Prompting & Question Best Practices** for any `core.ts` question implementation:

### 3.2 TypeSafe Prompting Best Practices Checklist

#### 1. Structured State Isolation (Rule: Do Not Concatenate Context)
- **Anti-pattern:** Interpolating tool definitions or history into a single monolithic prompt string (`instructions: "Given tool " + tool.name + " with description " + tool.desc ..."`).
- **Best Practice:** Pass context as structured named JSON properties in `state`:
  ```typescript
  state: {
    tool: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }
  ```
  Reference nested state paths in instructions using backticks: `` `tool.description` ``.

#### 2. Atomic, Coherent Judgment (Rule: One Question Per Dimension)
- **Anti-pattern:** Asking the model to simultaneously classify the category AND judge whether the tool is dangerous AND extract parameter names.
- **Best Practice:** Keep the question atomic:
  - Question 1 (`category`): Pick tool domain (`Choice`).
  - Question 2 (`is_destructive`): Evaluate mutation risk (`Noul`).

#### 3. Criteria Clarity and Exhaustiveness
- **Best Practice:** Criteria must describe concrete situations, contrast competing choices, and always include a fallback:
  ```typescript
  criteria: [
    { id: "read_only", description: "Inspects, queries, or retrieves data without side effects" },
    { id: "state_mutating", description: "Creates, updates, or deletes files, records, or infrastructure" },
    { id: "other", description: "Does not clearly fit either category or performs hybrid actions" }
  ]
  ```

#### 4. Question ID Semantics
- **Best Practice:** Question IDs are strictly client-side routing tokens and are **never sent to the model**. All semantic instructions must reside in the `instructions` field.

#### 5. Confidence Interpretation
- **Best Practice:** Treat confidence as distribution concentration, not absolute workflow correctness. Code must own fallback decisions.

---

## 4. Summary Table

```
┌─────────────────────────────────┬───────────────────────────────┬─────────────────────────────────┐
│ Evaluation Area                 │ Status                        │ Recommended Action              │
├─────────────────────────────────┼───────────────────────────────┼─────────────────────────────────┤
│ Choice for Tool Categorization  │ Highly Recommended            │ Add Choice with explicit        │
│                                 │ (with fallback criteria)      │ 'other' option + confidence gate│
├─────────────────────────────────┼───────────────────────────────┼─────────────────────────────────┤
│ src/core.ts Question Audit      │ Not present in repo           │ Follow TypeSafe State isolation │
│                                 │ (Benchmark reference)         │ and backticked path conventions │
└─────────────────────────────────┴───────────────────────────────┴─────────────────────────────────┘
```
