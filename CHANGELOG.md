# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-06-01

### ✨ Added

- **🌍 Full Internationalization Support**

  - Added complete i18n support with English and Chinese languages
  - Automatic language detection from Grafana user settings and browser preferences
  - Localized panel options, link editor interface, and error messages
  - Real-time language switching capability
  - Persistent language preferences with graceful fallbacks

- **🎨 Enhanced Theme Support**

  - Improved visual styling for better theme integration
  - Enhanced contrast and readability across different themes

- **🔧 New Configuration Options**

  - Added font size customization (8-32px range)
  - Configurable link width settings
  - Enhanced display options for better customization

- **📋 Link Management Improvements**
  - Added sort field for custom ordering of links and groups
  - Groups are now sorted by the highest sort value within the group
  - Links within groups are sorted in descending order by sort value
  - Improved link editor interface with better usability

### 🔒 Security

- **Role-Based Access Control**
  - Implemented permission checking for links based on user roles (Admin, Editor, Viewer)
  - Links are filtered based on current user's permissions
  - Secure handling of user data from Grafana context

### 🐛 Fixed

- Improved error handling for permission checks
- Better fallback mechanisms for missing user information
- Enhanced stability when accessing Grafana user context

### 🛠️ Technical Improvements

- Updated to Grafana 11.5.3+ compatibility
- Enhanced TypeScript types and interfaces
- Improved code organization and maintainability
- Added comprehensive error handling and logging

### 📚 Documentation

- Added detailed internationalization documentation
- Improved README with usage examples and configuration guide
- Enhanced code comments and documentation

---

## [1.0.0] - 2023-12-01

### ✨ Initial Release

- **Core Navigation Panel**

  - Display website navigation links in customizable panels
  - Support for grouping links by categories
  - Multiple display themes (default and box themes)
  - Show/hide options for group names and link icons

- **Basic Configuration**

  - Navigation data configuration through panel options
  - Link URL and title customization
  - Target window options (same window or new tab)
  - Group-based organization of links

- **Developer Features**

  - Built with React and TypeScript
  - Webpack-based build system
  - Jest testing framework
  - ESLint code quality tools
  - Docker development environment

- **Plugin Architecture**
  - Standard Grafana panel plugin structure
  - Plugin signing support for distribution
  - Apache 2.0 license

### 🔧 Technical Stack

- React 18.2.0
- Grafana Data/UI/Runtime APIs
- TypeScript 5.5.4
- Webpack 5 build system
- Node.js 18+ support
