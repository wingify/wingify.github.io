---
layout: post
title: Revolutionizing Test Reporting with AI at Wingify - A Deep Dive into CTRF Integration
excerpt: Revolutionizing Test Reporting with AI at Wingify - A Deep Dive into CTRF Integration
authorslug: sahil_goyal
author: Sahil Goyal
---
<div style="text-align:center; margin: 10px; display: none">
  <img src="/images/2025/03/ctrf-report-01.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

## **Introduction**

Wingify dramatically improved its software testing process by integrating the Common Test Report Format (CTRF) with AI-powered analysis. This resulted in a 40% reduction in test analysis time and significantly enhanced collaboration between QA and development teams. This article outlines the key improvements and provides practical guidance for implementing a similar system.

### The Challenge: Slow, Inefficient Test Reporting

Traditional software testing often involves lengthy manual analysis of test results, hindering rapid feedback loops and slowing down development cycles. At Wingify, this meant significant time was wasted sifting through test reports, identifying root causes of failures, and coordinating fixes.

### Our Solution: CTRF + AI = Faster, Smarter Testing

We addressed this challenge by implementing a three-pronged solution:

1. **Standardized Reporting with CTRF:** We adopted the Common Test Report Format (CTRF), a JSON-based standard for test results, ensuring consistency across our Playwright and Rest-Assured testing frameworks. This eliminated the inconsistencies and difficulties in interpreting different reporting formats.
2. **AI-Powered Analysis:** We integrated an AI-driven test reporter that analyzes CTRF reports, identifying patterns, root causes, and suggesting potential areas for investigation. This leverages the power of OpenAI and Anthropic Claude models to provide concise, actionable summaries of test failures. (See detailed integration guides below).
3. **Streamlined Communication with Slack Integration:** Test results and AI-generated summaries are automatically pushed to Slack, enabling real-time communication and collaboration between QA and development teams. This ensures faster issue resolution and improved sprint retrospectives.

### Key Results:

- **40% Reduction in Test Analysis Time:** AI-powered summaries significantly reduced the time spent manually analyzing test failures.
- **Improved Collaboration:** Real-time Slack notifications and standardized reports fostered better communication and collaboration.
- **More Efficient Sprint Retrospectives:** Clearer, concise reports facilitated more productive retrospective meetings.
- **Better Tracking of Recurring Issues:** The AI's pattern recognition capabilities helped identify and address recurring problems more effectively.

## **Getting Started: A High-Level Overview**

This system uses a simple workflow:

1. **Test Execution:** Run your tests using Playwright or Rest-Assured.
2. **CTRF Report Generation:** The chosen framework generates a CTRF-compliant JSON report. For Rest-Assured (using TestNG reports), a conversion tool is used to convert TestNG reports to CTRF format.
3. **AI Analysis:** The AI reporter processes the CTRF report and generates a summary.
4. **Slack Notification:** The summary is automatically sent to a designated Slack channel.

## **Detailed Integration Guides**

This section covers Playwright and Rest-Assured integration separately, focusing on the common elements of CTRF report generation, AI analysis, and Slack integration.

### **Playwright Integration**

First, install the Playwright CTRF JSON reporter:

```bash
npm install --save-dev playwright-ctrf-json-reporter
```

Configure your Playwright setup in playwright.config.ts:

```jsx
const config = {
  reporter: [
    ["list"], // Standard Playwright reporter

    [
      "playwright-ctrf-json-reporter",

      {
        outputFile: "ctrf/ctrf-report.json", // Optional: customize output path

        includeEnvironmentInfo: true, // Optional: include env details
      },
    ],
  ],
};

export default config;
```

This generates a standardised CTRF-compliant JSON report with the following structure:

```json
{
  "results": {
    "tool": {
      "name": "playwright"
    },

    "summary": {
      "tests": 1,

      "passed": 1,

      "failed": 0,

      "pending": 0,

      "skipped": 0,

      "other": 0,

      "start": 1706828654274,

      "stop": 1706828655782
    },

    "tests": [
      {
        "name": "ctrf should generate the same report with any tool",

        "status": "passed",

        "duration": 100
      }
    ],

    "environment": {
      "appName": "MyApp",

      "buildName": "MyBuild",

      "buildNumber": "1"
    }
  }
}
```

