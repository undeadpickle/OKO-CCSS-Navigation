# CLAUDE.md
## K-8 Math Common Core Standards Browser

### Project Overview
This is a web-based interface for browsing and selecting K-8 mathematics Common Core standards. The application uses a two-panel layout with hierarchical navigation on the left and content preview on the right.

### Architecture

#### File Structure
```
/
├── index.html          # Main HTML structure
├── styles.css          # All styling
├── script.js           # Application logic
├── standards-data.json # Common Core standards content
├── StandardsTable.csv  # Standard names reference data
├── README.md          # Project documentation
├── CLAUDE.md          # This file
├── CHANGELOG.md       # Version history
└── PRD.md             # Product requirements
```

#### Technology Stack
- **HTML5**: Semantic markup, accessibility
- **CSS3**: Modern layout (CSS Grid/Flexbox), custom properties
- **JavaScript**: Vanilla JS, ES6+ features
- **Data**: JSON structure for standards

### Key Components

#### 1. Navigation Panel
- Grade selector (dropdown or similar)
- Expandable tree structure
- Progressive disclosure pattern
- Visual selection states

#### 2. Preview Panel
- Full standard content display
- Clear typography hierarchy
- Breadcrumb or path display
- Proper text formatting

### Data Structure
```javascript
{
  "grades": {
    "K": {
      "name": "Kindergarten",
      "domains": {
        "CC": {
          "name": "Counting & Cardinality",
          "fullName": "Counting & Cardinality",
          "clusters": {
            "A": {
              "name": "Know number names and the count sequence",
              "standards": {
                "1": {
                  "code": "K.CC.A.1",
                  "name": "Count to 100 by Ones & by Tens",
                  "text": "Count to 100 by ones and by tens."
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Coding Standards

#### HTML
- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Keep structure clean and logical
- Use data attributes for JavaScript hooks

#### CSS
- Use CSS custom properties for theming
- Mobile-first responsive design (though desktop priority for MVP)
- BEM or similar naming convention
- Avoid deep nesting (max 3 levels)

#### JavaScript
- Use const/let, avoid var
- Prefer arrow functions for callbacks
- Use template literals for string concatenation
- Add JSDoc comments for functions
- Handle edge cases gracefully
- Use event delegation where appropriate

### State Management
The application maintains:
- Current grade selection
- Expanded/collapsed navigation nodes
- Currently selected standard
- Navigation history (optional)

### User Interactions

#### Required Behaviors
1. **Grade Selection**: Changes visible domains
2. **Domain Click**: Expands to show clusters
3. **Cluster Click**: Expands to show standards
4. **Standard Click**: Shows full content in preview
5. **Sub-standard Click**: Shows specific sub-standard

#### Visual Feedback
- Hover states on interactive elements
- Clear selected state indication
- Smooth transitions for expansions
- Loading states if needed

### Performance Considerations
- Lazy load standards data if needed
- Use CSS transforms for animations
- Debounce rapid selections
- Minimize DOM manipulation
- Cache frequently accessed data

### Accessibility Requirements
- Keyboard navigation support
- Proper focus management
- Screen reader compatibility
- Sufficient color contrast
- Clear focus indicators

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Development Guidelines

#### When Adding Features
1. Check PRD for scope alignment
2. Maintain simplicity principle
3. Test all interaction states
4. Ensure accessibility compliance
5. Update CHANGELOG.md

#### Code Review Checklist
- [ ] Follows naming conventions
- [ ] Includes necessary comments
- [ ] Handles edge cases
- [ ] Maintains consistent style
- [ ] Updates documentation
- [ ] Tests all browsers

### Common Patterns

#### Progressive Navigation Implementation
```javascript
// HTML structure for expandable items
<div class="nav-item domain-item" 
     data-level="domain" 
     data-expanded="false"
     data-id="5.NBT">
  <button class="nav-toggle" aria-expanded="false">
    <span class="expand-icon">▶</span>
    <span class="nav-label">Number & Operations</span>
  </button>
  <div class="nav-children" hidden>
    <!-- Cluster items here -->
  </div>
</div>

// Toggle expansion
function toggleExpansion(element) {
  const isExpanded = element.dataset.expanded === 'true';
  element.dataset.expanded = !isExpanded;
  const toggle = element.querySelector('.nav-toggle');
  const children = element.querySelector('.nav-children');
  
  toggle.setAttribute('aria-expanded', !isExpanded);
  children.hidden = isExpanded;
  
  // Rotate expand icon
  const icon = toggle.querySelector('.expand-icon');
  icon.style.transform = isExpanded ? 'rotate(0)' : 'rotate(90deg)';
}
```

#### Navigation Label Display
```javascript
// Standards show descriptive names instead of codes
function generateStandardsHTML(clusterId, standards) {
    Object.entries(standards).forEach(([standardId, standardData]) => {
        const displayName = standardData.name || standardData.code;
        // Uses name like "Evaluate Expressions Using Groupings" 
        // instead of code like "5.OA.A.1"
    });
}

