# Plan: Homepage Visual Refinement (Zaply)

Improve the homepage design and copy based on the provided reference image (`Zaply-Homepage-refined.png`). The goal is to make it look more professional, modern, and aligned with the "Dark Tech" aesthetic.

## User Preferences
- **Brand Name**: Zaply
- **Visual Style**: Dark Tech, professional, modern, glassmorphism.
- **Copy**: Focus on "IA Zaply", "Conteúdo em escala", and "6-second videos".

## Proposed Changes

### 1. Landing Page Refinement (`src/routes/index.tsx`)
- **Hero Section**: 
    - Update the headline to match the reference: "Sua próxima ideia em escala."
    - Update subheadline/description for better flow: "Do briefing ao post publicado: o Zaply transforma estratégia em um mês inteiro de conteúdo consistente, no ritmo da sua equipe."
    - Refine buttons: "Criar meu primeiro mês" and "Ver em 90 segundos".
    - Add the "Teams" indicator (avatars + text "+ 2.400 equipes já criam com mais clareza") below the CTA.
    - Improve the background glow and noise textures.
- **Visuals**:
    - Ensure the dashboard preview image (`heroDashboard`) is high quality and well-framed within a glowing panel.
    - Add/refine floating cards around the dashboard preview (e.g., "Esta semana: 12 oportunidades", "Calendário editorial").
- **Secondary Section**:
    - Add the "Uma visão do workspace" section with the "Tudo em foco. Nada perdido." headline.
- **Navigation**:
    - Clean up the header links to match the reference: "Produto", "Como funciona", "Recursos", "Clientes".
    - Update CTA button to "Começar grátis".

### 2. Styling (`src/styles.css`)
- Fine-tune OKLCH colors for better contrast and "neon" feel.
- Add specific utilities for the "glassmorphism" look seen in the reference if needed (e.g., specific border gradients or blurs).

## Verification Plan

### Automated Checks
- Run `tsgo` to ensure no type errors are introduced.
- Verify build with `bun run build`.

### Manual Inspection (Playwright)
- Inspect the homepage layout at 1280x1800.
- Check responsiveness for mobile views.
- Take screenshots and compare with the reference image.
