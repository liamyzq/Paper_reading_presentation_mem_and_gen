# Figure Source Map — HTML Route

This document specifies how to replace every reconstructed/local schematic figure in the presentation with the corresponding figure taken from an official HTML source.

## Chosen route

Use **HTML sources only**. Do not use the arXiv TeX source package.

- **Dynamical Regimes of Diffusion Models**: use the open-access article HTML on PMC/Nature and download the full-size figure images.
- **Selective Underfitting in Diffusion Models**: use the authors' official project-page HTML and its committed composite JPG assets.

This route avoids TeX compilation, EPS/PDF conversion, and uncertainty about generated figure files.

---

## Source pages

### Paper A: Dynamical Regimes of Diffusion Models

- PMC HTML: <https://pmc.ncbi.nlm.nih.gov/articles/PMC11570668/>
- Nature HTML: <https://www.nature.com/articles/s41467-024-54281-3>
- arXiv record: <https://arxiv.org/abs/2402.18491>

Preferred procedure:

1. Open the PMC HTML.
2. Find the required figure number.
3. Click **Open in a new tab** / **Full size image**.
4. Save the full-resolution image.
5. Crop only if instructed below.

### Paper B: Selective Underfitting in Diffusion Models

- Official project page: <https://selective-underfitting.github.io/>
- Official project repository: <https://github.com/selective-underfitting/selective-underfitting.github.io>
- arXiv record: <https://arxiv.org/abs/2510.01378>

The official HTML directly references these composite image assets:

- `static/images/main.jpg`
- `static/images/selective.jpg`
- `static/images/generalize.jpg`
- `static/images/scaling_law.jpg`

GitHub locations:

- <https://github.com/selective-underfitting/selective-underfitting.github.io/blob/main/static/images/main.jpg>
- <https://github.com/selective-underfitting/selective-underfitting.github.io/blob/main/static/images/selective.jpg>
- <https://github.com/selective-underfitting/selective-underfitting.github.io/blob/main/static/images/generalize.jpg>
- <https://github.com/selective-underfitting/selective-underfitting.github.io/blob/main/static/images/scaling_law.jpg>

Use the project's **Download raw file** button to save each original JPG before cropping.

---

# Complete presentation mapping

## A. Dynamical Regimes figures

### 1. Three-regime overview

| Field | Mapping |
|---|---|
| Presentation target | `assets/figures/dynamical-regimes/recap.png` |
| Used on slides | `Exact reverse dynamics`; `Unified view` |
| HTML source | **Figure 1** in the PMC/Nature article |
| Crop | Use the **entire figure**. Remove only surrounding webpage whitespace; do not remove the regime labels, trajectories, generated images, or the `t_S` / `t_C` structure. |
| Suggested caption | `Biroli et al., Fig. 1: three regimes of the backward diffusion dynamics.` |

Why this mapping is exact: Figure 1 is the paper's full overview of Regime I, speciation, Regime II, collapse, and Regime III.

---

### 2. Speciation on realistic datasets

| Field | Mapping |
|---|---|
| Presentation target | `assets/figures/dynamical-regimes/speciation-real.png` |
| Used on slide | `Speciation experiment` |
| HTML source | **Figure 4** in the PMC/Nature article |
| Crop | Use the **entire plot panel**. Preserve the legend for MNIST, CIFAR, ImageNet16, ImageNet32, and LSUN; the horizontal axis `t/t_S`; the vertical axis `φ(t)`; and the dashed reference lines. |
| Suggested caption | `Biroli et al., Fig. 4: clone-based speciation curves align when time is normalized by the predicted t_S.` |

Do **not** use Figure 2 here. Figure 2 is the Gaussian-mixture finite-dimensional validation, whereas the presentation slide explicitly discusses alignment across realistic image datasets.

---

### 3. Collapse on realistic datasets

| Field | Mapping |
|---|---|
| Presentation target | `assets/figures/dynamical-regimes/collapse-real.png` |
| Used on slides | `Empirical collapse diagnostic`; `A6 Collapse diagnostics` |
| HTML source | **Figure 5** in the PMC/Nature article |
| Crop | Use the **entire multi-panel figure**. Preserve: top-left clone probability `φ_C(t)`, top-right last-changing-index histogram, bottom empirical excess entropy, dataset legend, and vertical dashed estimates. |
| Suggested caption | `Biroli et al., Fig. 5: clone locking, nearest-neighbor commitment, and empirical excess entropy give consistent collapse times.` |

The same file should be reused on both presentation slides. Do not create two independent crops.

---

## B. Selective Underfitting figures

The authors' project page uses composite images. Export individual presentation panels from those composites while preserving the original plot labels and legends.

### 4. Supervision-shell / extrapolation illustration

