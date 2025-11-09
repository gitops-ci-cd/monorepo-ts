# Start from the official LTS Node image.
FROM node:24 AS base

WORKDIR /usr/src/app

# Copy ONLY manifests first
COPY package*.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/

# Handle missing lock file gracefully for the entire workspace
RUN if [ -f package-lock.json ]; then \
      npm ci --workspaces; \
    else \
      npm install --workspaces; \
    fi

ENTRYPOINT [ "npm" ]

FROM base AS builder

COPY . .

RUN npm run build --workspace=@monorepo/api

# Continue with the official LTS Node image to create a build artifact.
FROM node:24

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/

# Install only production dependencies from the lock file.
RUN npm ci --workspaces --silent --production

# Copy artifacts
COPY --from=builder /usr/src/app/apps/api/dist apps/api/dist
COPY --from=builder /usr/src/app/packages/utils/dist packages/utils/dist

EXPOSE 8080

# Define the entry point for the docker image.
# This is the command that will be run when the container starts.
ENTRYPOINT [ "node" ]
CMD [ "apps/api/dist/index.js" ]
