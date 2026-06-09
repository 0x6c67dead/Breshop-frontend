import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'colors.dart';

class BreshopTextStyles {
  static TextStyle get displayLarge => GoogleFonts.playfairDisplay(
        fontSize: 56,
        fontWeight: FontWeight.w900,
        fontStyle: FontStyle.italic,
        letterSpacing: -1.5,
        color: BreshopColors.foreground,
      );

  static TextStyle get displayMedium => GoogleFonts.playfairDisplay(
        fontSize: 44,
        fontWeight: FontWeight.w900,
        fontStyle: FontStyle.italic,
        letterSpacing: -1.2,
        color: BreshopColors.foreground,
      );

  static TextStyle get titleLarge => GoogleFonts.playfairDisplay(
        fontSize: 32,
        fontWeight: FontWeight.w900,
        fontStyle: FontStyle.italic,
        color: BreshopColors.foreground,
      );

  static TextStyle get bodyLarge => GoogleFonts.spaceGrotesk(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: BreshopColors.foreground,
      );

  static TextStyle get bodyMedium => GoogleFonts.spaceGrotesk(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: BreshopColors.foreground,
      );

  static TextStyle get labelLarge => GoogleFonts.spaceGrotesk(
        fontSize: 12,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.5,
        color: BreshopColors.foreground,
      );

  static TextStyle get tagPill => GoogleFonts.spaceGrotesk(
        fontSize: 11,
        fontWeight: FontWeight.w700,
        letterSpacing: 0.8,
        color: BreshopColors.foreground,
      );
}
