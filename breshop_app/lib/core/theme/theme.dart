import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'colors.dart';
import 'text_styles.dart';

class BreshopTheme {
  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    primaryColor: BreshopColors.foreground,
    scaffoldBackgroundColor: BreshopColors.background,

    colorScheme: const ColorScheme.light(
      primary: BreshopColors.foreground,
      secondary: BreshopColors.accentLime,
      surface: BreshopColors.white,
      error: BreshopColors.error,
      tertiary: BreshopColors.grey700,
    ),

    appBarTheme: AppBarTheme(
      elevation: 0,
      backgroundColor: BreshopColors.background,
      foregroundColor: BreshopColors.foreground,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: GoogleFonts.spaceGrotesk(
        color: BreshopColors.foreground,
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
    ),

    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: BreshopColors.foreground,
        foregroundColor: BreshopColors.white,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: const StadiumBorder(),
        textStyle: GoogleFonts.spaceGrotesk(
          fontWeight: FontWeight.w700,
          fontSize: 14,
          letterSpacing: 0.5,
        ),
      ),
    ),

    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: BreshopColors.foreground,
        side: const BorderSide(color: BreshopColors.foreground, width: 1.5),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: const StadiumBorder(),
      ),
    ),

    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: BreshopColors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: BreshopColors.grey200),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: BreshopColors.grey200),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: BreshopColors.foreground, width: 2),
      ),
      hintStyle: const TextStyle(color: BreshopColors.grey400),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
    ),

    textTheme: TextTheme(
      displayLarge: BreshopTextStyles.displayLarge,
      displayMedium: BreshopTextStyles.displayMedium,
      titleLarge: BreshopTextStyles.titleLarge,
      bodyLarge: BreshopTextStyles.bodyLarge,
      bodyMedium: BreshopTextStyles.bodyMedium,
      labelLarge: BreshopTextStyles.labelLarge,
    ),

    snackBarTheme: SnackBarThemeData(
      backgroundColor: BreshopColors.foreground,
      contentTextStyle: GoogleFonts.spaceGrotesk(
        color: BreshopColors.white,
        fontSize: 14,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
    ),
  );

  /// Replica do .hard-shadow do web (2px offset, borda sólida)
  static BoxDecoration hardShadow({
    Color background = BreshopColors.white,
    BorderRadius? borderRadius,
  }) {
    return BoxDecoration(
      color: background,
      borderRadius: borderRadius ?? BorderRadius.circular(4),
      border: Border.all(color: BreshopColors.foreground, width: 1.5),
      boxShadow: const [
        BoxShadow(
          color: BreshopColors.foreground,
          offset: Offset(2, 2),
          blurRadius: 0,
        ),
      ],
    );
  }

  static BoxDecoration hardShadowLg({
    Color background = BreshopColors.white,
    BorderRadius? borderRadius,
  }) {
    return BoxDecoration(
      color: background,
      borderRadius: borderRadius ?? BorderRadius.circular(4),
      border: Border.all(color: BreshopColors.foreground, width: 2),
      boxShadow: const [
        BoxShadow(
          color: BreshopColors.foreground,
          offset: Offset(4, 4),
          blurRadius: 0,
        ),
      ],
    );
  }
}
