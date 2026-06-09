#!/usr/bin/env bash
# Upload 16 fashion photos to Supabase Storage bucket "fashion"
# Usa picsum.photos como fonte (sem bloqueio de rate limit)
# Usage: SUPABASE_SERVICE_KEY=seu_service_role_key bash scripts/upload-fashion-images.sh

set -e

SUPABASE_URL="https://lvvxxdzurqajjkhhgbnt.supabase.co"
BUCKET="fashion"
SERVICE_KEY="${SUPABASE_SERVICE_KEY:?Defina SUPABASE_SERVICE_KEY antes de rodar}"
TMPDIR=$(mktemp -d)

# IDs do picsum (fotos curadas de moda/clothing, 600x750px)
PICSUM_IDS=(
  "1074"   # outfit flat lay
  "1040"   # clothing rack
  "157"    # fashion editorial
  "399"    # denim texture
  "96"     # accessories
  "582"    # shoes
  "783"    # shopping
  "830"    # wardrobe
  "28"     # vintage style
  "433"    # urban fashion
  "674"    # street style
  "718"    # jacket detail
  "445"    # minimalist outfit
  "177"    # fashion shoot
  "538"    # textile close-up
  "217"    # boutique
)

echo "→ Criando bucket '$BUCKET' (se não existir)..."
curl -sf -X POST \
  "$SUPABASE_URL/storage/v1/bucket" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"$BUCKET\",\"name\":\"$BUCKET\",\"public\":true}" \
  > /dev/null && echo "  Bucket criado." || echo "  (bucket já existe)"

echo ""
echo "→ Baixando e subindo ${#PICSUM_IDS[@]} imagens..."
for i in "${!PICSUM_IDS[@]}"; do
  ID="${PICSUM_IDS[$i]}"
  FILE="$TMPDIR/${i}.jpg"
  URL="https://picsum.photos/id/${ID}/600/750"

  echo "  [$((i+1))/${#PICSUM_IDS[@]}] Baixando picsum/${ID} → ${i}.jpg"
  curl -sLf \
    -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" \
    --retry 3 --retry-delay 1 \
    "$URL" -o "$FILE"

  if [ ! -s "$FILE" ]; then
    echo "  ✗ Falha ao baixar ${i}.jpg, pulando..."
    continue
  fi

  RESULT=$(curl -sf -X POST \
    "$SUPABASE_URL/storage/v1/object/$BUCKET/${i}.jpg" \
    -H "Authorization: Bearer $SERVICE_KEY" \
    -H "Content-Type: image/jpeg" \
    -H "x-upsert: true" \
    --data-binary "@$FILE" \
    -w "%{http_code}" -o /dev/null)

  if [ "$RESULT" = "200" ] || [ "$RESULT" = "201" ]; then
    echo "  ✓ ${i}.jpg enviado"
  else
    echo "  ✗ Erro HTTP $RESULT ao enviar ${i}.jpg"
  fi
done

rm -rf "$TMPDIR"
echo ""
echo "✓ Pronto! Bucket: $SUPABASE_URL/storage/v1/object/public/$BUCKET/"
echo "  Teste: curl -I $SUPABASE_URL/storage/v1/object/public/$BUCKET/0.jpg"