| Field | Mapping |
|---|---|
| Presentation target | `assets/figures/selective-underfitting/extrapolation-illustration.png` |
| Used on slides | `Supervision shells`; `Unified view` |
| HTML source asset | `static/images/selective.jpg` |
| Crop | Crop the **conceptual illustration** showing the supervision region/shells and the inference or extrapolation trajectory. Keep the blue-shell and red/off-shell visual language. Exclude adjacent quantitative plots. |
| Suggested caption | `Song et al., official project-page illustration of supervision and extrapolation regions.` |

---

### 5. Training-versus-inference shell distance

| Field | Mapping |
|---|---|
| Presentation target | `assets/figures/selective-underfitting/extrapolation-distance.png` |
| Used on slide | `Inference extrapolation` |
| HTML source asset | `static/images/selective.jpg` |
| Crop | Crop the quantitative panel comparing the distance of **training inputs** and **inference trajectories** from the supervision region/shell. Preserve axis labels, legend, and the reference level corresponding to the shell. |
| Suggested caption | `Song et al.: training inputs remain near the supervision region while inference trajectories move off-shell.` |

Identify the panel by content rather than by assuming a fixed left/right position; the project image may be updated without changing its filename.

---

### 6. Contrastive scaling of on-shell and off-shell error

| Field | Mapping |
|---|---|
| Presentation target | `assets/figures/selective-underfitting/contrastive-scaling.png` |
| Used on slide | `Selective underfitting evidence` |
| HTML source asset | `static/images/selective.jpg` |
| Crop | Crop the panel in which **X-underfitting / supervision-region error decreases** while **O-underfitting / extrapolation-region deviation increases** as model quality or FID improves. Preserve both curves, labels, and model markers. |
| Suggested caption | `Song et al.: better models fit the empirical score more accurately on-shell but deviate more off-shell.` |

Do **not** take this from `scaling_law.jpg`. The slide is about selective underfitting across regions, not the later FLOPs-to-FID decomposition.

---

### 7. Qualitative on-shell memorization example

| Field | Mapping |
|---|---|
| Presentation target | `assets/figures/selective-underfitting/phase-transition-example.png` |
| Used on slide | `On-shell memorization` |
| HTML source asset | `static/images/main.jpg` |
| Crop | Crop the qualitative sequence/example showing a **noised training image being denoised back to the corresponding original training image**. Preserve the sequence direction and noise/time labels. Exclude the adjacent quantitative plot. |
| Suggested caption | `Song et al.: starting from a noised training image recovers the original sample inside the supervision region.` |

---

### 8. Memorization phase-transition plot

| Field | Mapping |
|---|---|
| Presentation target | `assets/figures/selective-underfitting/phase-transition-plot.png` |
| Used on slide | `On-shell memorization` |
| HTML source asset | `static/images/main.jpg` |
| Crop | Crop the quantitative plot paired with the qualitative example. It should show the memorization transition and the relevant supervision-region/shell-overlap quantity across diffusion time or noise level. Preserve all legends and axes. |
| Suggested caption | `Song et al.: memorization emerges in the same low-noise range in which the training example lies in the supervised region.` |

Use the plot that is visually paired with the qualitative training-image reconstruction in `main.jpg`.

---

### 9. Small supervision region / generalization example

| Field | Mapping |
|---|---|
| Presentation target | `assets/figures/selective-underfitting/foe-generalization.png` |
| Used on slide | `Freedom of extrapolation` |
| HTML source asset | `static/images/generalize.jpg` |
| Crop | Crop the qualitative panel corresponding to the **smaller supervision region** and better/free extrapolation or generalization. Preserve panel labels and generated samples. |
| Suggested caption | `Song et al.: a smaller supervision region leaves greater freedom to extrapolate.` |

---

### 10. Enlarged supervision region / memorization example

| Field | Mapping |
|---|---|
| Presentation target | `assets/figures/selective-underfitting/foe-memorization.png` |
| Used on slide | `Freedom of extrapolation` |
| HTML source asset | `static/images/generalize.jpg` |
| Crop | Crop the qualitative panel corresponding to the **enlarged supervision region**, reduced extrapolation freedom, and increased memorization. Preserve panel labels and generated samples. |
| Suggested caption | `Song et al.: broadening the supervision region constrains extrapolation and increases memorization.` |

---

### 11. Quantitative freedom-of-extrapolation intervention

| Field | Mapping |
|---|---|
| Presentation target | `assets/figures/selective-underfitting/foe-plot.png` |
| Used on slide | `Freedom of extrapolation` |
| HTML source asset | `static/images/generalize.jpg` |
| Crop | Crop the quantitative panel showing how memorization/generalization changes as the supervision region is enlarged while the target empirical score is fixed. Preserve x-axis intervention strength/region size, y-axis metric, legend, and error bars. |
| Suggested caption | `Song et al.: enlarging the supervised input region degrades generalization and increases memorization.` |

