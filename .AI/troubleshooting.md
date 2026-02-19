# Troubleshooting

## `.wxt/tsconfig.json` Not Found

This file is auto-generated. Run:

```bash
docker compose exec frontend npx wxt prepare
```

## Docker Layer Cache Optimization

The Dockerfile copies `package.json` and `package-lock.json` first, runs `npm install`, then copies source code. The `postinstall` script is designed to skip during build and run after full source code is available.

## Permission Issues

The Docker setup includes a `fix-permissions.sh` script that runs on container start to handle file permission issues between host and container.
