# Design System Document: The Global Curator

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Global Curator**. 

In an era of information overload, we reject the "generic database" aesthetic. We are building a high-end editorial experience that treats geographical data as a curated exhibition. To move beyond a standard template, this system utilizes **intentional asymmetry** and **tonal depth**. Instead of a rigid, predictable grid, we use expansive white space (or "dark space") and overlapping elements to create a sense of discovery. The layout should feel like a premium digital magazine: authoritative, sophisticated, and immersive.

---

## 2. Colors: Tonal Depth over Structural Lines
We define our world through light and shadow, not boxes and lines.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. They create visual noise and "trap" data. Instead, boundaries must be defined solely through:
*   **Background Color Shifts:** A `surface-container-low` section sitting on a `surface` background.
*   **Tonal Transitions:** Using color temperature to separate the navigation from the explorer grid.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
*   **Lowest Level:** `surface-container-lowest` (#060e20) for the primary background.
*   **Mid-Level:** `surface-container` (#171f33) for main content areas.
*   **Highest Level:** `surface-container-highest` (#2d3449) for active interactive elements or modal overlays.
*   **Nesting Logic:** Always place a lighter surface on a darker surface (in dark mode) to simulate a light source coming from the front.

### The "Glass & Gradient" Rule
To achieve a "signature" look, floating elements (like the country search bar or filter chips) should use **Glassmorphism**:
*   **Fill:** `surface_variant` at 60% opacity.
*   **Effect:** `backdrop-filter: blur(12px)`.
*   **Signature Texture:** Primary CTAs should not be flat. Use a subtle linear gradient from `primary` (#4cd6ff) to `primary_container` (#009dc1) at a 135-degree angle to add "soul" and dimension.

---

## 3. Typography: The Editorial Voice
We use a high-contrast scale to establish a clear information hierarchy.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and modern character. Use `display-lg` (3.5rem) for hero country names to create a cinematic impact.
*   **Body & Labels (Inter):** The workhorse. `body-md` (0.875rem) provides maximum legibility for dense data points like population or coordinates.
*   **The Signature Pairing:** Large `headline-lg` titles should be paired with `label-md` uppercase sub-headers. This "Big-Small" contrast is a hallmark of high-end editorial design.

---

## 4. Elevation & Depth
Hierarchy is achieved through **Tonal Layering**, not structural rigidity.

*   **The Layering Principle:** Avoid shadows where color shifts can do the work. Place a `surface-container-low` card on a `surface` background for a natural, soft lift.
*   **Ambient Shadows:** For floating "Global" elements, use extra-diffused shadows. 
    *   *Spec:* `0px 20px 40px rgba(6, 14, 32, 0.4)`. The shadow must be tinted with the `on-surface` color, never pure black.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline_variant` token at **15% opacity**. High-contrast, 100% opaque borders are forbidden.
*   **Glassmorphism Depth:** When a country detail panel slides over the grid, it must use a `backdrop-blur` to maintain the user's context while focusing their attention on the new layer.

---

## 5. Components

### Cards & Lists
*   **Rule:** Forbid divider lines. Use vertical white space or a subtle shift from `surface-container` to `surface-container-high` on hover.
*   **Interaction:** On hover, cards should scale slightly (1.02x) and transition from `surface-container-low` to `surface-bright`.

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `xl` (1.5rem) rounded corners.
*   **Secondary:** Ghost style. No fill, `outline` token at 20% opacity. On hover, fill with `primary` at 10% opacity.

### Input Fields (Search)
*   **Styling:** `surface_container_lowest` fill with a `sm` (0.25rem) "Ghost Border."
*   **Focus State:** The border transitions to `primary` with a 4px `primary_fixed` outer glow (20% opacity).

### Chips (Filters/Regions)
*   **Selection:** Use `secondary_container` for unselected and `primary` for selected.
*   **Shape:** `full` (pill-shaped) to contrast against the `lg` rounded corners of the country cards.

### Contextual Components: The "Data-Lense"
*   **Mini-Maps:** Integrated into cards using a clipped `surface_variant` container.
*   **Stat Groups:** Use `display-sm` for the data value and `label-sm` for the descriptor, aligned with a "High-End Editorial" stagger.

---

## 6. Do's and Don'ts

### Do
*   **DO** use "Breathing Room." If a section feels crowded, increase the padding rather than adding a border.
*   **DO** use `tertiary` (#ffb695) sparingly for "Highlight" data points (e.g., "Capital City") to create visual warmth.
*   **DO** ensure all transitions are `300ms cubic-bezier(0.4, 0, 0.2, 1)` for a "premium" feel.

### Don't
*   **DON'T** use pure black or pure white for backgrounds. Always use the specified surface tokens to maintain tonal depth.
*   **DON'T** use standard "drop shadows." If it looks like a default Photoshop effect, it's wrong.
*   **DON'T** align everything to a center axis. Use the left-heavy editorial alignment for headlines to create a sophisticated, asymmetric rhythm.