const _supabaseBase =
    'https://lvvxxdzurqajjkhhgbnt.supabase.co/storage/v1/object/public/fashion';

const _photoCount = 16;

String itemImageUrl(String itemId, {int width = 400, int height = 500}) {
  final index = itemId.hashCode.abs() % _photoCount;
  return '$_supabaseBase/$index.jpg';
}
