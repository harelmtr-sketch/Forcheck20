// Production-ready design system
// Centralized styles for consistency across the app

// ===========================
// TYPOGRAPHY
// ===========================
export const typography = {
  // Headers
  h1: 'text-2xl font-bold text-white',
  h2: 'text-xl font-bold text-white',
  h3: 'text-lg font-bold text-white',
  h4: 'text-base font-bold text-white',
  
  // Body text
  body: 'text-sm text-white',
  bodyMuted: 'text-sm text-white/70',
  
  // Small text
  small: 'text-xs text-white',
  smallMuted: 'text-xs text-white/60',
  
  // Labels
  label: 'text-xs font-medium text-white/70 uppercase tracking-wide',
  
  // Stats
  statLarge: 'text-3xl font-black text-white',
  statMedium: 'text-2xl font-black text-white',
  statSmall: 'text-xl font-black text-white',
};

// ===========================
// SPACING
// ===========================
export const spacing = {
  // Section spacing
  section: 'space-y-6',
  sectionSmall: 'space-y-4',
  
  // Card padding
  cardPadding: 'p-4',
  cardPaddingLarge: 'p-6',
  
  // List gaps
  listGap: 'space-y-3',
  listGapSmall: 'space-y-2',
  
  // Grid gaps
  gridGap: 'gap-3',
  gridGapSmall: 'gap-2',
  
  // Page padding
  pagePadding: 'px-4 py-6',
  pageX: 'px-4',
  pageY: 'py-6',
};

// ===========================
// COLORS & SURFACES
// ===========================
export const surfaces = {
  // Card surfaces
  card: 'bg-gray-900/90 border border-gray-800/80',
  cardHover: 'hover:bg-gray-900/95 hover:border-gray-700/80',
  cardPressed: 'bg-gray-900/95 border-gray-700/80',
  
  // Elevated cards (slightly lighter)
  cardElevated: 'bg-gray-900/95 border border-gray-700/80',
  
  // Action surfaces (blue accent)
  cardAction: 'bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/40',
  cardActionHover: 'hover:border-blue-500/60',
  
  // Intensity surfaces (red accent)
  cardIntensity: 'bg-gradient-to-br from-red-600/20 to-red-500/10 border border-red-500/40',
  
  // Input surfaces
  input: 'bg-gray-900/50 border border-gray-800/80',
  inputFocused: 'border-blue-500/60',
};

// ===========================
// SHADOWS & ELEVATION
// ===========================
export const elevation = {
  // Default card shadow
  card: 'shadow-lg shadow-black/20',
  
  // Pressed state (less shadow)
  cardPressed: 'shadow-md shadow-black/10',
  
  // Elevated/hover state
  cardElevated: 'shadow-xl shadow-black/30',
  
  // Action elements (blue)
  action: 'shadow-lg shadow-blue-500/10',
  actionHover: 'hover:shadow-xl hover:shadow-blue-500/15',
  
  // Intensity elements (red)
  intensity: 'shadow-lg shadow-red-500/10',
  intensityHover: 'hover:shadow-xl hover:shadow-red-500/15',
};

// ===========================
// INTERACTION STATES
// ===========================
export const interactions = {
  // Default tappable
  tappable: 'cursor-pointer transition-all duration-200',
  
  // Hover states
  hover: 'hover:scale-[1.02]',
  hoverSubtle: 'hover:opacity-90',
  
  // Pressed states
  pressed: 'active:scale-[0.98]',
  
  // Disabled states
  disabled: 'opacity-50 cursor-not-allowed',
  
  // Focus states
  focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-black',
};

// ===========================
// ANIMATIONS
// ===========================
export const animations = {
  // Page entrance
  pageEnter: 'animate-in fade-in slide-in-from-bottom-4 duration-300',
  
  // Staggered list items
  listItemEnter: 'animate-in fade-in slide-in-from-bottom-2 duration-200',
  
  // Quick transitions
  quick: 'transition-all duration-150',
  standard: 'transition-all duration-200',
  smooth: 'transition-all duration-300',
};

// ===========================
// ICONS & BADGES
// ===========================
export const iconStyles = {
  // Icon containers
  container: 'p-2 rounded-lg border',
  containerSmall: 'p-1.5 rounded-lg border',
  
  // Blue (action) icons
  actionContainer: 'bg-blue-500/20 border-blue-500/40',
  actionIcon: 'text-blue-400',
  
  // Red (intensity) icons
  intensityContainer: 'bg-red-500/20 border-red-500/40',
  intensityIcon: 'text-red-400',
  
  // Neutral icons
  neutralContainer: 'bg-gray-800/50 border-gray-700/50',
  neutralIcon: 'text-gray-400',
  
  // Icon sizes
  iconSmall: 'w-4 h-4',
  iconMedium: 'w-5 h-5',
  iconLarge: 'w-6 h-6',
};

// ===========================
// BUTTONS
// ===========================
export const buttons = {
  // Primary (blue)
  primary: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30',
  
  // Secondary (outline)
  secondary: 'bg-transparent border border-gray-700/80 text-white font-medium hover:bg-gray-800/50 hover:border-gray-600/80',
  
  // Danger (red)
  danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white font-medium shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30',
  
  // Ghost
  ghost: 'bg-transparent text-white/80 font-medium hover:bg-gray-800/50 hover:text-white',
  
  // Common button classes
  base: 'rounded-lg px-4 py-2 text-sm transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed',
};

// ===========================
// LAYOUT
// ===========================
export const layout = {
  // Page container
  page: 'h-full flex flex-col relative overflow-hidden',
  
  // Content area
  content: 'flex-1 overflow-y-auto px-4 py-6 space-y-6 relative z-10',
  
  // Section header
  sectionHeader: 'flex items-center justify-between mb-4',
  
  // Grid layouts
  statsGrid: 'grid grid-cols-3 gap-3',
  
  // List container
  list: 'space-y-3',
};

// ===========================
// HELPER FUNCTIONS
// ===========================

// Combine class names
export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Get complete card classes
export function getCardClasses(variant: 'default' | 'action' | 'intensity' | 'elevated' = 'default') {
  const base = cn(
    'rounded-xl',
    spacing.cardPadding,
    elevation.card,
    interactions.tappable,
    animations.standard
  );
  
  switch (variant) {
    case 'action':
      return cn(base, surfaces.cardAction);
    case 'intensity':
      return cn(base, surfaces.cardIntensity);
    case 'elevated':
      return cn(base, surfaces.cardElevated, elevation.cardElevated);
    default:
      return cn(base, surfaces.card);
  }
}

// Get icon container classes
export function getIconContainerClasses(variant: 'action' | 'intensity' | 'neutral' = 'neutral', size: 'small' | 'medium' = 'medium') {
  const containerSize = size === 'small' ? iconStyles.containerSmall : iconStyles.container;
  
  switch (variant) {
    case 'action':
      return cn(containerSize, iconStyles.actionContainer);
    case 'intensity':
      return cn(containerSize, iconStyles.intensityContainer);
    default:
      return cn(containerSize, iconStyles.neutralContainer);
  }
}

// Get button classes
export function getButtonClasses(variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary') {
  return cn(buttons.base, buttons[variant], interactions.pressed);
}
