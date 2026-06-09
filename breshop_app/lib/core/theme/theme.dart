import 'package:flutter/material.dart';
import 'colors.dart';
import 'text_styles.dart';

class BreshopTheme {
  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    primaryColor: BreshopColors.black,
    scaffoldBackgroundColor: BreshopColors.background,
    
    colorScheme: const ColorScheme.light(
      primary: BreshopColors.black,
      secondary: BreshopColors.accentLime,
      surface: BreshopColors.white,
      error: BreshopColors.error,
      tertiary: BreshopColors.grey700,
    ),

    // App Bar
    appBarTheme: const AppBarTheme(
      elevation: 0,
      backgroundColor: BreshopColors.background,
      foregroundColor: BreshopColors.foreground,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: TextStyle(
        color: BreshopColors.foreground,
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
    ),

    // Buttons
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: BreshopColors.black,
        foregroundColor: BreshopColors.white,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        textStyle: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 14,
        ),
      ),
    ),

    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: BreshopColors.black,
        side: const BorderSide(
          color: BreshopColors.black,
          width: 2,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),

    // Text Fields
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
        borderSide: const BorderSide(
          color: BreshopColors.black,
          width: 2,
        ),
      ),
      hintStyle: const TextStyle(color: BreshopColors.grey400),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 12,
      ),
    ),

    // Text Styles
    textTheme: const TextTheme(
      displayLarge: BreshopTextStyles.displayLarge,
      displayMedium: BreshopTextStyles.displayMedium,
      titleLarge: BreshopTextStyles.titleLarge,
      bodyLarge: BreshopTextStyles.bodyLarge,
      bodyMedium: BreshopTextStyles.bodyMedium,
      labelLarge: BreshopTextStyles.labelLarge,
    ),

    // Snack Bar
    snackBarTheme: SnackBarThemeData(
      backgroundColor: BreshopColors.grey900,
      contentTextStyle: const TextStyle(
        color: BreshopColors.white,
        fontSize: 14,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
    ),
  );

  static ThemeData get darkTheme {
    return lightTheme; // Currently same as light, can be expanded
  }
}
