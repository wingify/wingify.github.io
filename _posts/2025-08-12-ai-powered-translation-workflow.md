---
title: "Breaking the Translation Bottleneck: How AI-Powered i18n Transformed Our Development Workflow"
meta_description: "Discover how VWO overhauled its translation workflow using AI and i18next, migrating from Transifex Live, automating 90% of the process, and enabling fast, scalable internationalization across tech stacks."
keywords: "i18n automation, AI translation, i18next, internationalization, translation quality, development workflow, Transifex alternative"
author: "Kartik Patpatia / Pranav Jindal"
published_date: "2025-08-12"
authorslug: kartik_patpatia
category: "Engineering"
tags: ["i18n", "automation", "AI", "development-workflow", "internationalization", "translation"]
---

<div style="text-align:center; margin: 20px;">
  <img src="/images/2025/08/i18n-flow.png" style="box-shadow: 2px 2px 10px 1px #aaa; border-radius: 4px;">
</div>

# Introduction

Today, if you’re building a software product for people around the world, you need to support many languages. In this blog, we’ll share how we’re using Gen AI to build a translation system that’s simple, fast, and easy to scale as we gradually migrate to a new framework.

At VWO, an optimization platform trusted by thousands of businesses worldwide, we faced this challenge as we started growing globally. We needed to support languages like Japanese, Portuguese, and German, but still keep our development fast and on schedule.

## VWO's Multi-Technology Stack

Over the years, VWO has grown into a suite of products stitched together with different technologies. Some parts are over a decade old, built with JavaScript and jQuery. The main app is built with AngularJS, while various backend services run in PHP, Python, Node and more. Different teams own different pieces, and they ship on different schedules.

There's no single place where "the app" lives. English text is scattered across HTML templates, JS files, API responses, emails, and content management systems.

This meant we couldn't treat translation as a frontend feature or a backend service. We had to think of it as a system that could be integrated with everything that powers copy texts in VWO without becoming a bottleneck or forcing rewrites.

## The Core Challenge

How do you build one translation system that works smoothly across different technologies, especially when starting from scratch?

We needed a solution that could:
- Work consistently across **all** our technologies
- Provide a **unified developer experience**
- Offer a **single source of truth** for translations
- Meet our **security and maintainability standards**

This was the starting point of the problem we needed to solve.

## Transifex: Our Current Tool (and Why We’re Moving On)

We’ve been using Transifex Live for translations. It worked fine in the beginning, but as our product grew, it became harder to manage. Developers had to update translations manually, which took time and often led to mistakes. If the English text changed but wasn’t published in Transifex, users would see outdated content or broken placeholders in other languages like Japanese.

Transifex’s auto-collect feature also caused problems. It tried to pick up strings from the code automatically, but often got it wrong. It extracted raw HTML and Angular tags without understanding the context. It broke variables, misunderstood context, and sometimes split one sentence into several parts. These fragmented strings made it nearly impossible for translators to understand the full meaning.

Because of these issues, we started building our own translation system.

## Our Solution

