#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Breshop — EC2 Deploy Script (Lab Edition)
# Usage: ./deploy.sh [IMAGE_TAG]
# Example: ./deploy.sh v1.0.0
#          ./deploy.sh latest
#
# Prerequisites on EC2:
#   - Docker installed and running
#   - Logged in to Docker Hub: docker login
# ─────────────────────────────────────────────────────────────

set -euo pipefail

# ── Configuration ────────────────────────────────────────────
DOCKER_IMAGE="DOCKER_HUB_USER/breshop-web"   # TODO: substitua pelo seu usuário Docker Hub
CONTAINER_NAME="breshop-web"
IMAGE_TAG="${1:-latest}"
FULL_IMAGE="${DOCKER_IMAGE}:${IMAGE_TAG}"
APP_PORT="3000"
LOG_FILE="/var/log/breshop-deploy.log"

# ── Logging ───────────────────────────────────────────────────
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "${LOG_FILE}"
}

# ── Pull new image from Docker Hub ────────────────────────────
pull_image() {
    log "Pulling image ${FULL_IMAGE}..."
    docker pull "${FULL_IMAGE}"
    log "Image pulled."
}

# ── Stop and remove old container ────────────────────────────
stop_old_container() {
    if docker ps -q --filter "name=${CONTAINER_NAME}" | grep -q .; then
        log "Stopping existing container '${CONTAINER_NAME}'..."
        docker stop --time 15 "${CONTAINER_NAME}" || true
        docker rm "${CONTAINER_NAME}" || true
        log "Old container removed."
    else
        log "No running container found. Starting fresh."
    fi
}

# ── Start new container ───────────────────────────────────────
start_container() {
    log "Starting container '${CONTAINER_NAME}' (${FULL_IMAGE})..."

    # .env lives only on the EC2 server — never inside the image
    local env_file="/opt/breshop/.env"
    if [[ ! -f "${env_file}" ]]; then
        log "ERRO: arquivo de ambiente não encontrado em ${env_file}"
        log "Crie o arquivo com DATABASE_URL e DIRECT_URL antes de continuar."
        exit 1
    fi

    docker run -d \
        --name "${CONTAINER_NAME}" \
        --restart unless-stopped \
        --env-file "${env_file}" \
        -p "127.0.0.1:${APP_PORT}:3000" \
        "${FULL_IMAGE}"

    log "Container started."
}

# ── Health check (aguarda até 60s) ───────────────────────────
health_check() {
    log "Health check em localhost:${APP_PORT}..."
    local attempts=0

    until curl -sf "http://localhost:${APP_PORT}/" > /dev/null 2>&1; do
        attempts=$((attempts + 1))
        if [[ ${attempts} -ge 12 ]]; then
            log "ERRO: App não respondeu em 60s. Logs do container:"
            docker logs --tail 50 "${CONTAINER_NAME}" | tee -a "${LOG_FILE}"
            exit 1
        fi
        log "  Aguardando... (tentativa ${attempts}/12)"
        sleep 5
    done

    log "✅ Health check passou!"
}

# ── Prune dangling images ─────────────────────────────────────
cleanup() {
    docker image prune -f >> "${LOG_FILE}" 2>&1 || true
}

# ── Main ─────────────────────────────────────────────────────
main() {
    log "════════════════════════════════════════"
    log "  Breshop Deploy — tag: ${IMAGE_TAG}"
    log "════════════════════════════════════════"

    pull_image
    stop_old_container
    start_container
    health_check
    cleanup

    log "✅ Deploy concluído! Imagem: ${FULL_IMAGE}"
}

main "$@"
