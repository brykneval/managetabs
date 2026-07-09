# Chrome Web Store Listing — Manage Tab

> Last Updated: 2026-07-08

## Store Listing

**Extension Name** [REQUIRED]
Manage Tab

**Short Description** [REQUIRED]
Manages tabs for chrome. Easily discard inactive tabs and remove specific ones.

**Detailed Description** [REQUIRED]
Manage Tab is a simple utility to help you organize your browsing experience. 
It lists all your open tabs and provides quick actions to close, discard, or select tabs directly from the extension popup. You can quickly snooze (discard) inactive tabs to save memory, or remove multiple tabs at once by searching for a specific URL keyword.

**Category** [REQUIRED]
Productivity

**Single Purpose** [REQUIRED]
Manage Tab allows users to easily manage, discard, and close multiple inactive or unwanted browser tabs from a simple popup interface.

**Primary Language** [REQUIRED]
English

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `tabs` | permissions | The tabs permission is required to list all open tabs, read their URLs to filter and remove them based on user input, and to execute tab discard and close actions. |
| `storage` | permissions | Required to save tabs locally to the browser so users can access them later. |

**Remote Code Justification** (If prompted by the dashboard)
This extension does not use any remote code. All code is bundled within the extension package.

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** Yes

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|-----------|-----------|------------------------|---------|---------------------------|
| Web history | Yes | No | Used locally to filter and remove tabs based on user-provided keywords. | No |

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Developer Info

**Publisher Name** [REQUIRED]
[Your Name / Publisher Name]

**Contact Email** [REQUIRED]
[Your Email Address] - **Note:** As per the error message, you must enter this on the Settings page in the dashboard and verify it before publishing!
