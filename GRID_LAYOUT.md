# Factory Map Grid Layout - Section 3

## Grid Specifications

- **Dimensions**: 4 Columns × 6 Rows + 3 Footer Rows
- **Section**: 3 (Dock Area)

## Inverted Layout

The grid uses an **inverted layout** to match physical factory floor orientation:

### Horizontal Axis (Columns)
- **Column 4** → Far LEFT
- **Column 3** → Center-Left
- **Column 2** → Center-Right
- **Column 1** → Far RIGHT

### Vertical Axis (Rows)
- **Row 6** → TOP
- **Row 5** →
- **Row 4** →
- **Row 3** →
- **Row 2** →
- **Row 1** → BOTTOM

## Location Label Formula

Each cell has a unique label generated using:

```
[Section] + '0' + [Column] + '0' + [Row]
```

### Examples:

| Section | Column | Row | Label |
|---------|--------|-----|-------|
| 3       | 4      | 6   | 30406 |
| 3       | 3      | 5   | 30305 |
| 3       | 2      | 4   | 30204 |
| 3       | 1      | 1   | 30101 |

## Visual Grid Layout (Section 3)

```
        Col 4    Col 3    Col 2    Col 1
      ┌────────┬────────┬────────┬────────┐
Row 6 │ 30406  │ 30306  │ 30206  │ 30106  │
      ├────────┼────────┼────────┼────────┤
Row 5 │ 30405  │ 30305  │ 30205  │ 30105  │
      ├────────┼────────┼────────┼────────┤
Row 4 │ 30404  │ 30304  │ 30204  │ 30104  │
      ├────────┼────────┼────────┼────────┤
Row 3 │ 30403  │ 30303  │ 30203  │ 30103  │
      ├────────┼────────┼────────┼────────┤
Row 2 │ 30402  │ 30302  │ 30202  │ 30102  │
      ├────────┼────────┼────────┼────────┤
Row 1 │ 30401  │ 30301  │ 30201  │ 30101  │
      ├────────┴────────┴────────┴────────┤
      │              126                  │  ← Line/Area
      ├───────────────────────────────────┤
      │              S3                   │  ← Section 3 Dock
      ├───────────────────────────────────┤
      │  🚚 TRUCK RESERVING AREA 🚚       │  ← Loading Zone
      │    (Black/Yellow Stripes)         │     Skid-Gard™ Style
      └───────────────────────────────────┘
```

## Footer Rows

Below the main 6-row grid, three full-width footer rows span all columns:

1. **Row "126"**: Special line/area designation (purple gradient)
2. **Row "S3"**: Section 3 dock identifier (indigo gradient)
3. **Truck Reserving Area**: Loading zone with industrial safety styling
   - Black and yellow diagonal stripes (Skid-Gard™ floor sign pattern)
   - 45° angle repeating pattern
   - Bold yellow text on black overlay
   - Truck icons (🚚) flanking the text
   - Warning caution indicators (⚠️)

## Implementation Details

### Frontend Component: `LocationMap.tsx`

The component includes:

1. **`generateLocationLabel(section, column, row)`**
   - Generates the 5-digit location code
   - Example: `generateLocationLabel(3, 2, 4)` → `"30204"`

2. **`createInvertedGrid()`**
   - Creates the inverted layout
   - Iterates rows from 6→1 (top to bottom)
   - Iterates columns from 4→1 (left to right)
   - Maps backend data to correct visual positions

3. **Modern Visual Design**
   - Gradient backgrounds on all elements
   - Smooth hover effects with scale transforms
   - Shadow elevations for depth
   - Rounded corners (xl borders)
   - Professional color scheme

4. **Grid Cell Features**
   - **Column headers**: COL 4, COL 3, COL 2, COL 1 (blue gradient badges)
   - **Row labels**: R6, R5, R4, R3, R2, R1 (blue gradient badges)
   - Each cell displays:
     - Location label prominently (e.g., 30204)
     - Coil count with 📦 emoji if occupied
     - "EMPTY" watermark for vacant cells
   - **Color coding** (with gradients):
     - Gray gradient: Empty cells
     - Green gradient: Contains RTS (Ready to Ship) coils
     - Yellow gradient: Contains WIP (Work in Progress) coils
     - Blue gradient: Contains other status coils

5. **Footer Rows Styling**
   - **126 Row**: Purple gradient (`from-purple-200 to-purple-300`)
   - **S3 Row**: Indigo gradient (`from-indigo-200 to-indigo-300`)
   - **Truck Reserving Area**:
     - Repeating diagonal stripes: Black (#000) & Gold (#FFD700)
     - 45° angle, 20px stripe width
     - Black overlay badge (90% opacity)
     - Yellow text with tracking-wider spacing
     - Truck emojis (🚚) on both sides
     - Warning: "⚠️ CAUTION: LOADING ZONE ⚠️"
     - Professional industrial safety signage appearance

### Backend Location Parser

Location strings are parsed using `LocationParser.parse()` in `backend/src/common/location-parser.ts`:

- **5-digit format**: "30204" → Section 3, Column 02, Row 04
- **3-digit format**: "126" → Section 1, Column 2, Row 6

Parsed values are stored in the `coils` table:
- `section` (INT)
- `column` (INT)
- `row` (INT)

## Usage

1. Navigate to **Locations** page in the app (http://localhost:3000/locations)
2. Select **Section 3 🚛** button
3. View the modern inverted grid with:
   - Main grid (Rows 6-1)
   - Footer row "126"
   - Footer row "S3"
   - Truck Reserving Area with safety stripes
4. Hover over cells for animations and coil details
5. Click cells for more information

## Design Features

### Modern Enhancements
- ✅ Gradient backgrounds throughout
- ✅ Smooth hover animations (scale + shadow)
- ✅ Professional typography (bold, black weights)
- ✅ Industrial safety signage (Skid-Gard™ pattern)
- ✅ Emoji indicators for visual clarity
- ✅ Removed position indicators (C2R4) for cleaner look
- ✅ Enhanced legend with larger swatches
- ✅ Section selector with gradient buttons

### Color Palette
- **Primary Blue**: Gradients from `blue-100` to `blue-200`
- **Status Colors**: Green (RTS), Yellow (WIP), Blue (Other), Gray (Empty)
- **Footer Colors**: Purple (126), Indigo (S3), Black/Gold stripes (Truck Area)
- **Safety Yellow**: `#FFD700` (gold) for hazard warning

## Notes

- The inverted layout ensures the digital representation matches the physical factory floor
- Location labels are crucial for warehouse management and coil tracking
- The system automatically calculates if a load is "ready" when all coils are in Section 3 with RTS status
- Footer rows provide clear zone demarcation for factory floor organization
- Truck Reserving Area uses OSHA-compliant safety color scheme (black/yellow)
