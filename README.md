# TabCleaner

A Chrome extension that automatically manages your tabs to save memory and improve browser performance.

## Features

### 🚀 Automatic Tab Management
- **Auto-discard idle tabs**: Automatically discards tabs that have been inactive for a specified time period (default: 30 minutes)
- **Smart idle detection**: Fixed bug where tabs were incorrectly discarded - now properly tracks when each tab was last used
- **Customizable idle time**: Set your preferred idle time limit (in seconds)

### ⚡ Quick Actions
- **Discard current tab**: Instantly free up memory from the active tab
- **Discard other tabs**: Keep only the current tab active, discard all others
- **Discard tab group**: Discard all tabs in the current tab group
- **Discard idle tabs**: Manually trigger discarding of tabs idle for 30+ minutes

### 🛡️ Tab Protection
- **Temporary protection**: Protect tabs from being discarded for 24 hours or 1 week
- **Permanent whitelist**: Add URL patterns to permanently protect certain sites
- **Wildcard support**: Use patterns like `*.example.com/*` to protect entire domains

### 🌍 Multi-language Support
- English
- 中文 (Chinese)

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The TabCleaner icon will appear in your toolbar

## Usage

Click the TabCleaner icon in your toolbar to access:
- Quick discard options
- Tab protection settings
- Auto-discard configuration

## Recent Updates (v1.0.0)

- **Fixed critical bug**: Tabs are no longer incorrectly discarded when switching between them
- **Improved idle time tracking**: Now properly records when each tab was last used
- **Enhanced stability**: Better handling of tab switching and closing events

## Permissions

- `tabs`: Required to manage and discard tabs
- `storage`: Required to save your settings and whitelist
- `activeTab`: Required to identify the currently active tab

## Privacy

This extension works entirely locally on your device. No data is collected or transmitted to external servers.