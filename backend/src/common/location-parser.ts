/**
 * Location Parser
 * Parses location codes into section, column, and row components.
 *
 * Examples:
 * - "30305" -> section: 3, column: 3, row: 5
 * - "126" -> special line code (section: 1, column: 2, row: 6)
 * - "41203" -> section: 4, column: 12, row: 3
 */

export interface ParsedLocation {
  section: number;
  column: number;
  row: number;
}

export class LocationParser {
  /**
   * Parse location string into section, column, row
   * Format: First digit = section, next 2 digits = column, remaining = row
   * @param location - Location string (e.g., "30305", "126")
   * @returns ParsedLocation object or null if invalid
   */
  static parse(location: string): ParsedLocation | null {
    if (!location || location.length < 3) {
      return null;
    }

    try {
      // Remove any whitespace
      const cleanLocation = location.trim();

      // Special case: 3-digit codes like "126"
      if (cleanLocation.length === 3) {
        return {
          section: parseInt(cleanLocation[0]),
          column: parseInt(cleanLocation[1]),
          row: parseInt(cleanLocation[2]),
        };
      }

      // Standard 5-digit format: SCCR (Section, Column, Row)
      if (cleanLocation.length === 5) {
        return {
          section: parseInt(cleanLocation[0]),
          column: parseInt(cleanLocation.substring(1, 3)),
          row: parseInt(cleanLocation.substring(3)),
        };
      }

      // Flexible format: first digit = section, next 2 = column, rest = row
      return {
        section: parseInt(cleanLocation[0]),
        column: parseInt(cleanLocation.substring(1, 3)),
        row: parseInt(cleanLocation.substring(3)),
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate parsed location components
   * @param parsed - ParsedLocation object
   * @returns true if valid, false otherwise
   */
  static validate(parsed: ParsedLocation): boolean {
    if (!parsed) return false;

    // Section: 1-4
    if (parsed.section < 1 || parsed.section > 4) return false;

    // Column: 1-99 (flexible for future expansion)
    if (parsed.column < 1 || parsed.column > 99) return false;

    // Row: 1-6
    if (parsed.row < 1 || parsed.row > 6) return false;

    return true;
  }

  /**
   * Parse and validate location
   * @param location - Location string
   * @returns ParsedLocation or null if invalid
   */
  static parseAndValidate(location: string): ParsedLocation | null {
    const parsed = this.parse(location);
    if (!parsed || !this.validate(parsed)) {
      return null;
    }
    return parsed;
  }
}