### **Rest-Assured Integration**

We've extended this approach to our Rest Assured API testing framework. Rest Assured typically uses TestNG reports. To integrate these into our AI-powered reporting system, we first need to convert the TestNG report to a CTRF-compliant JSON file using our open-sourced plugin [TestNG to CTRF Converter](https://github.com/wingify/testng-to-ctrf). This command will generate a CTRF JSON file.

```bash
testng-to-ctrf <path-to-testng-results.xml>
```

### **Implementing AI-Powered Analysis**

AI analysis implementation supports both OpenAI and Anthropic Claude models. Here's how to set it up:

### OpenAI Implementation

First, set up your OpenAI API key:

```bash
export OPENAI_API_KEY='your-openai-api-key'
```

Run the AI analysis:

```bash
npx ai-ctrf openai ctrf/ctrf-report.json --model gpt-4o --temperature 0.3
```

### **Slack Integration Setup**

### Setting up Slack Webhooks

1. Navigate to Slack API's Incoming Webhooks page
2. Create a new app or use an existing one
3. Enable Incoming Webhooks
4. Add the webhook to your workspace
5. Configure the webhook URL:

```bash
export SLACK_WEBHOOK_URL='<https://hooks.slack.com/services/your/webhook/url>'
```

### **Sending Test Results to Slack**

For basic test results:

```bash
npx slack-ctrf results ctrf/ctrf-report.json
```

<div style="text-align:center; margin: 10px; display: none">
  <img src="/images/2025/03/ctrf-report-02.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

For AI analysis results:

```bash
npx slack-ctrf ai ctrf/ctrf-report.json --consolidated
```

### 

<div style="text-align:center; margin: 10px; display: none">
  <img src="/images/2025/03/ctrf-report-03.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

## **Flowchart**

<div style="text-align:center; margin: 10px; display: none">
  <img src="/images/2025/03/ctrf-report-04.png" style="box-shadow: 2px 2px 10px 1px #aaa">
</div>

## **Future Enhancements**

We're continuously working to enhance our reporting system with:

- Custom AI models trained on our specific test patterns
- Advanced failure clustering algorithms
- Automated ticket creation based on AI analysis
- Historical trend analysis and prediction
- Generate a single analysis report for multiple jobs

## **Best Practices and Recommendations**

### **CTRF Report Generation**

- Include comprehensive environment information for better context
- Combine with other reporters for complete coverage
- Use consistent naming conventions for test descriptions
- Take advantage of the standardized JSON format for custom tooling

### **AI Analysis Configuration**

- Use GPT-4 for complex analysis needs
- Start with a lower temperature (0.3) for more consistent analysis
- Implement custom system prompts for specific analysis requirements
- Use the maxMessages parameter to prevent overwhelming the AI model
- Enable consolidation for cleaner summaries of multiple failures

### **Slack Integration**

- Use -onFailOnly for focused notifications
- Implement -consolidated for cleaner channels
- Create dedicated channels for different test types
- Store webhook URLs securely as environment variables

### **Resource Management**

- Monitor API usage and costs, especially for OpenAI services
- Implement appropriate rate limiting for API calls
- Use consolidation features for large test suites
- Cache AI analyses for similar failure patterns

## **Conclusion**

By integrating CTRF with AI-powered analysis, Wingify has significantly improved its software testing efficiency and collaboration. This approach provides a blueprint for other organizations seeking to accelerate their testing feedback loops and improve the quality of their software.

## **Technical Reference**

For teams looking to implement similar solutions, here are the key repositories we use:

- [Slack CTRF Reporter](https://github.com/ctrf-io/slack-test-reporter)
- [Playwright CTRF JSON Reporter](https://github.com/ctrf-io/playwright-ctrf-json-reporter)
- [AI CTRF Reporter](https://github.com/ctrf-io/ai-test-reporter)
- [JUnit to CTRF Converter](https://github.com/ctrf-io/junit-to-ctrf)
- [Testng to CTRF Converter](https://github.com/wingify/testng-to-ctrf)