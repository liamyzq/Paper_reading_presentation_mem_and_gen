window.__DECK_HTML_PARTS = window.__DECK_HTML_PARTS || [];
window.__DECK_HTML_PARTS.push(String.raw`
<section class="slide compact" data-title="Rare-energy mechanism">
  <div class="eyebrow">12 · How the crowd survives</div>
  <h2>The crowd survives through rare, unusually close samples</h2>
  <div class="grid-2">
    <div class="card">
      <p class="muted">For each non-self training point, define its energy per dimension:</p>
      <div class="formula compact">\[
        \varepsilon_i(t):=
        \frac1d\frac{\|X_t-a_tx_0^{(i)}\|^2}{2b_t^2}.
      \]</div>
      <p class="muted">Assume a large-deviation form</p>
      <div class="formula compact">\[
        \Pr\!\left(\varepsilon_i(t)\approx u\right)\asymp e^{-dI_t(u)}.
      \]</div>
      <div class="symbols">
        <span class="symbol"><b>\(u\)</b> candidate energy density</span>
        <span class="symbol"><b>\(I_t(u)\)</b> large-deviation cost</span>
        <span class="symbol"><b>\(\asymp\)</b> equality at leading exponential order</span>
      </div>
    </div>
    <div class="card">
      <div class="formula compact">\[
        \rho:=\frac{\log n}{d},\qquad n=e^{\rho d},
      \]</div>
      <div class="formula compact">\[
        N_t(u):=\#\{i:\varepsilon_i(t)\approx u\}
        \asymp e^{d[\rho-I_t(u)]}.
      \]</div>
      <div class="formula compact">\[
        N_t(u)e^{-du}\asymp e^{d[\rho-I_t(u)-u]}.
      \]</div>
      <div class="formula compact">\[
        \boxed{\psi_t:=\lim_{d\to\infty}\frac1d\log Z_{\mathrm{crowd}}
        =\sup_{I_t(u)\le\rho}\{\rho-I_t(u)-u\}}.
      \]</div>
    </div>
  </div>
  <div class="callout">The optimizer balances <strong>rarity</strong> against <strong>likelihood weight</strong>. Rare neighbors postpone memorization by keeping the crowd competitive; they do not cause memorization.</div>
</section>

<section class="slide compact with-corner-diagram" data-title="Microscopic collapse criterion">
  <div class="eyebrow">13 · When does Regime III begin?</div>
  <h2>Collapse occurs when the crowd loses to one committed sample</h2>
  <button class="diagram-thumb" type="button" data-zoom-src="assets/figures/generated/collapse-balance-force.svg" aria-label="Enlarge the collapse-time force-balance illustration">
    <img src="assets/figures/generated/collapse-balance-force.svg" alt="At collapse time the self force balances the aggregate crowd force" />
  </button>
  <div class="grid-2">
    <div class="card">
      <div class="formula compact">\[
        \frac1d\log Z_{\mathrm{self}}\to-\frac12,\qquad
        \frac1d\log Z_{\mathrm{crowd}}\to\psi_t.
      \]</div>
      <div class="definition-box"><strong>Regime II — liquid:</strong> if \(\psi_t>-\tfrac12\), then \(Z_{\mathrm{crowd}}\gg Z_{\mathrm{self}}\) and \(w_1(X_t,t)\to0\). The planted identity is forgotten.</div>
      <div class="definition-box"><strong>Regime III — condensed:</strong> if \(\psi_t<-\tfrac12\), then \(Z_{\mathrm{self}}\gg Z_{\mathrm{crowd}}\) and \(w_1(X_t,t)\to1\).</div>
    </div>
    <div class="card">
      <div class="formula">\[
        \boxed{\psi_{t_C}=-\frac12}.
      \]</div>
      <div class="formula compact">\[
        s_\star(X_t,t)\approx-\frac{X_t-a_tx_0^{(1)}}{b_t^2}
        \qquad \bigl(t&lt;t_C\text{ along the backward trajectory}\bigr).
      \]</div>
      <p class="muted">At \(t_C\), the state is still noisy:</p>
      <div class="formula compact">\[
        X_{t_C}\ne x_0^{(1)}.
      \]</div>
      <p class="muted">What becomes fixed is <strong>which training sample the trajectory will return to</strong>. Only later, as \(b_t\to0\), does it reach that sample at \(t=0\).</p>
    </div>
  </div>
  <div class="callout cool">\[
    \text{diffuse index posterior}\to\text{one dominant index}\to\text{sample-specific score}\to\text{memorization}.
  \]</div>
</section>

<section class="slide compact with-corner-diagram" data-title="Entropy-volume criterion">
  <div class="eyebrow">14 · Distribution-free geometric view</div>
  <h2>Collapse is also a failure of empirical coverage</h2>
  <button class="diagram-thumb diagram-thumb-wide" type="button" data-zoom-src="assets/figures/generated/coverage-volume-regimes.svg" aria-label="Enlarge the empirical-versus-population coverage illustration">
    <img src="assets/figures/generated/coverage-volume-regimes.svg" alt="Under-coverage above collapse, equality at collapse, and separated-neighborhood dominance below collapse" />
  </button>
  <div class="grid-2">
    <div class="card">
      <h3>Separated empirical volume</h3>
      <div class="formula compact">\[
        H_G(t)=\frac d2\log(2\pi e b_t^2),\qquad
        V_G(t)\asymp e^{H_G(t)}=(2\pi e b_t^2)^{d/2}.
      \]</div>
      <div class="formula compact">\[
        V_{\mathrm{sep}}(t)\asymp nV_G(t)\asymp e^{dh^{\mathrm{sep}}(t)},
      \]</div>
      <div class="formula compact">\[
        h^{\mathrm{sep}}(t):=\frac{\log n}{d}+\frac12+\frac12\log(2\pi b_t^2).
      \]</div>
    </div>
    <div class="card">
      <h3>Population typical volume</h3>
      <div class="formula compact">\[
        h(t):=-\frac1d\int p_t(x)\log p_t(x)\,dx,\qquad
        V_{\mathrm{pop}}(t)\asymp e^{dh(t)}.
      \]</div>
      <div class="formula compact">\[
        \frac{V_{\mathrm{sep}}(t)}{V_{\mathrm{pop}}(t)}
        \asymp e^{-d[h(t)-h^{\mathrm{sep}}(t)]}.
      \]</div>
      <div class="formula">\[
        \boxed{h^{\mathrm{sep}}(t_C)=h(t_C)}.
      \]</div>
    </div>
  </div>
  <div class="definition-box"><strong>Meaning of volume:</strong> leading exponential volume of the high-probability typical region, not literal support volume. When Gaussian neighborhoods are essentially non-overlapping, their typical volumes add.</div>
  <div class="callout">REM compares density contributions in training-index space; entropy compares coverage volumes in data space. They describe the same transition.</div>
</section>
`);
