#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Breshop — Build & Push Script
# Compila e envia as imagens de Produção (App + Seeder) para o Docker Hub
# Utiliza tags diferentes no mesmo repositório 'breshop-web' (para economizar repositórios privados)
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# Configurações padrão
DEFAULT_TAG="latest"
IMAGE_TAG="${2:-$DEFAULT_TAG}"

usage() {
    echo "Uso: $0 <seu_usuario_dockerhub> [tag]"
    echo "Exemplo: $0 yahtodocker latest"
    exit 1
}

# Verifica o primeiro argumento (Usuário do Docker Hub)
if [[ -z "${1:-}" ]]; then
    echo "ERRO: Você precisa especificar o usuário do Docker Hub."
    usage
fi

DOCKER_USER="$1"
WEB_IMAGE="${DOCKER_USER}/breshop-web:web-${IMAGE_TAG}"
SEEDER_IMAGE="${DOCKER_USER}/breshop-web:seeder-${IMAGE_TAG}"

echo "==============================================="
echo "   PREPARANDO BUILD & PUSH PARA DOCKER HUB     "
echo "==============================================="
echo "Docker Hub User : ${DOCKER_USER}"
echo "Tag Base        : ${IMAGE_TAG}"
echo "Web App Image   : ${WEB_IMAGE}"
echo "DB Seeder Image : ${SEEDER_IMAGE}"
echo "==============================================="
echo ""

# 1. Compilar o App Web (Standalone Otimizado)
echo "📦 [1/4] Compilando a imagem do Web App..."
docker build -t "${WEB_IMAGE}" .

# 2. Compilar o DB Seeder (Job de Migração/Seed)
echo "🗄️ [2/4] Compilando a imagem do DB Seeder (Migration Job)..."
docker build -f Dockerfile.seeder -t "${SEEDER_IMAGE}" .

# 3. Validar Login do Docker Hub
echo "🔑 [3/4] Validando login no Docker Hub..."
if ! docker system info | grep -q "Username:"; then
    echo "⚠️ Você não parece estar logado no Docker Hub no terminal."
    echo "Por favor, faça login no prompt a seguir:"
    docker login
else
    echo "✅ Já logado no Docker Hub!"
fi

# 4. Enviar imagens
echo "🚀 [4/4] Enviando imagens para o Docker Hub..."
echo "Enviando Web App..."
docker push "${WEB_IMAGE}"

echo "Enviando DB Seeder..."
docker push "${SEEDER_IMAGE}"

echo ""
echo "==============================================="
echo "  ✅ IMAGENS ENVIADAS COM SUCESSO!"
echo "==============================================="
echo "Como rodar na EC2 da AWS:"
echo ""
echo "1. Crie o diretório de configuração:"
echo "   mkdir -p /opt/breshop"
echo ""
echo "2. Crie o arquivo /opt/breshop/.env com as credenciais da AWS RDS:"
echo "   DATABASE_URL=\"postgresql://postgres:senha_do_rds@endpoint_rds:5432/postgres?schema=public\""
echo "   DIRECT_URL=\"postgresql://postgres:senha_do_rds@endpoint_rds:5432/postgres?schema=public\""
echo "   SUPABASE_URL=\"https://lvvxxdzurqajjkhhgbnt.supabase.co\""
echo "   NEXTAUTH_SECRET=\"uma_chave_secreta_qualquer\""
echo ""
echo "3. Rode o JOB de Migração/Seed do banco (ele executa e apaga o container sozinho):"
echo "   docker run --rm --env-file /opt/breshop/.env ${SEEDER_IMAGE}"
echo ""
echo "4. Rode o container da aplicação Web:"
echo "   docker run -d \\"
echo "     --name breshop-web \\"
echo "     --restart unless-stopped \\"
echo "     --env-file /opt/breshop/.env \\"
echo "     -p 80:3000 \\"
echo "     ${WEB_IMAGE}"
echo "==============================================="
