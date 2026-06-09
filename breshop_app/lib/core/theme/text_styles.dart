import 'package:flutter/material.dart';

class BreshopTextStyles {
  // Headlines (Serif Italic - estilo brand)
  static const TextStyle displayLarge = TextStyle(
    fontSize: 56,
    fontWeight: FontWeight.w900,
    fontStyle: FontStyle.italic,
    fontFamily: 'Serif',
    letterSpacing: -1.5,
  );

  static const TextStyle displayMedium = TextStyle(
    fontSize: 44,
    fontWeight: FontWeight.w900,
    fontStyle: FontStyle.italic,
    fontFamily: 'Serif',
    letterSpacing: -1.2,
  );

  static const TextStyle titleLarge = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.w900,
    fontStyle: FontStyle.italic,
    fontFamily: 'Serif',
  );

  // Body
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w400,
    // fontFamily: 'SanFrancisco', // Default native look or custom if font added
  );

  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w400,
  );

  static const TextStyle labelLarge = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w600,
    fontFamily: 'Mono',
    letterSpacing: 0.5,
  );
}
