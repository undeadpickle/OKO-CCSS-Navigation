/**
 * K-8 Math Common Core Standards Browser
 * Interactive navigation and selection for standards hierarchy
 */

// Global state management
let standardsData = {};
let currentSelection = {
    grade: null,
    gradeName: null,
    domain: null,
    domainName: null,
    cluster: null,
    clusterName: null,
    standard: null,
    standardCode: null,
    standardText: null,
    subStandard: null,
    subStandardCode: null,
    subStandardText: null,
    // Expansion state tracking
    expandedDomain: null,
    expandedCluster: null,
    expandedStandard: null
};

// DOM elements
const gradeSelector = document.getElementById('grade-selector');
const navigationTree = document.getElementById('navigation-tree');
const breadcrumbPath = document.getElementById('breadcrumb-path');
const previewContent = document.getElementById('preview-content');

// Shortened navigation labels for better UX
const navLabels = {
    'Number & Operations in Base Ten': 'Number & Operations',
    'Operations & Algebraic Thinking': 'Operations & Algebra',
    'Number & Operations—Fractions': 'Fractions',
    'Measurement & Data': 'Measurement & Data',
    'Counting & Cardinality': 'Counting & Cardinality',
    'Ratios & Proportional Relationships': 'Ratios & Proportions',
    'Expressions & Equations': 'Expressions & Equations'
};

/**
 * Initialize the application
 */
async function init() {
    try {
        await loadStandardsData();
        setupEventListeners();
        selectInitialStandard();
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showError('Failed to load standards data. Please refresh the page.');
    }
}

/**
 * Load standards data from JSON file
 */