---

# Asset intentionally not used

## `static/images/scaling_law.jpg`

The current presentation does not have a dedicated slide about the paper's FLOPs → supervision loss → extrapolation efficiency → FID decomposition. Therefore:

- do not map `scaling_law.jpg` to `contrastive-scaling.png`;
- leave it unused unless a new scaling-law slide is added later.

---

# Recommended image-processing rules

1. Download the original full-resolution HTML asset before cropping.
2. Do not use browser screenshots when a downloadable full-size image is available.
3. Preserve axis labels, legends, panel labels, dashed thresholds, and error bars.
4. Crop webpage whitespace, not scientific content.
5. Export to the exact `.png` target paths listed above, so the deck files do not need to change.
6. Prefer at least 1600 px width for full figures and at least 900 px width for single-panel crops.
7. Do not upscale a crop beyond the resolution of its source asset.
8. Use lossless PNG for plots and diagrams. A high-quality JPG is acceptable only for photographic sample grids.
9. Do not apply aggressive sharpening, denoising, or color replacement.
10. Keep an uncropped copy under a temporary local folder until every slide has been visually checked.

---

# Code cleanup after the real figures are installed

The current repository contains local reconstructed SVGs and a runtime PNG-to-SVG mapping. After all eleven PNG files above have been installed:

## 1. Remove the mapping from `assets/slides.js`

Delete the complete block beginning with:

```js
const localFigureMap = {
```

and ending after:

```js
deck.querySelectorAll('img[src]').forEach(...);
```

Also remove the caption override that changes the Figure 1 caption to `Schematic reconstruction ...`.

The deck should then use the `.png` paths already written in `assets/deck/deck-*.js` directly.

## 2. Remove reconstructed SVG assets

Delete the following once the real PNGs are present and verified:

```text
assets/figures/dynamical-regimes/recap.svg
assets/figures/dynamical-regimes/speciation-real.svg
assets/figures/dynamical-regimes/collapse-real.svg
assets/figures/selective-underfitting/extrapolation-illustration.svg
assets/figures/selective-underfitting/extrapolation-distance.svg
assets/figures/selective-underfitting/contrastive-scaling.svg
assets/figures/selective-underfitting/phase-transition-example.svg
assets/figures/selective-underfitting/phase-transition-plot.svg
assets/figures/selective-underfitting/foe-generalization.svg
assets/figures/selective-underfitting/foe-memorization.svg
assets/figures/selective-underfitting/foe-plot.svg
```

## 3. Update `assets/figures/README.md`

Replace the statement that the figures are schematic reconstructions with a provenance table recording:

- paper title;
- HTML page;
- figure number or official project asset;
- crop description;
- presentation target path.

---

# Local verification

After replacing the files, run from the repository root:

```bash
python3 - <<'PY'
from pathlib import Path
import re

refs = set()
for path in sorted(Path('assets/deck').glob('deck-*.js')):
    text = path.read_text(encoding='utf-8')
    refs.update(re.findall(r'src=\\?"(assets/figures/[^"\\]+)', text))

missing = [ref for ref in sorted(refs) if not Path(ref).is_file()]
print(f'Found {len(refs)} unique figure references.')
if missing:
    print('Missing:')
    for ref in missing:
        print('  ', ref)
    raise SystemExit(1)
print('All referenced figure files exist.')
PY

node --check assets/slides.js
python3 -m http.server 8000
```

Then visually inspect:

```text
http://localhost:8000
```

Check especially:

- the full Figure 1 overview is legible;
- the Figure 4 axes really show `t/t_S` and `φ(t)`;
- all three panels of Figure 5 are present;
- the two crops from `main.jpg` are complementary rather than duplicated;
- the three crops from `generalize.jpg` have consistent panel boundaries;
- no image is stretched or visibly upscaled.

---

# Final target inventory

The replacement is complete only when all files below exist as real paper/project-page-derived images:

```text
assets/figures/dynamical-regimes/recap.png
assets/figures/dynamical-regimes/speciation-real.png
assets/figures/dynamical-regimes/collapse-real.png
assets/figures/selective-underfitting/extrapolation-illustration.png
assets/figures/selective-underfitting/extrapolation-distance.png
assets/figures/selective-underfitting/contrastive-scaling.png
assets/figures/selective-underfitting/phase-transition-example.png
assets/figures/selective-underfitting/phase-transition-plot.png
assets/figures/selective-underfitting/foe-generalization.png
assets/figures/selective-underfitting/foe-memorization.png
assets/figures/selective-underfitting/foe-plot.png
```
