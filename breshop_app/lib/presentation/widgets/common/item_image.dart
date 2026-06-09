import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../../../core/theme/colors.dart';
import '../../../core/utils/item_image.dart';

class ItemImage extends StatelessWidget {
  final String itemId;
  final double? width;
  final double? height;
  final BorderRadius? borderRadius;
  final BoxFit fit;

  const ItemImage({
    super.key,
    required this.itemId,
    this.width,
    this.height,
    this.borderRadius,
    this.fit = BoxFit.cover,
  });

  @override
  Widget build(BuildContext context) {
    final url = itemImageUrl(itemId, width: 400, height: 500);

    Widget image = CachedNetworkImage(
      imageUrl: url,
      width: width ?? double.infinity,
      height: height ?? double.infinity,
      fit: fit,
      placeholder: (_, __) => Container(
        color: BreshopColors.tactileLight,
        child: const Center(
          child: Icon(
            Icons.checkroom_outlined,
            color: BreshopColors.grey300,
            size: 40,
          ),
        ),
      ),
      errorWidget: (_, __, ___) => Container(
        color: BreshopColors.tactileLight,
        child: const Center(
          child: Icon(
            Icons.checkroom_outlined,
            color: BreshopColors.grey300,
            size: 40,
          ),
        ),
      ),
    );

    if (borderRadius != null) {
      image = ClipRRect(borderRadius: borderRadius!, child: image);
    }

    return image;
  }
}