We chose [i18next](https://www.i18next.com/) because it gave us exactly what we needed. It’s a flexible translation library that works with any framework. It supports things like plural forms and context out of the box, and it’s lightweight enough to keep our app fast.

While our translation system works across multiple frameworks, covering integration into each one in detail is out of scope for this blog. Here, we’ll focus in brief on how we integrated it into our AngularJS app and then jump to the interesting part - how we automated the process using AI.

## The Building Blocks of Our Translation System

### 1. i18next Service

We built a central service around i18next to manage all our translations. It keeps everything organized, loads only the translations we need, and makes sure users never see missing or broken text.

**Example:**
```typescript
// Before
toastService.notifier({
  message: 'Privacy settings was successfully saved.',
  type: NotifierToastType.SUCCESS
});

// After
toastService.notifier({
  message: window.i18nextInstance.t('settings.accounts.privacyCenter.toasts.saveSuccess'),
  type: NotifierToastType.SUCCESS
});
```

**And in JSON:**
```json
{
  "settings": {
    "accounts": {
      "privacyCenter": {
        "toasts": {
          "saveSuccess": "Privacy settings was successfully saved."
        }
      }
    }
  }
}
```

### 2. vwoTranslate

For short bits of text, like headings or placeholders, we made a filter called `vwoTranslate`. It’s easy to use and keeps our templates clean.

**Example:**
```html
<!-- BEFORE: Simple text -->
<h1>Campaign Title</h1>

<!-- AFTER: Translated text -->
<h1>{{ "campaign.title" | vwoTranslate }}</h1>
```

**And in JSON:**
```json
{
  "campaign": {
    "title": "Campaign Title"
  }
}
```

### 3. vwoDomTranslate: For Complex or Interactive Content

Some UI elements are more complicated, with links or dynamic data. Our `vwoDomTranslate` directive lets us translate these without breaking the layout or interactivity.

**Example: Nested HTML**
```html
<!-- BEFORE: Complex nested structure -->
<div class="notification-container">
  Please note 
  <span class="Fw(medium)">
    <span class="CSS-based-item"></span>
    <span class="Fw(medium)">
      <a href="https://www.google.com">click here</a> or 
      <span class="C(color-blue-6)">Learn more</span>
    </span>
  </span> 
  for details.
</div>

<!-- AFTER: Translatable nested structure -->
<div class="notification-container" vwo-dom-translate="campaign.complexNestedMessage">
  <span translate-placeholder="vwoparent" class="Fw(medium)">
    <span translate-placeholder="vwoloader" class="CSS-based-item"></span>
    <span translate-placeholder="vwochild" class="Fw(medium)">
      <a translate-placeholder="vwoanchor" href="https://www.google.com">{{ $domTranslateScope.vwoanchor }}</a>
      <span translate-placeholder="vwolearnmore" class="C(color-blue-6)">{{ $domTranslateScope.vwolearnmore }}</span>
    </span>
  </span>
</div>
```

**And in JSON:**
```json
{
  "campaign": {
    "complexNestedMessage": "Please note <vwoparent> <vwoloader></vwoloader><vwochild> <vwoanchor>click here</vwoanchor> or <vwolearnmore>Learn more</vwolearnmore></vwochild></vwoparent> for details."
  }
}
```

As we started building out the new system, the next challenge was updating our huge codebase. This is where automation, with help from AI, made all the difference.

## How We Are Using AI to Migrate Everything

Manually replacing hardcoded text with translation keys across thousands of files would have taken forever. So we are using Cursor AI to automate the process. We documented the rules, such as when to use vwoTranslate versus vwoDomTranslate, and how to structure keys. Then, we handed those rules to Cursor.

### Snippet of the rules we used to automate the process

```markdown
Is this user-facing text?
├─ No → Don't translate
└─ Yes → Analyze HTML and semantics
    ├─ Plain text in a simple container → Use vwoTranslate
    ├─ Spans styled HTML elements?
    │   ├─ No → Check for semantic structure
    │   │   ├─ No → Use vwoTranslate
    │   │   └─ Yes → Use vwoDomTranslate
    │   └─ Yes → Check styling/behavior
    │       ├─ CSS classes for emphasis → Use vwoDomTranslate
    │       ├─ Functional attributes (e.g., tooltips, events) → Use vwoDomTranslate
    │       └─ Contains dynamic variables → Use vwoDomTranslate
    └─ Requires semantic HTML (e.g., accessibility/aria) → Use vwoDomTranslate

Should this key go into common.json?
├─ Is this key used in 3 or more completely different features/modules?
│   ├─ No → It's feature-specific → Place in modules.json
│   └─ Yes
│       ├─ Does the text have the exact same meaning in every context?
│       │   ├─ No → Context-dependent → Place in modules.json
│       │   └─ Yes
│       │       ├─ Is it a basic/generic UI label, verb, or phrase?
│       │       │   ├─ Yes → Common, reusable language → Place in common.json
│       │       │   └─ No → Too specific → Place in modules.json
└─ No → It's not cross-feature → Place in modules.json
```

Cursor now goes through each file, figures out which parts need translation, and picks the right method automatically. It works so well that what used to take us 5 to 7 hours per file now takes just 30 to 45 minutes. And the results are much more consistent than before.

### ⚡ Results

| **Metric**              | **Before Cursor AI** | **After Cursor AI**      |
|-------------------------|----------------------|---------------------------|
| Migration time per file | 5–7 hours            | 30–45 minutes             |
| Consistency             | Manual, error-prone  | Rule-enforced             |
| Rework                  | Frequent             | Minimal                   |
| Migration coverage      | Slow, partial        | Broad, automated          |

**Impact so far:** Migration is now 10 times faster and much more consistent for migrated files.

## The Automation That Changed Everything

You might be wondering, how are we actually translating everything in other languages?

Initially, when exploring automation, we tried tools like Google Translate. But they didn’t work well for our product. Our product has context-rich content, dynamic variables, and even embedded HTML tags. These tools often broke the formatting or gave weird, static translations.

Instead, we are using LLMs (Large Language Models). We gave them clear instructions on how to think like a professional product translator. We created prompts in such a way that they understood the context, which words should never change, how to handle dynamic variables, and how to keep the tone consistent.

It makes smart choices, like:
- Keeping brand/ marketing terms like “VWO” and “A/B Testing” exactly as they are
- Not touching variables like `{{username}}` or `$t()`
- Keeping the HTML tags in place
- Writing in a formal but easy-to-read tone
- Preserving web standard terms like HTTP, HTTPS, etc.

Once we had clear understanding of the prompts to provide to the LLMs, we created the scripts to automate the process.

### 1. Sync Translations: Keep Translations Up to Date, Automatically

Now, when someone adds or updates text in English, this script:
* Figures out what changed
* Translates just the new or updated strings
* Updates every language file (Japanese, French, etc.)

To trigger the sync, developers don’t need to run any scripts locally. They just drop a command into Slack, and everything happens automatically behind the scenes. It’s as simple as:
```bash
!i18nsyncautomation Project app-v3 SyncBranch [feature-branch-name]
```

This kicks off our sync pipeline. It translates the updated strings across all target languages, commits the changes, and notifies the team. All of it happens right inside Slack.

**Example:**
```json
{
  "settings": {
    "accounts": {
      "privacyCenter": {
        "title": "Privacy Center",
        "notification": "Use of HTTP cookies is required to access this page."
      }
    },
  },
  "campaign": {
    "createWithCopilotButton": "Create with $t(marketingTerms:copilot)"
  },
  "authFlow": {
    "tokenValidMessage": "Token will remain valid for the next <vwominutes>10 minutes.</vwominutes>"
  }
}
```

**Result:** Translations show up in every language, instantly.

**Japanese:**
```json
{
  "settings": {
    "accounts": {
      "privacyCenter": {
        "title": "プライバシー センター"
        "notification": "このページにアクセスするには、HTTP クッキーの使用が必要です。"
      }
    }
  },
  "campaign": {
    "createWithCopilotButton": "$t(marketingTerms:copilot)で作成"
  },
  "authFlow": {
    "tokenValidMessage": "トークンは残り<vwominutes>10分</vwominutes>間有効です"
-  }
}
```

**French:**
```json
{
  "settings": {
    "accounts": {
      "privacyCenter": {
        "title": "Centre de confidentialité"
        "notification": "L'utilisation de cookies HTTP est nécessaire pour accéder à cette page."
      }
    }
  },
  "campaign": {
    "createWithCopilotButton": "Créer avec $t(marketingTerms:copilot)"
  },
  "authFlow": {
    "tokenValidMessage": "Le jeton restera valide pour les <vwominutes>10 minutes.</vwominutes>"
  }
}
```

The above example shows how the script kept everything in place like HTML tags, variables such as `<vwominutes>` and `$t()`, and important words like “HTTP”.

### 2. Add a New Language: Launch in Minutes

When we want to add a new language, this script handles it for us. It does two main things:
- Copies the English translation files as templates
- Uses AI to fill in translations for the new language

**How to use it:**
```bash
!i18nsyncautomation Project app-v3 AddLanguage [language-code] [feature-branch-name]
```

**What you get:**

```markdown
app/assets/i18n/
├── en/
│   ├── common.json
│   └── modules.json
└── it/
    ├── common.json      ← auto-translated
    └── modules.json     ← auto-translated
```

It takes just a few minutes to add a new language. There’s no waiting for handoffs or repetitive manual steps. Just one command, and it's ready for review.

> ⚠️ *“While translations are auto-generated, we still recommend a quick UI validation pass. Different languages may cause layout shifts due to varying content widths. A minimal QA check helps ensure everything looks right.”*

### 3. Validate Translations: AI-Powered Translation QA

Before any translations go live, we run this script. It checks for missing keys, broken formatting, and even uses AI to spot awkward phrasing or grammar issues.

There are 2 phases to the validation process:

**Phase 1: Structural Validation**
- **Missing keys** – Ensures all English keys exist in other languages
- **Extra keys** – Flags unused or outdated keys that don’t exist in English
- **Broken variables** – Checks for missing or incorrect placeholders like {{username}}
- **Broken HTML tags** – Detects if any tags like `<a>`, `<vwolink>` are missing or malformed

**Phase 2: AI Quality Assessment**
- **Tone analysis** – Evaluates formality and brand voice consistency
- **Grammar checking** – Identifies syntax and grammatical errors
- **Context validation** – Ensures translations fit the UI context
- **Pluralization verification** – Checks proper plural form handling

To double check context, we also use back translation. The AI translates the content back into English, and we compare it with the original. This helps us catch anything that feels off or doesn’t fully match the intent of the source.

**How to use it:**
```bash
!i18nsyncautomation Project app-v3 ValidateTranslations [feature-branch-name]
```

## The Results: What Changed for Our Team

Migrating away from Transifex has transformed our translation workflow. Here’s a side-by-side comparison of common problems and how our new system solves them:

| **Problem Area**                  | **Before (Transifex)**                                                                 | **Now (AI + Automation)**                                                                 |
|----------------------------------|----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| **Adding a New Language**        | Manual file duplication, waiting on translators, and lots of QA handoffs. | One Slack command adds and auto-translates files in minutes.                             |
| **String Context Handling**      | Misinterpreted placeholders and broke dynamic values.                                  | LLM respects placeholders and HTML, and preserves structure.                             |
| **Content Publishing**           | Required manual publishing. Missed steps caused broken or outdated translations.       | Auto-sync script pushes updates instantly across all languages via a Slack command.      |
| **Quality Assurance**            | Manual checks. Bugs often found late in QA cycle.                                      | Automated validation with back-translation, formatting and tone checks.                  |

The new system has saved us dozens of hours per release and significantly improved translation consistency and reliability.

## What’s Next?

We will be rolling out this system to our other services and adding even more quality checks. Our goal is to make translations so seamless that nobody on the team ever has to think about them again. They’ll just work.

## The Big Takeaway

Translations used to slow down our global growth. But with the right structure, smart automation, and help from AI, we’re turning them into a big advantage for the whole organization. Now, our developers can ship features for any market, and they can do it fast.
