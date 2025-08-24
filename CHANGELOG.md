# Changelog
All notable changes to the K-8 Math Common Core Standards Browser will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Standard names in preview panel titles (e.g., "Evaluate Expressions Using Groupings" instead of "Standard 5.OA.A.1")
- StandardsTable.csv data integration for descriptive standard names

### Planned
- Search functionality
- Multiple selection mode
- Export selected standards
- Mobile responsive design
- User preferences persistence
- Print-friendly view

## [1.0.0] - 2024-08-24 - Complete MVP Release
### Added
- Complete implementation of all core features
- Full hierarchical navigation working correctly
- Standards with sub-standards display (e.g., 5.NBT.A.3.a/b)
- Breadcrumb navigation with current location
- Keyboard navigation (Tab, Enter, Arrow keys)

### Fixed
- Corrected malformed JSON data structure
- Resolved navigation expansion/selection logic
- Fixed undefined entries in standards display

### Technical Achievements
- ✅ All core functionality implemented and tested
- ✅ Semantic HTML with ARIA accessibility
- ✅ Responsive CSS with custom properties
- ✅ Clean JavaScript with proper state management
- ✅ Complete testing of all interaction levels

## [0.1.0] - Initial MVP Release
### Added
- Two-panel layout (navigation + preview)
- Grade selector (K-8)
- Hierarchical navigation structure
- Progressive disclosure navigation
- Single standard selection
- Full content preview panel
- Visual selection states
- Keyboard navigation support
- Sample standards data for demonstration

### Core Features
- **Navigation Panel**
  - Grade dropdown selector
  - Expandable domains
  - Expandable clusters
  - Clickable standards
  - Sub-standard support

- **Preview Panel**
  - Full standard text display
  - Hierarchy breadcrumb
  - Clear typography
  - Formatted content

### Technical Implementation
- Vanilla JavaScript (ES6+)
- CSS Grid/Flexbox layout
- JSON data structure
- Semantic HTML5
- ARIA accessibility labels

### Data Coverage
- Kindergarten: Counting & Cardinality (sample)
- Grade 1: Operations & Algebraic Thinking (sample)
- Grade 2: Number & Operations in Base Ten (sample)
- Grade 3: Number & Operations—Fractions (sample)
- Grade 4: Measurement & Data (sample)
- Grade 5: Number & Operations in Base Ten (full domain)

### Known Limitations
- Desktop-only optimization
- Limited standards data (demonstration set)
- No data persistence
- Single selection only
- No search capability

## Development Notes

### Version Naming
- 0.x.x - Pre-release/MVP versions
- 1.0.0 - First production release (future)

### Priority for Next Release
1. Complete standards data for all grades
2. Mobile responsive design
3. Search functionality
4. Improved accessibility features

### Testing Coverage (v1.0.0)
- [x] Navigation expansion/collapse
- [x] Selection state management  
- [x] Preview panel updates
- [x] Keyboard navigation
- [x] Grade switching
- [x] Sub-standards display
- [x] Breadcrumb navigation
- [ ] Full standards data coverage
- [ ] Cross-browser testing
- [ ] Accessibility audit

## Feedback & Issues

### Open Issues
- None reported

### Feature Requests
- To be collected during user testing

### Bug Reports
- To be tracked during testing phase

---

For technical details, see [CLAUDE.md](./CLAUDE.md)
For product specifications, see [PRD.md](./PRD.md)
For usage instructions, see [README.md](./README.md)