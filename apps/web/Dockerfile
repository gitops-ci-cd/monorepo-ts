# Start from the official LTS Node image.
FROM node:24 AS base

WORKDIR /usr/src/app

# Copy ONLY manifests first
COPY package*.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/

# Handle missing lock file gracefully for the entire workspace
RUN if [ -f package-lock.json ]; then \
      npm ci --workspaces; \
    else \
      npm install --workspaces; \
    fi

ENTRYPOINT [ "npm" ]

FROM base AS build

COPY . .

RUN npm run build --workspace=@monorepo/web

# Continue with artifacts only, no node_modules, no binaries
FROM scratch

COPY --from=build /usr/src/app/apps/web/dist/ /usr/src/app/apps/web/dist/
