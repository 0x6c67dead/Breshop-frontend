import 'package:flutter/material.dart';
import '../../../core/theme/colors.dart';
import '../../../domain/entities/item.dart';
import 'item_image.dart';

class ProductCard extends StatefulWidget {
  final Item item;
  final VoidCallback? onTap;
  final VoidCallback? onFavorite;
  final bool isFavorited;

  const ProductCard({
    super.key,
    required this.item,
    this.onTap,
    this.onFavorite,
    this.isFavorited = false,
  });

  @override
  State<ProductCard> createState() => _ProductCardState();
}

class _ProductCardState extends State<ProductCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 120),
      lowerBound: 0.95,
      upperBound: 1.0,
      value: 1.0,
    );
    _scale = _controller;
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(_) => _controller.reverse();
  void _onTapUp(_) => _controller.forward();
  void _onTapCancel() => _controller.forward();

  @override
  Widget build(BuildContext context) {
    final item = widget.item;

    return ScaleTransition(
      scale: _scale,
      child: GestureDetector(
        onTapDown: _onTapDown,
        onTapUp: _onTapUp,
        onTapCancel: _onTapCancel,
        onTap: widget.onTap,
        child: Container(
          decoration: BoxDecoration(
            color: BreshopColors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: BreshopColors.foreground, width: 1.5),
            boxShadow: const [
              BoxShadow(
                color: BreshopColors.foreground,
                offset: Offset(2, 2),
                blurRadius: 0,
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image placeholder area
              AspectRatio(
                aspectRatio: 1.0,
                child: Stack(
                  children: [
                    Hero(
                      tag: 'item-image-${item.id}',
                      child: ItemImage(
                        itemId: item.id,
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(14),
                        ),
                      ),
                    ),
                    // Status badge
                    if (item.status != ItemStatus.available)
                      Positioned(
                        top: 8,
                        left: 8,
                        child: _StatusBadge(status: item.status),
                      ),
                    // Favorite button
                    Positioned(
                      top: 4,
                      right: 4,
                      child: _FavoriteButton(
                        isFavorited: widget.isFavorited,
                        onTap: widget.onFavorite,
                      ),
                    ),
                  ],
                ),
              ),
              // Info
              Padding(
                padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 14,
                        color: BreshopColors.foreground,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (item.brecho != null) ...[
                      const SizedBox(height: 2),
                      Text(
                        item.brecho!.name,
                        style: const TextStyle(
                          fontSize: 11,
                          color: BreshopColors.grey500,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                    if (item.tags.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Wrap(
                        spacing: 4,
                        children: item.tags.take(2).map((tag) {
                          return Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 6,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: BreshopColors.accentLime,
                              borderRadius: BorderRadius.circular(9999),
                            ),
                            child: Text(
                              tag.name.toUpperCase(),
                              style: const TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w700,
                                color: BreshopColors.foreground,
                                letterSpacing: 0.5,
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ],
                    const SizedBox(height: 6),
                    Text(
                      '${item.price} COINS',
                      style: const TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 16,
                        color: BreshopColors.foreground,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StatusBadge extends StatelessWidget {
  final ItemStatus status;

  const _StatusBadge({required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: BreshopColors.foreground.withAlpha(200),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        status.label.toUpperCase(),
        style: const TextStyle(
          color: BreshopColors.white,
          fontSize: 9,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}

class _FavoriteButton extends StatelessWidget {
  final bool isFavorited;
  final VoidCallback? onTap;

  const _FavoriteButton({required this.isFavorited, this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Container(
        width: 36,
        height: 36,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: BreshopColors.white.withAlpha(230),
          shape: BoxShape.circle,
        ),
        child: Icon(
          isFavorited ? Icons.favorite : Icons.favorite_border,
          size: 18,
          color: isFavorited ? BreshopColors.accentOrange : BreshopColors.grey500,
        ),
      ),
    );
  }
}
