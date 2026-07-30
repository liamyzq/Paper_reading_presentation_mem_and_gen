window.__DECK_HTML_PARTS = window.__DECK_HTML_PARTS || [];
window.__DECK_HTML_PARTS.push(String.raw`
<section class="slide compact" data-title="Freedom of extrapolation">
  <div class="eyebrow">22 · Controlled intervention</div>
  <h2>Broaden the supervised input region while fixing the target score—and generalization degrades</h2>
  <div class="figure-triptych">
    <div class="figure-card"><img src="assets/figures/selective-underfitting/foe-generalization.png" alt="Small supervision region gives freedom to extrapolate" /></div>
    <div class="figure-card"><img src="assets/figures/selective-underfitting/foe-memorization.png" alt="Large supervision region limits extrapolation" /></div>
    <div class="figure-card experiment-figure">
      <button class="figure-detail-trigger" type="button" data-detail-id="detail-freedom-extrapolation">Experiment details</button>
      <img src="assets/figures/selective-underfitting/foe-plot.png" alt="Memorization increases as supervision region grows" />
    </div>
  </div>
  <div class="formula compact">\[
    \mathcal D_{\mathrm{score}}\ \text{fixed},\qquad \mathcal D_{\mathrm{region}}\ \text{varied},\qquad \mathcal D_{\mathrm{score}}\subseteq\mathcal D_{\mathrm{region}}.
  \]</div>
  <div class="symbols"><span class="symbol"><b>\(\mathcal D_{\mathrm{score}}\)</b> samples defining the target empirical score</span><span class="symbol"><b>\(\mathcal D_{\mathrm{region}}\)</b> samples defining where training inputs are drawn</span></div>
  <div class="jump-row"><button class="jump-link" data-jump="A8 FoE objective">Why the modified loss has the same target →</button></div>
  <div class="experiment-detail-source" id="detail-freedom-extrapolation" hidden>
    <div class="experiment-detail-header">
      <div class="experiment-detail-kicker">P23 · Figure 5 · Experiment 4.3</div>
      <h2>Freedom of Extrapolation: a controlled intervention on where the score is supervised</h2>
      <p>All models target the same empirical score. Only the spatial region in which that target is imposed is enlarged.</p>
    </div>
    <div class="experiment-detail-grid">
      <article class="experiment-detail-card">
        <h3>Subset construction</h3>
        <ul>
          <li>\(\mathcal D_{\mathrm{score}}\): 100 images per ImageNet class, so \(|\mathcal D_{\mathrm{score}}|=10^5\).</li>
          <li>\(\mathcal D_{\mathrm{region}}\supseteq\mathcal D_{\mathrm{score}}\): add images uniformly without replacement from the remaining images in every class.</li>
          <li>Vary \(|\mathcal D_{\mathrm{region}}|\) from \(|\mathcal D_{\mathrm{score}}|\) toward the full training set while keeping \(\mathcal D_{\mathrm{score}}\) fixed.</li>
          <li>Train both SiT-L and U-Net-B.</li>
        </ul>
      </article>
      <article class="experiment-detail-card">
        <h3>Training intervention</h3>
        <div class="experiment-detail-formula">\[
          z_t=\alpha_t x+\sigma_t\epsilon,\quad
          x\sim\operatorname{Unif}(\mathcal D_{\mathrm{region}}),
          \qquad
          \min_\theta\ \mathbb E\|s_\theta(z_t,t)-s_\star^{\mathcal D_{\mathrm{score}}}(z_t,t)\|^2.
        \]</div>
        <p>\(\mathcal D_{\mathrm{region}}\) determines <strong>where</strong> noisy inputs are sampled; \(\mathcal D_{\mathrm{score}}\) determines <strong>what</strong> score is fitted.</p>
        <p>The paper uses importance sampling over \(\mathcal D_{\mathrm{score}}\), accelerated with Faiss, to avoid explicitly evaluating the full empirical mixture at every step.</p>
      </article>
      <article class="experiment-detail-card">
        <h3>Axes and metric</h3>
        <p><strong>Horizontal axis:</strong></p>
        <div class="experiment-detail-formula">\[
          |\mathcal D_{\mathrm{region}}|/|\mathcal D_{\mathrm{score}}|.
        \]</div>
        <p><strong>Memorization score for a generated image \(x\):</strong></p>
        <div class="experiment-detail-formula">\[
          m(x)=
          \frac{\|x-x'_{(1)}\|_2^2}
          {\frac1{50}\sum_{i=1}^{50}\|x-x'_{(i)}\|_2^2},
        \]</div>
        <p>where \(x'_{(i)}\) is the \(i\)-th nearest image in \(\mathcal D_{\mathrm{score}}\). Values near zero indicate an unusually close training neighbor. Each model is evaluated with 256 generated images.</p>
      </article>
      <article class="experiment-detail-card">
        <h3>Result and interpretation</h3>
        <ul>
          <li>At ratio \(1\), the model has the largest off-shell freedom and mostly generalizes.</li>
          <li>As the ratio grows, the memorization ratio rises for both Transformer and U-Net models.</li>
          <li>The qualitative examples show generated samples becoming nearly identical to nearest neighbors in \(\mathcal D_{\mathrm{score}}\).</li>
        </ul>
        <p>This is stronger than a correlation: the target score is fixed while only the supervision-region coverage is manipulated.</p>
      </article>
    </div>
    <div class="experiment-detail-insight"><strong>Insight.</strong> Generalization depends on leaving part of the state space unconstrained by the finite-data empirical score. Expanding direct supervision removes that freedom and pushes the learned dynamics toward exact-score memorization.</div>
    <div class="experiment-detail-caveat"><strong>Evaluation caveat.</strong> This intervention reports memorization ratio and qualitative samples, but it does not provide a systematic FID or Inception Score curve versus \(|\mathcal D_{\mathrm{region}}|/|\mathcal D_{\mathrm{score}}|\). It establishes a causal effect on novelty, not a complete perceptual-quality tradeoff.</div>
  </div>
</section>

<section class="slide compact" data-title="Unified view">
  <div class="eyebrow">23 · Synthesis</div>
  <h2>Preserve coarse structure; avoid sample-specific attraction</h2>
  <div class="grid-2"><div class="figure-card short"><img src="assets/figures/dynamical-regimes/recap.png" alt="Dynamical regimes recap" /></div><div class="figure-card short"><img src="assets/figures/selective-underfitting/extrapolation-illustration.png" alt="Selective underfitting recap" /></div></div>
  <div class="grid-3"><article class="card"><div class="number">1</div><h3>Spectral structure</h3><p class="muted">Population directions become visible at speciation.</p></article><article class="card"><div class="number">2</div><h3>Exact-score collapse</h3><p class="muted">At low noise, one empirical component dominates.</p></article><article class="card"><div class="number">3</div><h3>Learned escape</h3><p class="muted">Off-shell trajectories follow learned extrapolation rather than exact sample attraction.</p></article></div>
</section>

<section class="slide compact" data-title="Takeaways">
  <div class="eyebrow">24 · Takeaways</div>
  <h2>What the two papers explain together</h2>
  <div class="grid-3">
    <article class="card"><div class="number">A</div><h3>Exact score is not enough</h3><p class="muted">It yields a useful middle regime, but its exact endpoint is memorization.</p></article>
    <article class="card"><div class="number">B</div><h3>Two transitions</h3><p class="muted">Speciation is population-spectral; collapse is entropy- and coverage-driven.</p></article>
    <article class="card"><div class="number">C</div><h3>Generalization is off-shell</h3><p class="muted">Novel generation depends on how the network extrapolates outside the supervision region.</p></article>
  </div>

  <div class="definition-box"><strong>Two open intervention axes:</strong> the first follows directly from Selective Underfitting; the second is a proposed research direction suggested by combining both papers.</div>

  <div class="grid-2">
    <article class="card soft">
      <h3 class="cyan">1 · Learn the off-shell field better</h3>
      <p class="muted">Predict, supervise, or regularize the vector field on inference-visited states without simply forcing it to equal the finite-data empirical score everywhere.</p>
      <div class="formula compact">\[
        x_t^{\mathrm{inf}}\notin\mathcal T_t(\delta):
        \qquad
        s_\theta(x_t^{\mathrm{inf}},t)
        \ \text{should be population-aware and dynamically stable}.
      \]</div>
      <p class="muted">Possible tools include trajectory-aware objectives, consistency constraints, population priors, or teacher signals targeted specifically at weakly supervised regions.</p>
    </article>

    <article class="card soft">
      <h3 class="gold">2 · Redesign the data geometry</h3>
      <p class="muted">Encode, project, or invertibly transform data before diffusion so that sparse, sample-specific directions are less memorization-prone and the off-shell field is smoother to learn.</p>
      <div class="formula compact">\[
        z=E(x):
        \qquad
        t_C^{(z)}\downarrow0
        \ \Longrightarrow\
        \text{shorter Regime III},
        \qquad
        \text{smoother off-shell geometry}.
      \]</div>
      <p class="muted">The design variables include effective dimension, covariance spectrum, mode separation, shell overlap, and rare-neighbor statistics—not merely compression quality.</p>
    </article>
  </div>

  <p class="paper-caption">Research hypothesis, not a claim proved by either paper: representation learning may reduce memorization both by delaying sample-level collapse and by making inference-visited regions easier to model.</p>
  <div class="jump-row"><button class="jump-link" data-jump="Appendix">Open technical appendix →</button></div>
</section>

<section class="slide appendix-divider" data-title="Appendix">
  <div class="appendix-tag">Technical appendix</div>
  <h1>Proof details and derivations</h1>
  <p class="hero-copy">The main deck keeps the causal story moving. These slides make the proof techniques explicit.</p>
  <div class="grid-3"><article class="card soft"><h3>Speciation</h3><p class="muted">Projected score, posterior dynamics, and cloning.</p></article><article class="card soft"><h3>Collapse</h3><p class="muted">Large deviations, REM free energy, and entropy volume.</p></article><article class="card soft"><h3>Selective underfitting</h3><p class="muted">Shell concentration and controlled training objectives.</p></article></div>
</section>
`);