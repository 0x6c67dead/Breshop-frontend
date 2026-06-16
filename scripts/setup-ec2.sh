#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Breshop — Script de Configuração Automatizada para AWS EC2
# Configura Docker, Nginx, cria as pastas e executa a aplicação.
# ─────────────────────────────────────────────────────────────

# Executar como root
if [ "$EUID" -ne 0 ]; then
  echo "ERRO: Por favor, execute este script como root (sudo)."
  exit 1
fi

set -euo pipefail

echo "================================================="
echo "   INICIANDO CONFIGURAÇÃO BRESHOP NA AWS EC2     "
echo "================================================="

# ─────────────────────────────────────────────────────────────
# 1. DETECTAR SISTEMA OPERACIONAL
# ─────────────────────────────────────────────────────────────
OS="unknown"
if [ -f /etc/debian_version ]; then
    OS="debian"
    echo "Distro detectada: Debian/Ubuntu"
elif [ -f /etc/redhat-release ] || [ -f /etc/system-release ]; then
    OS="redhat"
    echo "Distro detectada: Amazon Linux/CentOS/RHEL"
else
    echo "ERRO: Sistema operacional não suportado automaticamente."
    exit 1
fi

# ─────────────────────────────────────────────────────────────
# 2. INSTALAR E CONFIGURAR DOCKER
# ─────────────────────────────────────────────────────────────
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    if [ "$OS" = "debian" ]; then
        apt-get update -y
        apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
        mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg || true
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list || true
        apt-get update -y
        apt-get install -y docker-ce docker-ce-cli containerd.io || apt-get install -y docker.io
    else
        yum update -y
        yum install -y docker
    fi
    echo "Docker instalado com sucesso!"
else
    echo "✅ Docker já está instalado."
fi

# Iniciar e habilitar o serviço do Docker
systemctl start docker
systemctl enable docker

# Permissões do usuário comum (se houver a variável SUDO_USER)
if [ -n "${SUDO_USER:-}" ]; then
    usermod -aG docker "$SUDO_USER"
    echo "✅ Usuário '$SUDO_USER' adicionado ao grupo docker."
fi

# ─────────────────────────────────────────────────────────────
# 3. INSTALAR E CONFIGURAR NGINX
# ─────────────────────────────────────────────────────────────
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    if [ "$OS" = "debian" ]; then
        apt-get install -y nginx
    else
        yum install -y nginx || amazon-linux-extras install nginx1 -y
    fi
    echo "Nginx instalado com sucesso!"
else
    echo "✅ Nginx já está instalado."
fi

# Iniciar e habilitar o Nginx
systemctl start nginx
systemctl enable nginx

# ─────────────────────────────────────────────────────────────
# 4. CONFIGURAR REVERSE PROXY NO NGINX (Porta 80 -> Container 3000)
# ─────────────────────────────────────────────────────────────
echo "Configurando Reverse Proxy no Nginx..."
NGINX_CONF=""

if [ "$OS" = "debian" ]; then
    NGINX_CONF="/etc/nginx/sites-available/breshop"
    # Remove link default se existir
    rm -f /etc/nginx/sites-enabled/default
else
    NGINX_CONF="/etc/nginx/conf.d/breshop.conf"
fi