async function loadStandardsData() {
    try {
        const response = await fetch('standards-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        standardsData = await response.json();
    } catch (error) {
        console.error('Error loading standards data:', error);
        throw error;
    }
}

/**
 * Set up event listeners for user interactions
 */
function setupEventListeners() {
    // Grade selector
    gradeSelector.addEventListener('change', handleGradeChange);
    
    // Navigation tree (using event delegation)
    navigationTree.addEventListener('click', handleNavClick);
    navigationTree.addEventListener('keydown', handleKeyboard);
    
    // Focus management
    document.addEventListener('keydown', handleGlobalKeyboard);
}

/**
 * Select initial standard (Kindergarten > Counting & Cardinality)
 */
function selectInitialStandard() {
    gradeSelector.value = 'K';
    currentSelection.grade = 'K';
    currentSelection.gradeName = 'Kindergarten';
    
    updateNavigation();
    
    // Auto-select first domain (Counting & Cardinality)
    const firstDomain = standardsData.grades[currentSelection.grade].domains['CC'];
    if (firstDomain) {
        currentSelection.expandedDomain = 'CC';
        selectDomain('CC', firstDomain);
    }
}

/**
 * Handle grade selector change
 */
function handleGradeChange(event) {
    const selectedGrade = event.target.value;
    const gradeData = standardsData.grades[selectedGrade];
    
    if (!gradeData) {
        console.warn(`No data found for grade: ${selectedGrade}`);
        return;
    }
    
    // Reset selection state
    currentSelection = {
        grade: selectedGrade,
        gradeName: gradeData.name,
        domain: null,
        domainName: null,
        cluster: null,
        clusterName: null,
        standard: null,
        standardCode: null,
        standardText: null,
        subStandard: null,
        subStandardCode: null,
        subStandardText: null
    };
    
    updateNavigation();
    updatePreview();
    updateBreadcrumb();
}

/**
 * Handle navigation clicks
 */
function handleNavClick(event) {
    const button = event.target.closest('.nav-toggle, .nav-link');
    if (!button) return;
    
    const navItem = button.closest('.nav-item');
    const level = navItem.dataset.level;
    const id = navItem.dataset.id;
    
    event.preventDefault();
    
    switch (level) {
        case 'domain':
            handleDomainClick(id);
            break;
        case 'cluster':
            handleClusterClick(id);
            break;
        case 'standard':
            handleStandardClick(id);
            break;
        case 'substandard':
            selectSubStandard(id, getSubStandardData(id));
            break;
    }
}

/**
 * Handle domain click with toggle logic
 */
function handleDomainClick(domainId) {
    if (currentSelection.expandedDomain === domainId) {
        // Clicking same domain - just toggle expansion
        currentSelection.expandedDomain = null;
    } else {
        // New domain - expand and select
        currentSelection.expandedDomain = domainId;
        selectDomain(domainId, getDomainData(domainId));
        // Clear lower level expansions
        currentSelection.expandedCluster = null;
        currentSelection.expandedStandard = null;
    }
    updateNavigation();
    updatePreview();
    updateBreadcrumb();
}

/**
 * Handle cluster click with toggle logic
 */
function handleClusterClick(clusterId) {
    if (currentSelection.expandedCluster === clusterId) {
        // Clicking same cluster - just toggle expansion
        currentSelection.expandedCluster = null;
    } else {
        // New cluster - expand and select
        currentSelection.expandedCluster = clusterId;
        selectCluster(clusterId, getClusterData(clusterId));
        // Clear lower level expansions
        currentSelection.expandedStandard = null;
    }
    updateNavigation();
    updatePreview();
    updateBreadcrumb();
}

/**
 * Handle standard click with toggle logic
 */
function handleStandardClick(standardCode) {
    const standardData = getStandardData(standardCode);
    
    if (standardData.subStandards) {
        // Standard with sub-standards - toggle behavior
        if (currentSelection.expandedStandard === standardCode) {
            // Clicking same standard - just toggle expansion
            currentSelection.expandedStandard = null;
        } else {
            // New standard - expand and select
            currentSelection.expandedStandard = standardCode;
            selectStandard(standardCode, standardData);
        }
        updateNavigation();
        updatePreview();
        updateBreadcrumb();
    } else {
        // Standard without sub-standards - just select
        selectStandard(standardCode, standardData);
    }
}

/**
 * Handle keyboard navigation
 */
function handleKeyboard(event) {
    const focusedItem = event.target.closest('.nav-item');
    if (!focusedItem) return;
    
    switch (event.key) {
        case 'Enter':
        case ' ':
            event.preventDefault();
            event.target.click();
            break;
        case 'ArrowRight':
            if (focusedItem.dataset.level === 'domain' || focusedItem.dataset.level === 'cluster') {
                event.preventDefault();
                expandItem(focusedItem);
            }
            break;
        case 'ArrowLeft':
            if (focusedItem.dataset.expanded === 'true') {
                event.preventDefault();
                collapseItem(focusedItem);
            }
            break;
        case 'ArrowDown':
            event.preventDefault();
            focusNextItem(focusedItem);
            break;
        case 'ArrowUp':
            event.preventDefault();
            focusPreviousItem(focusedItem);
            break;
    }
}

/**
 * Handle global keyboard shortcuts
 */
function handleGlobalKeyboard(event) {
    if (event.key === 'Escape') {
        // Close all expanded sections
        const expandedItems = navigationTree.querySelectorAll('.nav-item[data-expanded="true"]');
        expandedItems.forEach(item => collapseItem(item));
    }
}

/**
 * Generate navigation HTML for current grade
 */
function generateNavHTML() {
    if (!currentSelection.grade || !standardsData.grades[currentSelection.grade]) {
        return '<p class="nav-message">Please select a grade level.</p>';
    }
    
    const gradeData = standardsData.grades[currentSelection.grade];
    const domains = gradeData.domains;
    
    if (!domains || Object.keys(domains).length === 0) {
        return '<p class="nav-message">No standards available for this grade.</p>';
    }
    
    let html = '';
    
    Object.entries(domains).forEach(([domainId, domainData]) => {
        const shortName = getNavLabel(domainData.name);
        const isSelected = currentSelection.domain === domainId;
        const isExpanded = currentSelection.expandedDomain === domainId;
        const showChildren = isExpanded;
        
        html += `
            <div class="nav-item domain-item ${isSelected ? 'selected' : ''}" 
                 data-level="domain" 
                 data-id="${domainId}"
                 data-expanded="${isExpanded}">
                <button class="nav-toggle" aria-expanded="${isExpanded}" tabindex="0">
                    <span class="expand-icon">${isExpanded ? '▼' : '▶'}</span>
                    <span class="nav-label">${shortName}</span>
                </button>
                <div class="nav-children" ${!showChildren ? 'hidden' : ''}>
                    ${generateClustersHTML(domainId, domainData.clusters)}
                </div>
            </div>
        `;
    });
    
    return html;
}

/**
 * Generate clusters HTML for a domain
 */
function generateClustersHTML(domainId, clusters) {
    if (!clusters) return '';
    
    let html = '';
    
    Object.entries(clusters).forEach(([clusterId, clusterData]) => {
        const fullClusterId = `${domainId}.${clusterId}`;
        const shortName = getNavLabel(clusterData.name);
        const isSelected = currentSelection.cluster === fullClusterId;
        const isExpanded = currentSelection.expandedCluster === fullClusterId;
        const showChildren = isExpanded;
        
        html += `
            <div class="nav-item cluster-item ${isSelected ? 'selected' : ''}" 
                 data-level="cluster" 
                 data-id="${fullClusterId}"
                 data-expanded="${isExpanded}">
                <button class="nav-toggle" aria-expanded="${isExpanded}" tabindex="0">
                    <span class="expand-icon">${isExpanded ? '▼' : '▶'}</span>
                    <span class="nav-label">${shortName}</span>
                </button>
                <div class="nav-children" ${!showChildren ? 'hidden' : ''}>
                    ${generateStandardsHTML(fullClusterId, clusterData.standards)}
                </div>
            </div>
        `;
    });
    
    return html;
}

/**
 * Generate standards HTML for a cluster
 */
function generateStandardsHTML(clusterId, standards) {
    if (!standards) return '';
    
    let html = '';
    
    Object.entries(standards).forEach(([standardId, standardData]) => {
        const isSelected = currentSelection.standard === standardData.code;
        const hasSubStandards = standardData.subStandards;
        const isExpanded = currentSelection.expandedStandard === standardData.code;
        const showChildren = isExpanded;
        const displayName = standardData.name || standardData.code;
        
        if (hasSubStandards) {
            html += `
                <div class="nav-item standard-item ${isSelected ? 'selected' : ''}" 
                     data-level="standard" 
                     data-id="${standardData.code}"
                     data-expanded="${isExpanded}">
                    <button class="nav-toggle" aria-expanded="${isExpanded}" tabindex="0">
                        <span class="expand-icon">${isExpanded ? '▼' : '▶'}</span>
                        <span class="nav-label">${displayName}</span>
                    </button>
                    <div class="nav-children" ${!showChildren ? 'hidden' : ''}>
                        ${generateSubStandardsHTML(standardData.subStandards)}
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="nav-item standard-item ${isSelected ? 'selected' : ''}" 
                     data-level="standard" 
                     data-id="${standardData.code}">
                    <button class="nav-link" tabindex="0">
                        <span class="nav-label">${displayName}</span>
                    </button>
                </div>
            `;
        }
    });
    
    return html;
}

/**
 * Generate sub-standards HTML
 */
function generateSubStandardsHTML(subStandards) {
    if (!subStandards) return '';
    
    let html = '';
    
    Object.entries(subStandards).forEach(([subId, subData]) => {
        const isSelected = currentSelection.subStandard === subData.code;
        const displayName = subData.name || subData.code;
        
        html += `
            <div class="nav-item substandard-item ${isSelected ? 'selected' : ''}" 
                 data-level="substandard" 
                 data-id="${subData.code}">
                <button class="nav-link" tabindex="0">
                    <span class="nav-label">${displayName}</span>
                </button>
            </div>
        `;
    });
    
    return html;
}

/**
 * Select a domain
 */
function selectDomain(domainId, domainData) {
    currentSelection.domain = domainId;
    currentSelection.domainName = domainData.name;
    currentSelection.cluster = null;
    currentSelection.clusterName = null;
    currentSelection.standard = null;
    currentSelection.standardCode = null;
    currentSelection.standardText = null;
    currentSelection.subStandard = null;
    currentSelection.subStandardCode = null;
    currentSelection.subStandardText = null;
    
    updateNavigation();
    updatePreview();
    updateBreadcrumb();
}

/**
 * Select a cluster
 */
function selectCluster(clusterId, clusterData) {
    const [domainId] = clusterId.split('.');
    
    currentSelection.cluster = clusterId;
    currentSelection.clusterName = clusterData.name;
    currentSelection.standard = null;
    currentSelection.standardCode = null;
    currentSelection.standardText = null;
    currentSelection.subStandard = null;
    currentSelection.subStandardCode = null;
    currentSelection.subStandardText = null;
    
    updateNavigation();
    updatePreview();
    updateBreadcrumb();
}

/**
 * Select a standard
 */
function selectStandard(standardCode, standardData) {
    currentSelection.standard = standardCode;
    currentSelection.standardCode = standardCode;
    currentSelection.standardText = standardData.text;
    currentSelection.subStandard = null;
    currentSelection.subStandardCode = null;
    currentSelection.subStandardText = null;
    
    updateNavigation();
    updatePreview();
    updateBreadcrumb();
}

/**
 * Select a sub-standard
 */
function selectSubStandard(subStandardCode, subStandardData) {
    currentSelection.subStandard = subStandardCode;
    currentSelection.subStandardCode = subStandardCode;
    currentSelection.subStandardText = subStandardData.text;
    
    updateNavigation();
    updatePreview();
    updateBreadcrumb();
}

/**
 * Toggle expansion of navigation item
 */
function toggleExpansion(element) {
    const isExpanded = element.dataset.expanded === 'true';
    if (isExpanded) {
        collapseItem(element);
    } else {
        expandItem(element);
    }
}

/**
 * Expand navigation item
 */
function expandItem(element) {
    element.dataset.expanded = 'true';
    const toggle = element.querySelector('.nav-toggle');
    const children = element.querySelector('.nav-children');
    
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    if (children) children.hidden = false;
}

/**
 * Collapse navigation item
 */
function collapseItem(element) {
    element.dataset.expanded = 'false';
    const toggle = element.querySelector('.nav-toggle');
    const children = element.querySelector('.nav-children');
    
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (children) children.hidden = true;
}

/**
 * Update navigation display
 */
function updateNavigation() {
    navigationTree.innerHTML = generateNavHTML();
}

/**
 * Update preview panel content
 */
function updatePreview() {
    const content = generatePreviewHTML();
    previewContent.innerHTML = content;
}

/**
 * Generate preview HTML based on current selection
 */
function generatePreviewHTML() {
    if (!currentSelection.grade) {
        return `
            <div class="preview-placeholder">
                <h3>Welcome to the Common Core Standards Browser</h3>
                <p>Select a grade level above to begin browsing mathematics standards.</p>
                <p>Click on domains, clusters, or individual standards to view their content.</p>
            </div>
        `;
    }
    
    if (currentSelection.subStandard && currentSelection.subStandardText) {
        return generateSubStandardPreview();
    } else if (currentSelection.standard && currentSelection.standardText) {
        return generateStandardPreview();
    } else if (currentSelection.cluster && currentSelection.clusterName) {
        return generateClusterPreview();
    } else if (currentSelection.domain && currentSelection.domainName) {
        return generateDomainPreview();
    } else {
        return generateGradePreview();
    }
}

/**
 * Generate domain preview
 */
function generateDomainPreview() {
    const domainData = getDomainData(currentSelection.domain);
    const clusters = domainData.clusters;
    
    let html = `
        <div class="standard-content">
            <h3>${domainData.fullName}</h3>
            <div class="standard-code">${currentSelection.grade}.${currentSelection.domain}</div>
            ${domainData.text ? `<div class="standard-text">${domainData.text}</div>` : ''}
        </div>
    `;
    
    if (clusters && Object.keys(clusters).length > 0) {
        html += `
            <div class="clusters-section">
                <h4>Clusters in this Domain:</h4>
        `;
        
        Object.entries(clusters).forEach(([clusterId, clusterData]) => {
            html += `
                <div class="cluster-item-preview">
                    <div class="cluster-header"><strong>${currentSelection.grade}.${currentSelection.domain}.${clusterId}:</strong> ${clusterData.name}</div>
                    ${clusterData.text ? `<div class="cluster-description">${clusterData.text}</div>` : ''}
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    return html;
}

/**
 * Generate cluster preview
 */
function generateClusterPreview() {
    const clusterData = getClusterData(currentSelection.cluster);
    const standards = clusterData.standards;
    
    let html = `
        <div class="standard-content">
            <h3>${clusterData.name}</h3>
            <div class="standard-code">${currentSelection.grade}.${currentSelection.domain}.${currentSelection.cluster.split('.')[1]}</div>
            ${clusterData.text ? `<div class="standard-text">${clusterData.text}</div>` : ''}
        </div>
    `;
    
    if (standards && Object.keys(standards).length > 0) {
        html += `
            <div class="standards-section">
                <h4>Standards in this Cluster:</h4>
        `;
        
        Object.entries(standards).forEach(([standardId, standardData]) => {
            const standardName = standardData.name || standardData.code;
            html += `
                <div class="standard-item-preview">
                    <div class="standard-header"><strong>${standardName}</strong></div>
                    <div class="standard-code">${standardData.code}</div>
                    <div class="standard-text">${standardData.text}</div>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    return html;
}

/**
 * Generate standard preview
 */
function generateStandardPreview() {
    const standardData = getStandardData(currentSelection.standard);
    const standardName = standardData?.name || currentSelection.standardCode;
    
    let html = `
        <div class="standard-content">
            <h3>${standardName}</h3>
            <div class="standard-code">${currentSelection.standardCode}</div>
            <div class="standard-text">${currentSelection.standardText}</div>
        </div>
    `;
    
    if (standardData.subStandards) {
        html += `
            <div class="substandards-section">
                <h4 class="substandards-title">Sub-standards:</h4>
        `;
        
        Object.entries(standardData.subStandards).forEach(([subId, subData]) => {
            html += `
                <div class="substandard-item-preview">
                    <div class="substandard-code">${subData.code}</div>
                    <div class="substandard-text">${subData.text}</div>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    return html;
}

/**
 * Generate sub-standard preview
 */
function generateSubStandardPreview() {
    const subStandardData = getSubStandardData(currentSelection.subStandardCode);
    const subStandardName = subStandardData?.name || currentSelection.subStandardCode;
    
    return `
        <div class="standard-content">
            <h3>${subStandardName}</h3>
            <div class="standard-code">${currentSelection.subStandardCode}</div>
            <div class="standard-text">${currentSelection.subStandardText}</div>
        </div>
    `;
}

/**
 * Generate grade preview
 */
function generateGradePreview() {
    const gradeData = standardsData.grades[currentSelection.grade];
    const domains = gradeData.domains;
    
    let html = `
        <div class="standard-content">
            <h3>${gradeData.name} Mathematics Standards</h3>
        </div>
    `;
    
    if (domains && Object.keys(domains).length > 0) {
        html += `
            <div class="domains-section">
                <h4>Domains for ${gradeData.name}:</h4>
        `;
        
        Object.entries(domains).forEach(([domainId, domainData]) => {
            html += `
                <div class="domain-item-preview">
                    <div class="standard-code">${currentSelection.grade}.${domainId}</div>
                    <strong>${domainData.fullName}</strong>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    return html;
}

/**
 * Update breadcrumb navigation
 */
function updateBreadcrumb() {
    breadcrumbPath.innerHTML = generateBreadcrumb();
}

/**
 * Generate breadcrumb HTML
 */
function generateBreadcrumb() {
    const parts = [];
    
    if (currentSelection.gradeName) parts.push(currentSelection.gradeName);
    if (currentSelection.domainName) parts.push(currentSelection.domainName);
    if (currentSelection.clusterName) parts.push(currentSelection.clusterName);
    if (currentSelection.standardCode) parts.push(currentSelection.standardCode);
    if (currentSelection.subStandardCode && currentSelection.subStandardCode !== currentSelection.standardCode) {
        parts.push(currentSelection.subStandardCode);
    }
    
    if (parts.length === 0) {
        return '<span class="breadcrumb-item">Select a grade to begin</span>';
    }
    
    return parts.map((part, index) => {
        const isLast = index === parts.length - 1;
        const className = isLast ? 'breadcrumb-item current' : 'breadcrumb-item';
        return `<span class="${className}">${part}</span>`;
    }).join(' <span class="breadcrumb-separator">›</span> ');
}

/**
 * Get appropriate navigation label (shortened if needed)
 */
function getNavLabel(fullName, maxLength = 25) {
    if (navLabels[fullName]) return navLabels[fullName];
    if (fullName.length <= maxLength) return fullName;
    return fullName.substring(0, maxLength - 3) + '...';
}

/**
 * Get domain data for current selection
 */
function getDomainData(domainId) {
    return standardsData.grades[currentSelection.grade]?.domains[domainId];
}

/**
 * Get cluster data for current selection
 */
function getClusterData(clusterId) {
    const [domainId, clusterKey] = clusterId.split('.');
    return standardsData.grades[currentSelection.grade]?.domains[domainId]?.clusters[clusterKey];
}

/**
 * Get standard data by code
 */
function getStandardData(standardCode) {
    const gradeData = standardsData.grades[currentSelection.grade];
    if (!gradeData) return null;
    
    for (const [domainId, domainData] of Object.entries(gradeData.domains)) {
        if (!domainData.clusters) continue;
        
        for (const [clusterKey, clusterData] of Object.entries(domainData.clusters)) {
            if (!clusterData.standards) continue;
            
            for (const [standardKey, standardData] of Object.entries(clusterData.standards)) {
                if (standardData.code === standardCode) {
                    return standardData;
                }
            }
        }
    }
    
    return null;
}

/**
 * Get sub-standard data by code
 */
function getSubStandardData(subStandardCode) {
    const gradeData = standardsData.grades[currentSelection.grade];
    if (!gradeData) return null;
    
    for (const [domainId, domainData] of Object.entries(gradeData.domains)) {
        if (!domainData.clusters) continue;
        
        for (const [clusterKey, clusterData] of Object.entries(domainData.clusters)) {
            if (!clusterData.standards) continue;
            
            for (const [standardKey, standardData] of Object.entries(clusterData.standards)) {
                if (standardData.subStandards) {
                    for (const [subKey, subData] of Object.entries(standardData.subStandards)) {
                        if (subData.code === subStandardCode) {
                            return subData;
                        }
                    }
                }
            }
        }
    }
    
    return null;
}

/**
 * Focus next navigation item
 */
function focusNextItem(currentItem) {
    const allItems = Array.from(navigationTree.querySelectorAll('.nav-toggle, .nav-link'));
    const currentIndex = allItems.findIndex(item => item.closest('.nav-item') === currentItem);
    
    if (currentIndex >= 0 && currentIndex < allItems.length - 1) {
        allItems[currentIndex + 1].focus();
    }
}

/**
 * Focus previous navigation item
 */
function focusPreviousItem(currentItem) {
    const allItems = Array.from(navigationTree.querySelectorAll('.nav-toggle, .nav-link'));
    const currentIndex = allItems.findIndex(item => item.closest('.nav-item') === currentItem);
    
    if (currentIndex > 0) {
        allItems[currentIndex - 1].focus();
    }
}

/**
 * Show error message
 */
function showError(message) {
    previewContent.innerHTML = `
        <div class="error-message">
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);