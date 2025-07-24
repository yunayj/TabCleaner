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

### 📊 Tab Status & Tracking
- **Real-time status display**: Shows current count of active, discarded, and total tabs at the top of popup
- **Auto-refresh**: Status updates every 5 seconds and immediately after discard operations
- **Visual indicators**: Clear console output with emoji indicators when tabs are discarded
- **Discard history**: Track and display recently discarded tabs with timestamps
- **Detailed information**: Shows tab title, URL, and discard time for each discarded tab
- **History management**: View recent discard history and clear it when needed

### 🎨 Modern UI Design
- **Glassmorphism Effects**: Semi-transparent cards with backdrop blur
- **Gradient Backgrounds**: Beautiful purple gradient theme throughout
- **Smooth Animations**: Hover effects, loading states, and transition animations
- **Color-coded Buttons**: Visual distinction for different action types
- **Responsive Layout**: Optimized spacing and typography for better readability

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
- **Tab status overview**: Real-time display of active, discarded, and total tab counts
- **Quick discard options**: Instantly discard current tab, other tabs, or tab groups
- **Tab protection settings**: Set temporary or permanent protection for important tabs
- **Auto-discard configuration**: Customize idle time limits for automatic discarding
- **Discard history**: View recently discarded tabs and clear history

### Tab Status Display

The popup now shows a status bar at the top with three key metrics:
- **Active**: Number of currently loaded (non-discarded) tabs
- **Discarded**: Number of tabs that have been discarded to save memory
- **Total**: Total number of tabs across all windows

This information updates automatically every 5 seconds and immediately after any discard operation.

## Recent Updates (v0.4) - UI Redesign ✨

- **🎨 Complete UI Redesign**: Modern glassmorphism design with gradient backgrounds
- **✨ Smooth Animations**: Button hover effects, ripple animations, and loading states
- **🌈 Color-coded Actions**: Different button colors for different action types
- **📱 Enhanced Layout**: Improved spacing, typography, and responsive design
- **🎪 Visual Effects**: Backdrop blur, floating animations, and modern card designs

## Previous Updates (v1.0.0)

- **Fixed critical bug**: Tabs are no longer incorrectly discarded when switching between them
- **Improved idle time tracking**: Now properly records when each tab was last used
- **Enhanced stability**: Better handling of tab switching and closing events

## Permissions

- `tabs`: Required to manage and discard tabs
- `storage`: Required to save your settings and whitelist
- `activeTab`: Required to identify the currently active tab

## Privacy

This extension works entirely locally on your device. No data is collected or transmitted to external servers.