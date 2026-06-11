# CodeRecall AI

## The Problem

When I solve DSA problems on platforms like LeetCode, I fully understand my solution at that moment. But when I revisit the same code after 1–2 weeks, I often get confused — I don’t remember why a specific condition exists, why a calculation is done in a certain way, or why a pointer shifts under a particular condition.
I end up re-solving the entire problem just to understand my own logic again, which wastes 15–20 minutes per question. This problem affects not just me but other students and developers who regularly practice DSA and revisit problems during interview preparation.

## What It Does

This tool allows me to paste my existing solution code along with the problem statement. The AI processes the code and returns the exact same code with short, clear inline comments explaining each important step.
Instead of re-solving the problem, I can now instantly understand my past logic in under a minute, making revision significantly faster and more efficient.

## AI Integration

**API:** OpenRouter
**Model:** openai/gpt-4o-mini
**Location:** `backend/server.js` → inside the `/explain-code` route handler
**What the AI does:** Takes user code and returns the same code annotated with concise inline comments explaining the reasoning behind key logic steps.

## What I Intentionally Excluded

* **User authentication:** Not included because the core value of the product is instant code explanation, and adding auth would significantly increase development time without improving the main functionality.
* **Saving history of past explanations:** Excluded to keep the MVP simple and focused; persistence can be added later if needed.
* **Multi-language code support optimization:** The tool works generically, but I did not fine-tune behavior for different programming languages to avoid overcomplicating the initial version.

## Monthly Cost Calculation

Model: openai/gpt-4o-mini
Input cost: $0.15 per 1M tokens
Output cost: $0.60 per 1M tokens

Average tokens per request:
~800 input tokens (code + prompt)
~400 output tokens (commented code)

Cost per request:
(800 / 1,000,000 × $0.15) = $0.000120
(400 / 1,000,000 × $0.60) = $0.000240

Total cost per request:
$0.000120 + $0.000240 = $0.000360

Expected usage:
300 requests per month

**Monthly total:**
300 × $0.000360 = **$0.108 (~$0.11 per month)**

## Live Deployment

**Frontend:** [https://stately-flan-d33de5.netlify.app/]
**Backend:** [https://coderecall-ai.onrender.com]
