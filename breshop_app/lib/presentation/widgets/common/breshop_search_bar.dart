import 'package:flutter/material.dart';
import '../../../core/theme/colors.dart';

class SearchBar extends StatelessWidget {
  final ValueChanged<String>? onChanged;
  final String hint;

  const SearchBar({
    super.key,
    this.onChanged,
    this.hint = 'Buscar produtos...',
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 48,
      decoration: BoxDecoration(
        color: BreshopColors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: BreshopColors.black.withAlpha(8),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TextField(
        onChanged: onChanged,
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: const TextStyle(
            color: BreshopColors.grey400,
            fontSize: 14,
          ),
          prefixIcon: const Icon(
            Icons.search,
            color: BreshopColors.grey400,
            size: 20,
          ),
          border: InputBorder.none,
          enabledBorder: InputBorder.none,
          focusedBorder: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 14),
        ),
      ),
    );
  }
}