cat << 'EOF' > "$NGINX_CONF"
server {
    listen 80;
    server_name _; # Aceita qualquer requisição na porta 80

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Habilita o site no Debian/Ubuntu
if [ "$OS" = "debian" ]; then
    ln -sf /etc/nginx/sites-available/breshop /etc/nginx/sites-enabled/breshop
fi

# Testa a configuração do Nginx e recarrega
nginx -t
systemctl restart nginx
echo "✅ Nginx configurado e reiniciado!"

# ─────────────────────────────────────────────────────────────
# 5. PREPARAR CONFIGURAÇÃO DA APLICAÇÃO (ENV)
# ─────────────────────────────────────────────────────────────
APP_DIR="/opt/breshop"
ENV_FILE="${APP_DIR}/.env"

mkdir -p "$APP_DIR"

if [ ! -f "$ENV_FILE" ]; then
    echo "================================================="
    echo "⚠️ ATENÇÃO: ARQUIVO .env NÃO ENCONTRADO!"
    echo "================================================="
    echo "Criando um template em: ${ENV_FILE}"
    
    cat << 'EOF' > "$ENV_FILE"
# Credenciais do Banco RDS (Lembre-se de escapar a senha usando %21 no lugar de !)
DATABASE_URL="postgresql://postgres:sua_senha%21@seu-rds-endpoint:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres:sua_senha%21@seu-rds-endpoint:5432/postgres?schema=public"

# Supabase URL para imagens dos produtos
SUPABASE_URL="https://lvvxxdzurqajjkhhgbnt.supabase.co"

# Next Auth Secret (Qualquer segredo alfanumérico)
NEXTAUTH_SECRET="trabalhodefaculdadesecretsupersegura"

# Credenciais do Docker Hub (Obrigatório caso o repositório seja privado)
DOCKER_USERNAME="seu_usuario_dockerhub"
DOCKER_PASSWORD="seu_token_ou_senha"
EOF

    echo "Ação Necessária:"
    echo "1. Edite o arquivo '${ENV_FILE}' com seus dados reais do RDS e do Docker Hub."
    echo "2. Depois, execute este script novamente para rodar os containers."
    exit 0
fi

# ─────────────────────────────────────────────────────────────
# 6. EXECUTAR OS CONTAINERS (DB SEED + APLICATIVO)
# ─────────────────────────────────────────────────────────────
echo "Carregando configurações do .env..."
# Importa as variáveis do .env para o ambiente do shell
set -a
source "$ENV_FILE"
set +a

DOCKER_USER="breshop"
IMAGE_TAG="v1"

WEB_IMAGE="${DOCKER_USER}/breshop-web:web-${IMAGE_TAG}"
SEEDER_IMAGE="${DOCKER_USER}/breshop-web:seeder-${IMAGE_TAG}"

# 6.1 Autenticar no Docker Hub (se necessário)
echo "Verificando login no Docker Hub..."
if ! docker system info 2>/dev/null | grep -q "Username:"; then
    if [[ -n "${DOCKER_USERNAME:-}" && -n "${DOCKER_PASSWORD:-}" ]]; then
        echo "Efetuando login no Docker Hub..."
        echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
    else
        echo "⚠️ ERRO: O repositório é privado e você não está autenticado no Docker Hub."
        echo "Por favor, adicione DOCKER_USERNAME e DOCKER_PASSWORD no seu arquivo '${ENV_FILE}'"
        echo "Ou execute manualmente: sudo docker login"
        exit 1
    fi
else
    echo "✅ Já autenticado no Docker Hub."
fi

# 6.2 Baixar imagens mais recentes do Docker Hub
echo "📥 Baixando imagens mais recentes do Docker Hub..."
docker pull "$SEEDER_IMAGE"
docker pull "$WEB_IMAGE"

# 6.3 Rodar Seeder (Job)
echo "🚀 Executando Job de Migração e População (Seeder) no RDS..."
docker run --rm --env-file "$ENV_FILE" "$SEEDER_IMAGE" || true
echo "✅ Banco de dados atualizado e semeado!"

# 6.4 Parar container antigo se houver
if docker ps -a --format '{{.Names}}' | grep -Eq "^breshop-web$"; then
    echo "Parando container antigo 'breshop-web'..."
    docker stop breshop-web || true
    docker rm breshop-web || true
fi

# 6.3 Iniciar Web Container
echo "🚀 Iniciando aplicação web na porta local 3000..."
docker run -d \
  --name breshop-web \
  --restart unless-stopped \
  --env-file "$ENV_FILE" \
  -p "127.0.0.1:3000:3000" \
  "$WEB_IMAGE"

echo ""
echo "================================================="
echo "  🎉 BRESHOP CONFIGURADO E NO AR!"
echo "================================================="
echo "Acesse a aplicação no IP público da sua EC2."
echo "Para habilitar SSL (HTTPS):"
echo "Rode: sudo apt install certbot python3-certbot-nginx -y (Ubuntu)"
echo "Ou: sudo yum install certbot python3-certbot-nginx -y (Amazon Linux)"
echo "E execute: sudo certbot --nginx"
echo "================================================="
