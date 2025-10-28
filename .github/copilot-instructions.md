## Quick orientation for code-writing agents

This is a small 2D platformer built with plain JavaScript + HTML Canvas. Keep edits small, preserve Portuguese identifiers, and follow existing code patterns (constructor functions + prototypes, explicit sprite registration).

Key files to read first:
- `animacao.js` — game loop and sprite orchestration (use requestAnimationFrame). Register sprites with `animacao.novoSprite(sprite)`.
- `spritesheet.js` — sprite animation helper. Important props: `linha`, `coluna`, `intervalo`, and constructor `new Spritesheet(ctx, img, linhas, colunas, framesPorLinha)`.
- `colisor.js` — collision detection. Sprites must implement `retangulosColisao()` and `colidiuCom(outro)` to participate.
- `teclado.js` — keyboard input (uses numeric key codes and helper `pressionada(tecla)`).
- `heroina.js`, `arqueiro.js`, `flecha.js` — good examples of adding sprites, states, attack logic and projectiles.

Important patterns and conventions
- Old-style JS: constructors + `Foo.prototype = { atualizar, desenhar, ... }`.
- Sprite lifecycle: implement `atualizar()` and `desenhar()`; when needed, implement `retangulosColisao()` and `colidiuCom()` for collisions.
- Registration: create sprite, then call `animacao.novoSprite(sprite)`. If using collisions also call `colisor.novoSprite(sprite)` and ensure `animacao.colisor = colisor` is set.
- Spritesheet usage: animations are selected by setting `sheet.linha` and `sheet.coluna`, advance with `sheet.proximoQuadro()` or let logic manipulate `coluna`. To flip horizontally use `sheet.desenhar(x, y, espelhar)`.
- Frames-per-line: many sprites pass an array for frames-per-line (see `new Spritesheet(..., [10,8,8,...])`) — respect that when picking `coluna` bounds.
- Keys & states: constants are global (e.g., `SETA_DIREITA`, `ESPACO`, and `HEROINA_DIREITA`). Follow those names and numbers rather than inventing new ones.

Animation / projectile example (from `arqueiro.js`):
- When firing, create projectile with `new Flecha(context, imagem, x, y, velocidade)`, set `flecha.animacao = this.animacao`, then `this.animacao.novoSprite(flecha)` so it enters the main loop.

Collision contract (required to interact with `colisor.js`):
- retangulosColisao() -> Array of { x, y, largura, altura }
- colidiuCom(outro) -> side-effect or state update

Run & debug notes
- There is no build step. Open `heroina.html` or `arqueiro.html` in a browser. To serve files locally (recommended) run a static server from project root, e.g.:

```powershell
python -m http.server 8000
# then open http://localhost:8000/heroina.html
```

- The code already draws debug collision boxes (purple strokeRect). Use browser devtools console — existing code uses console.log for collisions.

Small edits guidance
- Keep function shapes and prototypes intact. Add new sprites by following the `Sonic` / `Arqueiro` pattern: construct image, create Spritesheet, implement methods, register with `animacao` (+ `colisor` if needed).
- When adding animation frames or changing spritesheet layouts, update the `framesPorLinha` array passed to the Spritesheet constructor.

When uncertain
- If a change impacts global constants or sprite registration, search the repo for examples (`heroina.html`, `arqueiro.html`, `heroina.js`, `arqueiro.js`). Prefer minimal, local changes and run the page.

If you'd like, I can add a short checklist template to PR descriptions that ensures new sprites follow the registration + collision contract.
