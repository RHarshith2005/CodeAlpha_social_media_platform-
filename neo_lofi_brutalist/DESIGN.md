---
name: Neo-LoFi Brutalist
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#444933'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#747a60'
  outline-variant: '#c4c9ac'
  surface-tint: '#506600'
  primary: '#506600'
  on-primary: '#ffffff'
  primary-container: '#ccff00'
  on-primary-container: '#5b7300'
  inverse-primary: '#abd600'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#ededed'
  on-tertiary-container: '#696b6b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: DotGothic16
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: DotGothic16
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
  headline-md:
    fontFamily: DotGothic16
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: DotGothic16
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.2'
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
  headline-lg-mobile:
    fontFamily: DotGothic16
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.1'
spacing:
  unit: 8px
  border-width: 2px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 40px
  hard-shadow-offset: 4px
---

## Brand & Style
The design system is a deliberate collision between the raw, unpolished energy of the early web and the structured precision of modern high-fidelity interfaces. It embraces a "Neo-LoFi" aesthetic—utilizing Digital Brutalism to evoke a sense of transparency, technical honesty, and creative rebellion.

The emotional response should be one of immediate clarity and "engineered" coolness. It targets a creative, tech-savvy audience that values functionality over decorative fluff. The style is defined by its refusal to hide the "seams" of the interface: borders are thick, corners are sharp, and gradients are dithered rather than smooth. It feels like a high-end terminal from an alternate-reality 1995.

## Colors
The palette is hyper-restricted to maximize visual impact through high contrast.

- **Primary (Electric Lime):** Used exclusively for calls to action, active states, and critical highlights. It acts as the "signal" within the noise.
- **Secondary (Deep Black):** Used for all structural elements, including borders, typography, and heavy "hard shadows."
- **Neutral (White/Off-White):** Provides the stark, clinical canvas that allows the black structural lines to define the space.

Dithering patterns (checkered 1px patterns of black and white) should be used to create pseudo-transparency or "shaded" areas without introducing gray scales.

## Typography
Typography is the core of this design system's character. 

**DotGothic16** (Pixel font) is reserved for headlines and UI accents. It should always be set to a size that maintains its pixel integrity—avoiding sub-pixel anti-aliasing where possible to keep the "lo-fi" look crisp.

**JetBrains Mono** provides the functional balance. Its technical, monospaced nature ensures that even large blocks of text feel "encoded" and precise. Use heavy weights for labels to ensure they stand out against the stark background.

## Layout & Spacing
The layout follows a rigid 12-column fixed grid for desktop, moving to a single column for mobile. 

The "spacing rhythm" is strictly based on 8px increments. Elements are often grouped within "containers" that utilize a fixed 2px border. Rather than using whitespace to separate components, this design system uses these 2px borders to box in content, creating a dense, windowed environment.

**Key Rules:**
- **Padding:** Use 16px or 24px internal padding for containers.
- **Gutters:** 16px between columns to maintain a "tight" technical feel.
- **Alignment:** All elements must snap to the 8px grid. No "soft" centered alignments; prefer hard-left or hard-right justifications.

## Elevation & Depth
Depth is created through "Hard Shadows" rather than blurs. 

- **Primary Elevation:** A solid black box offset by 4px or 8px (bottom-right) behind the main container.
- **Active State Elevation:** When an element is pressed, the hard shadow disappears, and the element "moves" 2px down and right to simulate physical displacement.
- **Dithered Layers:** For secondary depth or background separation, use a 50% dithered pattern (checkerboard) to create a "shaded" effect without using soft shadows or transparency.
- **Structural Stacking:** Use overlapping containers with 2px borders. The intersection of these lines creates a complex, architectural depth.

## Shapes
The shape language is strictly orthogonal. 

- **Corners:** 0px radius for all elements. This includes buttons, inputs, cards, and even image containers.
- **Borders:** Every interactive or containing element must have a 2px solid black border. 
- **Dividers:** Use 2px solid black lines for horizontal and vertical rules.

## Components
Consistent styling across components reinforces the Neo-LoFi aesthetic.

- **Buttons:** Sharp corners, 2px border, white background. On hover, the background fills with Electric Lime. Use a 4px black hard shadow that disappears on "active" (click) to simulate a physical button press.
- **Inputs:** 2px black border with a 1px dithered internal shadow for "inset" depth. Use JetBrains Mono for all user-entered text.
- **Cards/Windows:** Containers must feature a "Title Bar"—a solid black strip at the top with the title set in DotGothic16 (White text).
- **Chips/Tags:** Small rectangular boxes with 2px borders. Use JetBrains Mono bold at 10px-12px for the label.
- **Checkboxes:** Standard 16x16px squares with 2px borders. When checked, the box is filled with a solid "X" or a solid Electric Lime block.
- **Lists:** Separated by 2px horizontal lines. Hovering over a list item should trigger a full background fill of Electric Lime.