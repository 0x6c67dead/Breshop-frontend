#!/bin/bash
# -----------------------------------------------------------------------------
# Script para remover completamente a infraestrutura instalada pelo setup-ec2.sh
# ATENÇÃO: ISSO VAI APAGAR TODOS OS CONTAINERS, IMAGENS E CONFIGURAÇÕES!
# -----------------------------------------------------------------------------

set -e

echo "================================================="
echo "   INICIANDO TEARDOWN DA EC2 (ZERO ABSOLUTO)     "
echo "================================================="

echo "1️⃣ Parando e removendo todos os containers Docker..."
if command -v docker &> /dev/null; then
    docker stop $(docker ps -aq) 2>/dev/null || true
    docker rm $(docker ps -aq) 2>/dev/null || true
    docker rmi $(docker images -q) 2>/dev/null || true
    echo "✅ Containers e imagens removidos."
else
    echo "⚠️ Docker não encontrado (já removido?)"
fi

echo "2️⃣ Desinstalando Docker e dependências..."
apt-get purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras || true
apt-get autoremove -y --purge || true
rm -rf /var/lib/docker
rm -rf /var/lib/containerd
rm -rf /etc/docker
rm -rf /etc/apt/keyrings/docker.asc
rm -f /etc/apt/sources.list.d/docker.list
echo "✅ Docker completamente desinstalado."

echo "3️⃣ Desinstalando Nginx..."
systemctl stop nginx || true
apt-get purge -y nginx nginx-common || true
apt-get autoremove -y --purge || true
rm -rf /etc/nginx
rm -rf /var/log/nginx
echo "✅ Nginx completamente desinstalado."

echo "4️⃣ Apagando pasta de configuração do Breshop..."
rm -rf /opt/breshop
echo "✅ Pasta /opt/breshop apagada."

echo "================================================="
echo " 🎉 MÁQUINA LIMPA! PRONTA PARA NOVO DEPLOY.      "
echo "================================================="
echo "Para testar do zero, rode:"
echo "sudo bash infra_ec2.sh"