// Sub-standards also use names from JSON data
function generateSubStandardsHTML(subStandards) {
    Object.entries(subStandards).forEach(([subId, subData]) => {
        const displayName = subData.name || subData.code;
        // Uses name like "Count Objects Using Standard Order"
        // instead of code like "K.CC.B.4.a"
    });
}
```

#### Breadcrumb Implementation
```javascript
// Generate breadcrumb from current selection
function generateBreadcrumb(selection) {
  const parts = [];
  
  if (selection.grade) parts.push(selection.gradeName);
  if (selection.domain) parts.push(selection.domainName);
  if (selection.cluster) parts.push(selection.clusterName);
  if (selection.standard) parts.push(selection.standardCode);
  if (selection.subStandard) parts.push(selection.subStandardCode);
  
  return parts.map((part, index) => 
    `<span class="breadcrumb-item">${part}</span>`
  ).join(' <span class="breadcrumb-separator">›</span> ');
}
```

#### Shortened Navigation Labels
```javascript
// Map of full names to shortened versions for nav
const navLabels = {
  'Number & Operations in Base Ten': 'Number & Operations',
  'Operations & Algebraic Thinking': 'Operations & Algebra',
  'Number & Operations—Fractions': 'Fractions',
  'Measurement & Data': 'Measurement & Data',
  'Counting & Cardinality': 'Counting & Cardinality'
};

// Function to get appropriate label
function getNavLabel(fullName, maxLength = 25) {
  if (navLabels[fullName]) return navLabels[fullName];
  if (fullName.length <= maxLength) return fullName;
  return fullName.substring(0, maxLength - 3) + '...';
}
```

#### Accessibility Attributes
```html
<!-- Navigation tree with ARIA -->
<nav role="navigation" aria-label="Standards Navigation">
  <ul role="tree" aria-label="Grade standards">
    <li role="treeitem" 
        aria-expanded="false" 
        aria-selected="false"
        aria-level="1"
        tabindex="0">
      <button class="expand-toggle">Domain Name</button>
      <ul role="group">
        <li role="treeitem" 
            aria-level="2"
            aria-selected="true"
            tabindex="-1">
          Standard Name
        </li>
      </ul>
    </li>
  </ul>
</nav>
```

### Testing Approach
1. Test navigation at each level
2. Verify selection states
3. Check keyboard navigation
4. Test with sample standards
5. Verify responsive behavior

### Known Constraints
- Single selection only
- No search functionality (MVP)
- Limited initial content
- Desktop-first design
- No data persistence

### Style Guide

#### Colors
```css
:root {
  --primary-color: #1976d2;
  --selected-bg: #e3f2fd;
  --hover-bg: #f5f5f5;
  --focus-outline: #4A90E2;
  --expanded-bg: #fafafa;
  --text-primary: #212121;
  --text-secondary: #757575;
}
```

#### Typography Scale
```css
:root {
  --font-size-xs: 12px;   /* Standard codes */
  --font-size-sm: 14px;   /* Sub-standards */
  --font-size-md: 16px;   /* Standards */
  --font-size-lg: 18px;   /* Clusters */
  --font-size-xl: 20px;   /* Domains */
  --font-size-2xl: 24px;  /* Grade selector */
}

/* Hierarchy Example */
.grade-selector { font-size: var(--font-size-2xl); font-weight: 500; }
.domain-item { font-size: var(--font-size-xl); font-weight: 500; }
.cluster-item { font-size: var(--font-size-lg); font-weight: 400; }
.standard-item { font-size: var(--font-size-md); }
.substandard-item { font-size: var(--font-size-sm); }
```

#### Spacing System
```css
:root {
  --spacing-unit: 8px;
  --spacing-xs: calc(var(--spacing-unit) * 0.5);  /* 4px */
  --spacing-sm: var(--spacing-unit);               /* 8px */
  --spacing-md: calc(var(--spacing-unit) * 2);    /* 16px */
  --spacing-lg: calc(var(--spacing-unit) * 3);    /* 24px */
  --spacing-xl: calc(var(--spacing-unit) * 4);    /* 32px */
  
  /* Indentation for hierarchy */
  --indent-domain: 0;
  --indent-cluster: var(--spacing-md);
  --indent-standard: var(--spacing-xl);
  --indent-substandard: calc(var(--spacing-xl) + var(--spacing-md));
}

### Error Handling
- Graceful fallbacks for missing data
- User-friendly error messages
- Console logging for debugging
- Prevent navigation breaking

### Future Considerations
- Search functionality
- Multiple selection mode
- Export capabilities
- Mobile optimization
- User preferences
- Analytics integration

### Implementation Lessons Learned

#### Critical Mistakes Made During Development
1. **Malformed JSON Structure** - The standards-data.json had nested grade definitions within the Kindergarten section, causing undefined entries in navigation. Always validate JSON structure before implementation.

2. **Incomplete Testing of Data Loading** - Didn't thoroughly test data parsing initially, leading to runtime errors. Test data loading and structure validation early.

3. **Selection vs Expansion Logic** - Initial confusion between expanding navigation items and selecting them for preview. Ensure clear separation between toggle/expand and select actions.

4. **CSS/JavaScript Arrow Conflicts** - CSS transform rotation conflicted with JavaScript arrow symbols, causing incorrect visual states. Remove CSS animations that conflict with JavaScript state management.

#### Toggle Implementation
```javascript
// Expansion state tracking in currentSelection
expandedDomain: null,
expandedCluster: null, 
expandedStandard: null

// Toggle logic separates expansion from selection
function handleDomainClick(domainId) {
    if (currentSelection.expandedDomain === domainId) {
        currentSelection.expandedDomain = null;
    } else {
        currentSelection.expandedDomain = domainId;
        selectDomain(domainId, getDomainData(domainId));
    }
}
```

#### Key Success Factors
- Progressive implementation (HTML → CSS → JavaScript → Testing)
- Proper use of semantic HTML and ARIA attributes
- Clean separation of concerns in JavaScript
- Comprehensive testing of all interaction levels
- Complete content summaries for all navigation levels
- Proper toggle state management with visual feedback