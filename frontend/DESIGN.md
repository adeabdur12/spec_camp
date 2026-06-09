# Design System Strategy: The Equestrian Editorial

## 1. Overview & Creative North Star
This design system is built upon the Creative North Star of **"The Pastoral Prestige."** It moves away from the generic "rugged outdoors" aesthetic, instead leaning into a high-end equestrian editorial feel—think luxury stables and heritage country clubs. 

The system breaks the traditional "template" look through **intentional asymmetry** and **tonal depth**. By utilizing a sophisticated palette of forest greens and warm clays, we create an experience that feels like a physical brochure from a premier estate. We favor large, breathing white space (using our `surface` tokens) over cluttered grids, allowing high-resolution nature photography to act as a structural element in the layout.

## 2. Colors: Tonal Atmosphere
The palette is a direct translation of the Sukabumi landscape: deep forest greens, sun-scorched oranges, and the creamy white of fine stationery.

### Palette Highlights
*   **Primary (`#17341c`):** Our "Heritage Green." Use for high-authority elements and headers.
*   **Secondary (`#80551b`):** "Saddle Tan." This provides the equestrian warmth and should be used for interactive elements that require a premium touch.
*   **Tertiary (`#4c2300`):** "Deep Clay." Used for high-contrast accents and specialized containers.
*   **Surface (`#fcf9f2`):** Our canvas. It is not pure white, but a warm, organic off-white that reduces eye strain and feels more premium.

### The "No-Line" Rule
**Traditional 1px borders are strictly prohibited for sectioning.** To define different areas of content, you must use color-blocking. 
*   Place a `surface_container_low` block against a `surface` background to create a section.
*   Use `primary_container` for dark, immersive sections where white text (`on_primary_container`) can shine.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked materials. 
*   **Base:** `surface`
*   **Cards/Sections:** `surface_container` or `surface_container_low`
*   **Floating Elements:** `surface_container_highest`
By shifting the background color slightly between nested containers, we create depth that feels organic rather than digital.

### The "Glass & Gradient" Rule
For hero sections or floating navigation, use **Glassmorphism**. Apply `surface` at 70% opacity with a `24px` backdrop blur. To add "soul" to buttons or hero overlays, use subtle linear gradients from `primary` to `primary_container` (Top-Left to Bottom-Right) to mimic the way light hits a forest canopy.

## 3. Typography: The Editorial Voice
Our typography pairing is designed for high-end readability and bold brand expression.

*   **Display & Headlines (Epilogue):** A bold, slightly architectural sans-serif. It conveys the "Prestige" in the equestrian center's name. Use `display-lg` for hero statements with tight letter-spacing (-0.02em) to create an authoritative editorial look.
*   **Body & Titles (Manrope):** A modern, highly legible geometric sans-serif. Manrope provides the "Modern & Clean" balance to the more aggressive headlines. 
*   **Hierarchy Note:** Always maintain a significant scale jump between `headline-lg` and `body-lg`. This "High-Contrast" scale is what gives the system its premium, magazine-like quality.

## 4. Elevation & Depth: Tonal Layering
In this design system, elevation is a feeling, not a drop-shadow effect.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface_container_lowest` card placed on a `surface_container` background creates a natural "lift."
*   **Ambient Shadows:** If a floating component (like a booking modal) requires a shadow, use the `on_surface` color at 5% opacity with a `40px` blur and `10px` Y-offset. This mimics soft, natural sunlight rather than harsh digital light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use `outline_variant` at **15% opacity**. It should be felt, not seen.
*   **Roundedness:** We use a signature `lg` (1rem/16px) corner for cards and `full` (pill-shape) for buttons. This softens the "Adventure" aspect, making it feel safe and professional.

## 5. Components: Equestrian Precision

### Buttons
*   **Primary:** `primary` background with `on_primary` text. Use `full` roundedness. 
*   **Secondary:** `secondary_container` background. This "Earthy Tan" variant should be used for secondary calls to action like "View Gallery."
*   **State:** On hover, apply a subtle gradient shift or a 10% overlay of `on_surface`.

### Input Fields
*   **Style:** No heavy borders. Use `surface_container_high` as the background fill with a `sm` (0.25rem) rounded corner.
*   **Active State:** Transition the background to `surface_container_highest` and add a "Ghost Border" of `primary` at 20% opacity.

### Cards & Lists
*   **Cards:** Forbid divider lines. Separate content using the Spacing Scale (e.g., `8` (2rem) between header and body text).
*   **Lists:** Use `surface_container_low` backgrounds for every other list item to create a "Zebra" effect that feels intentional and clean, rather than using lines.

### Equestrian-Specific Components
*   **Status Badges:** Use `tertiary_fixed` for "Limited Availability" or "Special Event" tags. The warm orange mimics the glow of a campfire and captures immediate attention.
*   **Image Overlays:** Images of the horses or campgrounds should use a `primary` (Forest Green) color-burn overlay at 10% to unify photography with the brand colors.

## 6. Do's and Don'ts

### Do
*   **DO** use white space as a luxury. If a section feels crowded, double the spacing token (e.g., move from `8` to `16`).
*   **DO** use large-scale typography. Let headlines overlap image containers slightly for a custom, bespoke feel.
*   **DO** use the `secondary` (Tan) and `tertiary` (Orange) colors as "spices"—sparingly but impactfully.

### Don't
*   **DON'T** use 1px solid black or grey borders. This instantly cheapens the "Prestige" brand.
*   **DON'T** use standard "Drop Shadows." Stick to Tonal Layering or Ambient Shadows.
*   **DON'T** use generic icons. Use thin-stroke, custom iconography that matches the refined weight of the Manrope typeface.