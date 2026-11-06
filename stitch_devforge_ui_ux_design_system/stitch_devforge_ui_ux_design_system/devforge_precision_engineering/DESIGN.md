---
name: Devforge Precision Engineering
colors:
  surface: '#f9f9ff'
  surface-dim: '#d1daf4'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8ff'
  surface-container-highest: '#d9e2fc'
  on-surface: '#121b2e'
  on-surface-variant: '#444654'
  inverse-surface: '#273044'
  inverse-on-surface: '#edf0ff'
  outline: '#757686'
  outline-variant: '#c5c5d6'
  surface-tint: '#3a50d1'
  primary: '#364cce'
  on-primary: '#ffffff'
  primary-container: '#5267e8'
  on-primary-container: '#fdfaff'
  inverse-primary: '#bbc3ff'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#924500'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75900'
  on-tertiary-container: '#fff9f8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee0ff'
  primary-fixed-dim: '#bbc3ff'
  on-primary-fixed: '#000e5e'
  on-primary-fixed-variant: '#1c34b9'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#ffdbc7'
  tertiary-fixed-dim: '#ffb688'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#733600'
  background: '#f9f9ff'
  on-background: '#121b2e'
  surface-variant: '#d9e2fc'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies high-craft software engineering: austere, deliberate, and free of superficial ornament. It serves seasoned developers and high-potential engineers pursuing elite technical competencies, where prolonged visual focus, deep work, and cognitive economy are paramount.

The design movement merges **Functional Minimalism** with **Swiss Precision Typography**. Surfaces emulate structured technical workbenches: crisp 1px delineation lines, calm low-contrast neutral fields, and measured bursts of deliberate chromatic intent. Visual noise, aggressive skeuomorphism, and superfluous motion are replaced with mathematical rhythm, scannable hierarchies, and tactile, deterministic feedback states.

## Colors

The palette is engineered to protect ocular stamina across multi-hour coding sessions and intensive documentation review:

- **Primary Accent (`#5267E8`)**: An analytical cobalt blue reserved strictly for focal interactions, primary actions, and current progress vectors.
- **Success / Validation (`#059669`)**: A grounded emerald green indicating passing test suites, completed milestones, and verified code assertions.
- **Canvas Base (`#F8F9FC`)**: A cool, low-glare off-white background that reduces screen luminance without introducing murkiness.
- **Surface Layer (`#FFFFFF`)**: Pure white reserved for modular containers, code cards, and functional modules to create immediate structural clarity against the canvas.
- **Text Primary (`#172033`)**: Deep midnight slate delivering sharp, crisp legibility without the harshness of pure black.
- **Text Muted (`#7B8495`)**: Slate-grey for metadata, inline code descriptions, secondary metrics, and deactivated labels.
- **Structural Borders (`#E9ECF2`)**: Fine structural hairpins that delineate interactive cards and data tables without creating cognitive clutter.
- **Neutral Hover / Interactive Tints (`#F1F4F9`)**: Subtle tactile responses on selectable rows, ghost buttons, and tab headers.

## Typography

The typography pairs **Inter** for clean UI chrome and technical editorial guidance with **JetBrains Mono** for code references, runtime statistics, timestamps, and architectural notations.

Hierarchy is enforced strictly through weight and letter spacing rather than extreme scale jumps:
- Headings leverage negative tracking (`-0.01em` to `-0.025em`) to produce dense, commanding titles.
- Long-form explanations and tutorial texts use generous line-heights (`1.6x` to `1.625x`) to preserve tracking comfort.
- Code notations, function prototypes, and runtime status tags strictly execute in monospaced glyphs to ensure consistent optical alignment alongside structured tabular data.

## Layout & Spacing

The layout is built upon an 8pt base grid within a fluid 12-column system, capped at a maximum workspace width of `1440px`.

- **Breakpoints**:
  - Desktop (`>= 1024px`): 12 columns, `1.5rem` (24px) gutters, `2rem` (32px) page boundaries. Side-by-side IDE / narrative panels.
  - Tablet (`768px - 1023px`): 8 columns, `1.25rem` (20px) gutters, `1.5rem` (24px) margins. Workspace collapse to vertical stacking with persistent tab switching.
  - Mobile (`< 768px`): 4 columns, `1rem` (16px) gutters, `1rem` (16px) canvas padding. Secondary metrics and sidebars fold into top-level summary sheets.
- **Rhythm**: Element internals maintain strict arithmetic proportions. Interactive gaps use `space-sm` (8px) for compact toolbars, `space-md` (16px) inside standard containers, and `space-xl` (40px) between major architectural modules.

