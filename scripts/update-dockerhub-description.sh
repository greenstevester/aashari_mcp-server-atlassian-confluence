#!/bin/bash

# Ensure the script fails fast
set -euo pipefail

# Check required environment variables
: "${DOCKER_HUB_USERNAME:?Must set DOCKER_HUB_USERNAME}"
: "${DOCKER_HUB_TOKEN:?Must set DOCKER_HUB_TOKEN}"
: "${DOCKERHUB_REPO:?Must set DOCKERHUB_REPO}"

# Optional: override description from arguments
SHORT_DESC=${1:-"MCP server for Atlassian Confluence"}
FULL_DESC=${2:-"Provides tools enabling AI systems (LLMs) to list/get spaces & pages (content formatted as Markdown) and search via CQL. Connects AI seamlessly to Confluence knowledge bases using the standard MCP interface."}

# Authenticate and get JWT token
TOKEN=$(curl -s -H "Content-Type: application/json" \
  -X POST -d "{\"username\": \"${DOCKER_HUB_USERNAME}\", \"password\": \"${DOCKER_HUB_TOKEN}\"}" \
  https://hub.docker.com/v2/users/login/ | jq -r .token)

# Update Docker Hub repository description
curl -s -X PATCH "https://hub.docker.com/v2/repositories/${DOCKER_HUB_USERNAME}/${DOCKERHUB_REPO}/" \
  -H "Authorization: JWT ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"full_description\": \"${FULL_DESC}\", \"description\": \"${SHORT_DESC}\"}"

echo "✅ Docker Hub description updated for ${DOCKER_HUB_USERNAME}/${DOCKERHUB_REPO}"