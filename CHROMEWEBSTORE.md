# Chrome Web Store Listing — Manage Tab

> Last Updated: 2026-07-08

## Store Listing

**Extension Name** [REQUIRED]
Manage Tab

**Short Description** [REQUIRED]
Manages tabs for chrome. Easily discard inactive tabs and remove specific ones.

**Detailed Description** [REQUIRED]
### Overview
Manage Tab is a powerful, lightweight browser extension built to bring order to tab chaos. When your browser is overwhelmed with dozens of open tabs, it causes memory bloat, high CPU usage, and mental clutter. Manage Tab solves this by providing a centralized hub where you can view, organize, discard, and securely save your tabs for both online and offline use—giving you back control over your workspace and system resources.

### How Our Features Solve Your Problems
- **Active Tab Management:** View a clean list of all open tabs. Instantly switch to, close, or snooze (discard) tabs. *Solves the problem of losing tabs in a crowded window and struggling to find what you need.*
- **One-Click Snoozing (Discarding):** Put inactive tabs to sleep with a single click, or discard all inactive tabs at once. *Solves the problem of Chrome consuming massive amounts of RAM and draining your battery.*
- **Bookmarked Tabs:** Save important tabs to a local list before closing them, so you can easily restore them later. Export and import these backups anytime. *Solves the problem of losing research or reading material when you need to clear your active window.*
- **Offline Tab Saving:** Store entire webpages locally as web archives. These files are saved to your device and can be opened directly in the browser even without an internet connection. *Solves the problem of needing to reference important pages when traveling or when the original website goes down.*
- **Privacy First & Fully Local:** Everything happens on your device. There is no cloud syncing, no telemetry, and no remote code. *Solves the problem of data privacy and security concerns.*

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
| `storage` | permissions | Required to save bookmarked and offline tabs metadata locally to the browser so users can access them later. |
| `pageCapture` | permissions | Required to capture active web pages as full MHTML blobs when users request to save them for offline viewing. |
| `downloads` | permissions | Required to seamlessly download the captured MHTML offline files to the user's local disk, and delete them if the user unsaves the tab. |
| `downloads.open` | permissions | Required to natively open the locally saved MHTML offline files directly in the browser. |

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