## Elevation & Depth

Visual hierarchy does not rely on heavy drop shadows or dramatic blurs. Depth is achieved via **low-contrast outlines and atmospheric surface nesting**:

1. **Base Plane (Level 0)**: The canvas (`#F8F9FC`) establishes ground level.
2. **Structural Plane (Level 1)**: Cards, code containers, and content blocks use crisp `#FFFFFF` surfaces bounded by a 1px border of `#E9ECF2`. Soft ambient lift is applied via `box-shadow: 0 1px 3px 0 rgba(23, 32, 51, 0.04), 0 1px 2px -1px rgba(23, 32, 51, 0.02)`.
3. **Hover Plane (Level 2)**: Lifted modules and active exercises increase definition with a border shift to `#D9DEE7` and a subtle shadow: `0 4px 6px -1px rgba(23, 32, 51, 0.05), 0 2px 4px -2px rgba(23, 32, 51, 0.03)`.
4. **Overlay / Flyout Plane (Level 3)**: Command palettes, popovers, and code inspection overlays float using pure white with `box-shadow: 0 12px 24px -4px rgba(23, 32, 51, 0.08), 0 4px 6px -2px rgba(23, 32, 51, 0.03)` and a solid 1px border in `#E9ECF2`.

## Shapes

The geometric signature uses rounded geometry with controlled corners to balance modern approachability with computational rigor:
- Micro-elements (tooltips, small badges, inline code tags): `rounded` (0.25rem to 0.375rem / 4px - 6px).
- Interactive controls (inputs, buttons, select menus): `rounded-md` (0.5rem / 8px).
- Structural containers (cards, code editors, lesson modules): `rounded-xl` (0.75rem to 1rem / 12px - 16px).
- Status dots, avatars, and progress pills: `rounded-full` (9999px).

## Components

### Buttons
- **Primary**: Background `#5267E8`, text `#FFFFFF`, font-weight 500. Hover: `#4355CC`. Active: `#3847AD`. Padding: `8px 16px`. Transition: `150ms ease-in-out`.
- **Secondary / Outline**: Background `#FFFFFF`, border `1px solid #E9ECF2`, text `#172033`. Hover: background `#F1F4F9`, border `#D9DEE7`.
- **Ghost**: Background transparent, text `#7B8495`. Hover: background `#F1F4F9`, text `#172033`.
- **Destructive**: Background transparent, border `1px solid #FEE2E2`, text `#DC2626`. Hover: background `#FEF2F2`.

### Cards & Content Modules
- Pure `#FFFFFF` fill, `1px solid #E9ECF2` boundary, radius `16px`, padding `24px`.
- Interactive module cards feature smooth hover transitions highlighting the border to `#D9DEE7` without altering card geometry.

### Inputs & Text Areas
- Background `#FFFFFF`, border `1px solid #E9ECF2`, radius `8px`, typography `body-md`.
- Placeholder: `#7B8495`.
- Focus state: `1px solid #5267E8` with a non-intrusive box-shadow ring: `0 0 0 3px rgba(82, 103, 232, 0.12)`.

### Badges & Status Chips
- Height `22px`, font `label-sm`, padding `2px 8px`, radius `6px`.
- **Verification / Success**: Background `rgba(5, 150, 105, 0.08)`, border `1px solid rgba(5, 150, 105, 0.20)`, text `#059669`.
- **In-Progress / Track**: Background `rgba(82, 103, 232, 0.08)`, border `1px solid rgba(82, 103, 232, 0.20)`, text `#5267E8`.
- **Neutral / Meta**: Background `#F1F4F9`, border `1px solid #E9ECF2`, text `#7B8495`.

### Progress Indicators
- Linear track: height `4px` or `6px`, background `#E9ECF2`, radius `9999px`.
- Fill indicator: solid `#5267E8` or `#059669` (upon 100% completion), transition `300ms ease-out`.

### Checkboxes & Radio Controls
- Size: `16px x 16px`.
- Unchecked: background `#FFFFFF`, border `1px solid #D9DEE7`, radius `4px` (checkbox) or `9999px` (radio).
- Checked: background `#5267E8`, border `#5267E8`, inner checkmark `#FFFFFF` stroke `2px`.

### Code Blocks & Terminal Windows
- Background `#FFFFFF` or dark editor variant `#0F172A` with `1px solid #E9ECF2`.
- Top meta bar with file name in `code-inline`, copy action, and language pill. Syntax highlighting balanced to minimize distraction while maximizing operator distinctiveness.