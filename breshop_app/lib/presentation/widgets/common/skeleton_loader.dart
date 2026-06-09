import 'package:flutter/material.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:shimmer/shimmer.dart';
import '../../../core/theme/colors.dart';

// ─── Primitive ────────────────────────────────────────────────────────────────

class _SkeletonBox extends StatelessWidget {
  final double? width;
  final double height;
  final double radius;

  const _SkeletonBox({
    this.width,
    required this.height,
    this.radius = 10,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}

// ─── Marketplace skeleton ─────────────────────────────────────────────────────

class MarketplaceGridSkeleton extends StatelessWidget {
  const MarketplaceGridSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      sliver: SliverMasonryGrid(
        gridDelegate:
            const SliverSimpleGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2),
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        delegate: SliverChildBuilderDelegate(
          (context, index) => _ProductCardSkeleton(tall: index.isEven),
          childCount: 6,
        ),
      ),
    );
  }
}

class _ProductCardSkeleton extends StatelessWidget {
  final bool tall;

  const _ProductCardSkeleton({this.tall = false});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: BreshopColors.grey200,
      highlightColor: BreshopColors.white,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: BreshopColors.grey200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Imagem placeholder
            _SkeletonBox(height: tall ? 220 : 160, radius: 20),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _SkeletonBox(width: double.infinity, height: 14),
                  const SizedBox(height: 6),
                  _SkeletonBox(width: 80, height: 11),
                  const SizedBox(height: 8),
                  _SkeletonBox(width: 60, height: 18),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Order card skeleton ──────────────────────────────────────────────────────

class OrderCardSkeleton extends StatelessWidget {
  const OrderCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: BreshopColors.grey200,
      highlightColor: BreshopColors.white,
      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: BreshopColors.grey200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Status bar
            Container(
              height: 36,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(14)),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const _SkeletonBox(width: 72, height: 72, radius: 10),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        _SkeletonBox(height: 16),
                        SizedBox(height: 6),
                        _SkeletonBox(width: 100, height: 13),
                        SizedBox(height: 8),
                        _SkeletonBox(width: 80, height: 16),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const Divider(color: BreshopColors.grey200, height: 1),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: _SkeletonBox(width: 100, height: 11),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Extrato order row skeleton ───────────────────────────────────────────────

class ExtratoRowSkeleton extends StatelessWidget {
  const ExtratoRowSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: BreshopColors.grey200,
      highlightColor: BreshopColors.white,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            const _SkeletonBox(width: 44, height: 52, radius: 10),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  _SkeletonBox(height: 14),
                  SizedBox(height: 4),
                  _SkeletonBox(width: 80, height: 11),
                  SizedBox(height: 4),
                  _SkeletonBox(width: 60, height: 10),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: const [
                _SkeletonBox(width: 50, height: 16),
                SizedBox(height: 4),
                _SkeletonBox(width: 70, height: 11),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
