window.__DECK_HTML_PARTS = window.__DECK_HTML_PARTS || [];
window.__DECK_HTML_PARTS.push(String.raw`
<section class="slide compact" data-title="Speciation experiment">
  <div class="eyebrow">09 · Experimental test</div>
  <h2>Cloning measures whether the class is already fixed at time \(t\)</h2>
  <div class="grid-2 wide-left">
    <div class="card">
      <div class="proof-chain">
        <div class="proof-step"><span class="step-no">1</span><p>Run one reverse trajectory to time \(t\), obtaining a shared state \(X_t\).</p></div>
        <div class="proof-step"><span class="step-no">2</span><p>Clone \(X_t\) and continue with independent future noises to endpoints \(X_0^{(1)},X_0^{(2)}\).</p></div>
        <div class="proof-step"><span class="step-no">3</span><p>Compare their final semantic labels with classifier \(c(\cdot)\).</p></div>
      </div>
      <div class="formula compact">\[
        \phi(t):=\Pr\!\left(c(X_0^{(1)})=c(X_0^{(2)})\mid X_t^{(1)}=X_t^{(2)}\right).
      \]</div>
      <ul class="clean-list"><li>Before speciation: \(\phi(t)\) is near chance.</li><li>After speciation: both futures preserve the same class, so \(\phi(t)\to1\).</li></ul>
    </div>
    <div class="figure-card"><img src="assets/figures/dynamical-regimes/speciation-real.png" alt="Clone-based speciation curves rescaled by predicted speciation time" /></div>
  </div>
  <p class="paper-caption">Horizontal axis: reverse time normalized by the theoretical \(t_S\). Vertical axis: same-class clone probability \(\phi(t)\). The transition aligns near \(t/t_S\approx1\).</p>
  <div class="jump-row"><button class="jump-link" data-jump="Exact reverse dynamics">Back to the paper's three-regime overview</button><button class="jump-link" data-jump="A3 Cloning formula">Derive the cloning formula →</button></div>
</section>

<section class="slide compact" data-title="Collapse definition">
  <div class="eyebrow">10 · Regime III: what changes?</div>
  <h2>Collapse means posterior concentration on one training index</h2>
  <div class="grid-2">
    <div class="card">
      <div class="formula compact">\[
        \mathcal D:=\{x_0^{(i)}\}_{i=1}^n,\qquad
        p_t^e(x)=\frac1n\sum_{i=1}^n\mathcal N\!\left(x;a_tx_0^{(i)},b_t^2I_d\right).
      \]</div>
      <p class="muted">Define the posterior responsibility of training index \(i\):</p>
      <div class="formula tiny">\[
        w_i(x,t):=
        \frac{\exp\!\left[-\|x-a_tx_0^{(i)}\|^2/(2b_t^2)\right]}
        {\sum_{j=1}^n\exp\!\left[-\|x-a_tx_0^{(j)}\|^2/(2b_t^2)\right]}
        =\Pr(i\mid X_t=x).
      \]</div>
      <div class="symbols"><span class="symbol"><b>\(w_i(x,t)\)</b> posterior probability that component \(i\) generated \(x\)</span></div>
    </div>
    <div class="card">
      <div class="formula compact">\[
        s_\star(x,t):=\nabla_x\log p_t^e(x)
        =-\frac{x-a_t\sum_{i=1}^nw_i(x,t)x_0^{(i)}}{b_t^2}.
      \]</div>
      <div class="phase-table">
        <div class="definition-box"><strong>Regime II:</strong> \(\max_iw_i(x,t)\ll1\). Many indices jointly determine the score.</div>
        <div class="definition-box"><strong>Regime III:</strong> \(w_{i_\star}(x,t)\to1\), hence \(s_\star(x,t)\approx-[x-a_tx_0^{(i_\star)}]/b_t^2\).</div>
      </div>
    </div>
  </div>
  <div class="callout">Collapse is not merely spatial proximity. It is <strong>concentration of the posterior over the training-sample index</strong>.</div>
</section>

<section class="slide compact with-corner-diagram" data-title="Self versus crowd">
  <div class="eyebrow">11 · A planted diagnostic</div>
  <h2>Probe memory using a typical noised training sample</h2>
  <button class="diagram-thumb" type="button" data-zoom-src="assets/figures/generated/self-vs-crowd-force.svg" aria-label="Enlarge the self-versus-crowd force illustration">
    <img src="assets/figures/generated/self-vs-crowd-force.svg" alt="One strong self force versus many weak crowd forces" />
  </button>
  <div class="grid-2">
    <div class="card">
      <p class="muted">Choose one training point as a planted source and forward-noise it:</p>
      <div class="formula">\[
        X_t=a_tx_0^{(1)}+b_tZ,\qquad Z\sim\mathcal N(0,I_d).
      \]</div>
      <div class="definition-box"><strong>Planted source:</strong> \(x_0^{(1)}\) is selected only for analysis. A genuine reverse trajectory does not know in advance which training sample it will eventually choose.</div>
      <div class="formula compact">\[
        p_t^e(X_t)\propto Z_{\mathrm{self}}+Z_{\mathrm{crowd}}.
      \]</div>
    </div>
    <div class="card">
      <div class="formula compact">\[
        Z_{\mathrm{self}}
        :=\exp\!\left[-\frac{\|X_t-a_tx_0^{(1)}\|^2}{2b_t^2}\right]
        =e^{-\|Z\|^2/2},
      \]</div>
      <div class="formula compact">\[
        Z_{\mathrm{crowd}}
        :=\sum_{i=2}^n\exp\!\left[-\frac{\|X_t-a_tx_0^{(i)}\|^2}{2b_t^2}\right].
      \]</div>
      <div class="formula">\[
        \frac{\|Z\|^2}{d}\to1
        \quad\Longrightarrow\quad
        \boxed{\frac1d\log Z_{\mathrm{self}}\to-\frac12}.
      \]</div>
    </div>
  </div>
  <div class="callout cool">The collapse question is whether the <strong>aggregate crowd</strong> can beat the guaranteed self contribution—not whether one typical neighbor can.</div>
</section>
`);
