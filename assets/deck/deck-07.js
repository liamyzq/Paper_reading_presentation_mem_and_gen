window.__DECK_HTML_PARTS = window.__DECK_HTML_PARTS || [];
window.__DECK_HTML_PARTS.push(String.raw`
<section class="slide compact" data-title="Inference extrapolation">
  <div class="eyebrow">19 · Off-shell inference</div>
  <h2>Free generation leaves the high-probability training region early</h2>
  <div class="grid-2 wide-right">
    <div class="card">
      <div class="formula compact">\[
        r^{(i)}(x,t)=\frac{\|x-a_tx_0^{(i)}\|}{b_t\sqrt d},\qquad
        r_\star=r^{(i_\star)},\quad i_\star=\arg\min_i|r^{(i)}-1|.
      \]</div>
      <ul class="clean-list"><li>\(r_\star\approx1\): near at least one supervision shell.</li><li>Training inputs remain near one.</li><li>Inference trajectories rapidly move to \(r_\star>1\).</li></ul>
      <div class="callout cool">The model is queried where the empirical score received almost no direct probability-weighted supervision.</div>
    </div>
    <div class="figure-card experiment-figure">
      <button class="figure-detail-trigger" type="button" data-detail-id="detail-offshell-inference">Experiment details</button>
      <img src="assets/figures/selective-underfitting/extrapolation-distance.png" alt="Distance of training and inference points from supervision shells" />
    </div>
  </div>
  <div class="experiment-detail-source" id="detail-offshell-inference" hidden>
    <div class="experiment-detail-header">
      <div class="experiment-detail-kicker">P20 · Figure 1b · Experiment 3.3</div>
      <h2>Off-shell inference: how the relative-distance plot is constructed</h2>
      <p>The plot is a geometric diagnostic of where the model is queried. It does not yet measure score error or image quality.</p>
    </div>
    <div class="experiment-detail-grid">
      <article class="experiment-detail-card">
        <h3>Setting</h3>
        <ul>
          <li>ImageNet \(256\times256\), represented in the SD-VAE latent space.</li>
          <li>Pretrained SiT-XL and reverse-time ODE sampling.</li>
          <li>100 timesteps and \(N=100\) training points / inference trajectories per timestep.</li>
          <li>Each point or trajectory is plotted as its own line rather than averaged.</li>
        </ul>
      </article>
      <article class="experiment-detail-card">
        <h3>Metric</h3>
        <div class="experiment-detail-formula">\[
          r^{(i)}(z_t)=\frac{\|z_t-\alpha_t x^{(i)}\|}{\sigma_t\sqrt d},
          \qquad
          r_\star=r^{(i_\star)},\quad
          i_\star=\arg\min_i|r^{(i)}-1|.
        \]</div>
        <ul>
          <li>\(r_\star\approx1\): close to at least one typical training shell.</li>
          <li>\(r_\star>1\): outside the nearest shell; \(r_\star&lt;1\): inside it.</li>
          <li>The relevant shell distance is \(|r_\star-1|\), not distance to the nearest center.</li>
        </ul>
      </article>
      <article class="experiment-detail-card">
        <h3>Procedure</h3>
        <ol>
          <li><strong>Training curve:</strong> draw \(x^{(i)}\) and noise it as \(z_t=\alpha_t x^{(i)}+\sigma_t\epsilon\).</li>
          <li><strong>Inference curve:</strong> record \(z_t\) along free ODE trajectories initialized from Gaussian noise.</li>
          <li>For every state, search across training samples for the shell closest to radius \(\sigma_t\sqrt d\), then compute \(r_\star\).</li>
        </ol>
      </article>
      <article class="experiment-detail-card">
        <h3>How to read the plot</h3>
        <ul>
          <li>Reverse generation runs from \(t=1\) to \(t=0\), so read the inference trajectories from right to left.</li>
          <li>Training points stay tightly around \(r_\star=1\).</li>
          <li>Inference trajectories rise above one after only a few denoising steps.</li>
        </ul>
      </article>
    </div>
    <div class="experiment-detail-insight"><strong>Insight.</strong> Training and inference occupy different regions of state space. This establishes the need for extrapolation; it does not by itself say whether the extrapolated score is accurate or inaccurate.</div>
  </div>
</section>

<section class="slide compact" data-title="Selective underfitting evidence">
  <div class="eyebrow">20 · Contrastive scaling</div>
  <h2>Larger models fit the empirical score on-shell—but deviate more off-shell</h2>
  <div class="grid-2 wide-left">
    <div class="figure-card"><img src="assets/figures/selective-underfitting/contrastive-scaling.png" alt="Selective underfitting contrastive scaling plot" /></div>
    <div class="card">
      <div class="formula compact">\[
        s_\theta(x,t)\approx\begin{cases}s_\star(x,t),&x\in\mathcal T_t(\delta),\\\text{learned extrapolation},&x\notin\mathcal T_t(\delta).\end{cases}
      \]</div>
      <ul class="clean-list"><li>On-shell error decreases with model scale.</li><li>Off-shell deviation from the empirical score increases.</li><li>This is region-selective fitting, not global underfitting.</li></ul>
    </div>
  </div>
</section>

<section class="slide compact" data-title="On-shell memorization">
  <div class="eyebrow">21 · Same model, different starting region</div>
  <h2>Noised training images reveal memorization inside the supervision region</h2>
  <div class="figure-pair">
    <div class="figure-card"><img src="assets/figures/selective-underfitting/phase-transition-example.png" alt="Denoising a noised training image back to the original" /></div>
    <div class="figure-card experiment-figure">
      <button class="figure-detail-trigger" type="button" data-detail-id="detail-onshell-memorization">Experiment details</button>
      <img src="assets/figures/selective-underfitting/phase-transition-plot.png" alt="Memorization ratio and shell overlap across time" />
    </div>
  </div>
  <div class="grid-2"><article class="card soft"><h3 class="rose">On-shell initialization</h3><p class="muted">A noised training image returns to its original sample over a broad low-noise range.</p></article><article class="card soft"><h3 class="green">Free initialization</h3><p class="muted">A Gaussian-noise trajectory moves off-shell and follows a different learned vector field.</p></article></div>
  <div class="experiment-detail-source" id="detail-onshell-memorization" hidden>
    <div class="experiment-detail-header">
      <div class="experiment-detail-kicker">P22 · Figure 4 · Experiment 4.2</div>
      <h2>On-shell memorization: initialization, metrics, and phase transition</h2>
      <p>The experiment asks whether the learned score is accurate enough inside the supervision region to recover the exact source training image.</p>
    </div>
    <div class="experiment-detail-grid">
      <article class="experiment-detail-card">
        <h3>Setting</h3>
        <ul>
          <li>Pretrained SiT-XL on ImageNet.</li>
          <li>\(N=200\) training images.</li>
          <li>21 starting timesteps: \(t=0,0.05,\ldots,1\).</li>
          <li>For each image and timestep, construct \(z_t=\alpha_t x^{(i)}+\sigma_t\epsilon\) and run ODE sampling from \(t\) to \(0\).</li>
        </ul>
      </article>
      <article class="experiment-detail-card">
        <h3>Memorization ratio</h3>
        <p>A completion is counted as memorization when the calibrated-\(\ell_2\) nearest image in the training set is the original source \(x^{(i)}\).</p>
        <div class="experiment-detail-formula">\[
          \operatorname{MemRatio}(t)
          =\frac{\#\{\text{outputs whose nearest training image is the source}\}}{200}.
        \]</div>
        <p>High values mean that an on-shell start reliably returns to its generating training sample.</p>
      </article>
      <article class="experiment-detail-card">
        <h3>Shell-overlap metric</h3>
        <p>The worst-case Bhattacharyya coefficient between two Gaussian components is</p>
        <div class="experiment-detail-formula">\[
          C(t)=\max_{i\ne j}
          \exp\!\left(
          -\frac{\alpha_t^2\|x^{(i)}-x^{(j)}\|^2}{8\sigma_t^2}
          \right).
        \]</div>
        <ul>
          <li>\(C(t)\approx0\): components / shells are essentially separated.</li>
          <li>\(C(t)\approx1\): strong overlap and ambiguous source identity.</li>
          <li>The plotted overlap is computed for the red-panda class (ImageNet class 387) in SD-VAE latent space.</li>
        </ul>
      </article>
      <article class="experiment-detail-card">
        <h3>Result</h3>
        <ul>
          <li>For \(t\lesssim0.8\), overlap is negligible and the memorization ratio is near one.</li>
          <li>Near the overlap transition, the source component becomes ambiguous and memorization drops sharply.</li>
          <li>The qualitative rows show the same transition for a representative training image.</li>
        </ul>
      </article>
    </div>
    <div class="experiment-detail-insight"><strong>Insight.</strong> Inside separated supervision shells, the learned score is not merely directionally useful—it is accurate enough to reconstruct the exact source sample. The apparent “memorization transition” is therefore tightly linked to whether the source Gaussian component remains identifiable.</div>
  </div>
</section>
`);
