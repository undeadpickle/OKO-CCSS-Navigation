# K-8 Math Common Core Standards Browser

A clean, intuitive web interface for browsing and selecting K-8 mathematics Common Core standards.

## Overview

This application provides educators and curriculum developers with an efficient way to navigate the hierarchical structure of Common Core math standards. Users can browse through grades, domains, clusters, and individual standards with a clear two-panel interface.

## Features

- **Hierarchical Navigation**: Browse standards from Grade K through 8
- **Progressive Disclosure**: Navigate without overwhelming complexity
- **Clear Selection States**: Always know what's selected
- **Full Content Preview**: See complete standard text before selection
- **Intuitive Wayfinding**: Always know your location in the hierarchy

## Quick Start

1. Open `index.html` in a modern web browser
2. Select a grade from the grade selector
3. Click on domains to expand and see clusters
4. Click on clusters to see standards
5. Select any item to view its full content

## Project Structure

```
├── index.html          # Main application
├── styles.css          # Styling and layout
├── script.js           # Application logic
├── standards-data.json # Common Core standards data
├── StandardsTable.csv  # Standard names reference
├── README.md          # This file
├── CLAUDE.md          # Claude Code integration guide
├── CHANGELOG.md       # Version history
└── PRD.md             # Product requirements
```

## Usage

### Navigation Hierarchy
1. **Grade**: K-8 selection
2. **Domain**: Major mathematical areas (e.g., "Number & Operations")
3. **Cluster**: Grouped learning objectives
4. **Standard**: Specific learning standards
5. **Sub-standard**: Detailed components (when applicable)

### Selection Levels
You can select at any level:
- Entire domain (includes all children)
- Specific cluster (includes all standards)
- Individual standard (includes sub-standards)
- Specific sub-standard

## Technology

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid/Flexbox
- **JavaScript** - Vanilla JS, ES6+
- **JSON** - Standards data storage

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Prerequisites
- Modern web browser
- Text editor
- Basic web server (optional, for serving JSON)

### Running Locally
1. Clone or download the project
2. Open `index.html` directly in browser
3. Or serve with any static file server

### Adding Standards
Edit `standards-data.json` following the existing structure:
```json
{
  "grades": {
    "K": {
      "domains": {
        "CC": {
          "name": "Counting & Cardinality",
          "clusters": { ... }
        }
      }
    }
  }
}
```

## Design Principles

1. **Clarity**: Clear visual hierarchy and labeling
2. **Simplicity**: Progressive disclosure, minimal cognitive load
3. **Efficiency**: Quick access to any standard
4. **Familiarity**: Uses common UI patterns

## Keyboard Shortcuts

- `Tab` - Navigate through interactive elements
- `Enter` - Select/expand focused item
- `Space` - Toggle expansion (parent items)
- `Escape` - Close expanded sections

## Accessibility

- Full keyboard navigation
- ARIA labels for screen readers
- High contrast ratios (WCAG AA)
- Clear focus indicators

## Status

✅ **Complete** - Full implementation with all core features working:
- Hierarchical navigation (Grade → Domain → Cluster → Standard → Sub-standard)
- Progressive disclosure with expand/collapse
- Content preview with breadcrumb navigation
- Keyboard navigation support
- Standards with sub-standards display correctly

## Contributing

This is an MVP demonstration project. For feature requests or bug reports, please refer to the CHANGELOG.md for current version status.

## Resources

- [Common Core State Standards](https://www.thecorestandards.org/Math/)
- [Material Design Guidelines](https://m3.material.io/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## License

Educational demonstration project. Common Core State Standards are public domain.

## Contact

For questions about this implementation, refer to the PRD.md for project specifications or CLAUDE.md for technical details.# OKO-CCSS-Navigation
