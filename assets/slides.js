(async () => {
  try {
    const response = await fetch('assets/slides-v2.js.gz.b64', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load revised presentation source: ${response.status}`);

    const base64 = (await response.text()).trim();
    const compressed = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));

    if (typeof DecompressionStream !== 'function') {
      throw new Error('This browser does not support gzip DecompressionStream. Please use a current Chrome, Edge, Firefox, or Safari version.');
    }

    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const source = await new Response(stream).text();
    (0, eval)(source);

    const slides = [...document.querySelectorAll('.slide')];
    const changed = [];
    const replaceSlide = (index, title, html) => {
      const slide = slides[index];
      if (!slide) return;
      slide.dataset.title = title;
      slide.innerHTML = html;
      changed.push(slide);
    };

    const findAppendix = (prefix) => slides.find((slide) => {
      const eyebrow = slide.querySelector('.eyebrow');
      return eyebrow && eyebrow.textContent.trim().startsWith(prefix);
    });

    replaceSlide(6, 'Speciation criterion', String.raw`
      <div class="eyebrow">05 · Speciation criterion</div>
      <h2>Speciation begins when one population direction reaches unit signal-to-noise</h2>
      <div class="grid-2">
        <div class="card">
          <div class="formula">\[
            C_t=a_t^2C_0+b_t^2I_d,
            \qquad
            \operatorname{SNR}_{\max}(t):=\frac{a_t^2\Lambda}{b_t^2}
          \]</div>
          <div class="formula">\[
            \operatorname{SNR}_{\max}(t_S)\asymp1
          \]</div>
          <div class="symbols">
            <span class="symbol"><b>\(C_0\)</b> covariance of clean population data</span>
            <span class="symbol"><b>\(\Lambda\)</b> largest eigenvalue of \(C_0\)</span>
            <span class="symbol"><b>\(a_t,b_t\)</b> signal and noise scales in \(x_t=a_tx_0+b_t\epsilon\)</span>
          </div>
        </div>
        <div class="card">
          <h3>What changes at \(t_S\)?</h3>
          <ul class="clean-list">
            <li><span class="rose">High noise:</span> \(a_t^2\Lambda\ll b_t^2\). Different classes overlap along every direction.</li>
            <li><span class="gold">At speciation:</span> the strongest structured variance matches the isotropic noise variance.</li>
            <li><span class="green">Lower noise:</span> that direction becomes statistically visible, so reverse trajectories can commit to different classes.</li>
          </ul>
          <div class="callout cool">This is a <strong>class-scale transition</strong>: the model recognizes a macroscopic direction before it recognizes any individual training sample.</div>
        </div>
      </div>
    `);

    replaceSlide(7, 'Landau proof', String.raw`
      <div class="eyebrow">06 · Why the SNR criterion is universal</div>
      <h2>Landau expansion: the top data direction is the first curvature to become unstable</h2>
      <div class="grid-2 wide-right">
        <div class="card">
          <ol class="clean-list">
            <li>Expand the log-density at high noise, where \(a_t/b_t\) is small.</li>
            <li>The data covariance enters only through the quadratic term.</li>
            <li>Along the leading eigenvector \(v_1\), the curvature changes sign exactly when the leading SNR reaches one.</li>
            <li>Higher-order terms then stabilize two separated branches: a symmetry-breaking transition.</li>
          </ol>
          <div class="callout cool">The spectral argument and the phase-transition argument are the <strong>same calculation viewed from two sides</strong>.</div>
        </div>
        <div>
          <div class="formula compact">\[
            \log p_t(x)
            =K_t+\ell_t^\top x
            -\frac{1}{2b_t^2}x^\top M_tx
            +O\!\left((a_t\|x\|/b_t^2)^3\right)
          \]</div>
          <div class="formula">\[
            M_t=I_d-\frac{a_t^2}{b_t^2}C_0,
            \qquad
            v_1^\top M_tv_1=1-\frac{a_t^2\Lambda}{b_t^2}
          \]</div>
          <div class="symbols">
            <span class="symbol"><b>\(K_t\)</b> scalar independent of \(x\)</span>
            <span class="symbol"><b>\(\ell_t\)</b> linear coefficient; zero for centered data</span>
            <span class="symbol"><b>\(M_t\)</b> dimensionless quadratic-curvature matrix</span>
            <span class="symbol"><b>\(v_1\)</b> top eigenvector of \(C_0\)</span>
          </div>
        </div>
      </div>
    `);

    replaceSlide(8, 'Gaussian mixture', String.raw`
      <div class="eyebrow">07 · Solvable model</div>
      <h2>For two Gaussian classes, one scalar order parameter tracks the class decision</h2>
      <div class="grid-2 wide-left">
        <div class="figure-card"><img src="assets/figures/dynamical-regimes/speciation-gm.png" alt="Gaussian mixture speciation curves" /></div>
        <div class="card">
          <div class="formula compact">\[
            p_0=\tfrac12\mathcal N(m,\sigma^2I_d)+\tfrac12\mathcal N(-m,\sigma^2I_d),
            \qquad \|m\|^2=d\widetilde\mu^2
          \]</div>
          <div class="formula">\[
            q_t:=\frac{m^\top x_t}{\sqrt d},
            \qquad
            \Gamma_t:=b_t^2+\sigma^2a_t^2
          \]</div>
          <ul class="clean-list">
            <li>\(m\): direction separating the two class centers; their distance is \(2\sqrt d\,\widetilde\mu\).</li>
            <li>Before speciation, \(m^\top x_t=O(\sqrt d)\), so \(q_t=O(1)\) and noise can still change its sign.</li>
            <li>After speciation, \(m^\top x_t=\pm\Theta(d)\): its sign is macroscopically stable and identifies the selected class.</li>
          </ul>
          <div class="callout cool">The scaling changes from <strong>fluctuation size \(\sqrt d\)</strong> to <strong>signal size \(d\)</strong>.</div>
        </div>
      </div>
      <p class="paper-caption">Figure: Biroli et al., Gaussian-mixture speciation.</p>
    `);

    replaceSlide(9, 'Cloning observable', String.raw`
      <div class="eyebrow">08 · Operational diagnostic</div>
      <h2>Clone one state and ask whether independent futures retain the same class</h2>
      <div class="grid-2">
        <div class="card">
          <div class="formula compact">\[
            \phi(t):=
            \Pr\!\left(
              c(X_0^{(1)})=c(X_0^{(2)})
              \;\middle|\;
              X_t^{(1)}=X_t^{(2)}
            \right)
          \]</div>
          <div class="symbols">
            <span class="symbol"><b>\(X_t^{(1)},X_t^{(2)}\)</b> clones sharing the same state at clone time \(t\)</span>
            <span class="symbol"><b>\(c(X_0)\)</b> final semantic class</span>
          </div>
          <ul class="clean-list">
            <li>\(\operatorname{SNR}_{\max}(t)\ll1\): the class is unresolved, so independent future noise gives \(\phi(t)\approx\tfrac12\).</li>
            <li>\(\operatorname{SNR}_{\max}(t)\gg1\): the shared state already carries a stable class sign, so \(\phi(t)\approx1\).</li>
            <li>The transition in \(\phi(t)\) is therefore an empirical measurement of \(t_S\).</li>
          </ul>
        </div>
        <div class="figure-card"><img src="assets/figures/dynamical-regimes/speciation-real.png" alt="Clone-based speciation curves across realistic datasets" /></div>
      </div>
      <p class="paper-caption">Figure: Biroli et al. The horizontal quantity is reverse-process time rescaled by the predicted \(t_S\); the vertical quantity is the same-class clone probability \(\phi(t)\).</p>
    `);

    replaceSlide(10, 'Regime II', String.raw`
      <div class="eyebrow">09 · Why Regime II is class-level generalization</div>
      <h2>Speciation makes the class logit large, so the mixture score reduces to one class score</h2>
      <div class="grid-2">
        <div class="card">
          <div class="formula compact">\[
            s(x,t)=-\frac{x}{\Gamma_t}
            +\frac{a_tm}{\Gamma_t}\tanh(u_t),
            \qquad
            u_t:=\frac{a_t m^\top x}{\Gamma_t}
          \]</div>
          <div class="symbols">
            <span class="symbol"><b>\(u_t\)</b> class log-likelihood coordinate entering the soft class assignment</span>
            <span class="symbol"><b>\(\Gamma_t\)</b> total within-class variance after noising</span>
          </div>
          <p class="muted">The phrase “\(m^\top x\to\infty\)” is large-\(d\) shorthand: after speciation, \(|m^\top x|\) scales as \(d\), rather than remaining a \(\sqrt d\)-sized fluctuation.</p>
        </div>
        <div class="card">
          <div class="formula compact">\[
            \begin{array}{lll}
            t\text{ before }t_S:&m^\top x=O(\sqrt d),&u_t\text{ is not sign-stable},\\[2mm]
            t\text{ after }t_S:&m^\top x=\pm\Theta(d),&|u_t|\gg1.
            \end{array}
          \]</div>
          <div class="formula">\[
            \tanh(u_t)\to\pm1
            \quad\Longrightarrow\quad
            s(x,t)\to s_{\pm}(x,t):=-\frac{x}{\Gamma_t}\pm\frac{a_tm}{\Gamma_t}
          \]</div>
          <div class="callout cool">\(s_{\pm}\) is the score of the <strong>entire Gaussian class</strong> centered at \(\pm m\), not the score of one training sample.</div>
        </div>
      </div>
      <p class="paper-caption">Connection to the previous slides: for this mixture, \(\Lambda\simeq d\widetilde\mu^2\), so crossing the spectral SNR threshold is exactly what makes the class coordinate \(u_t\) grow and saturate.</p>
    `);

    replaceSlide(11, 'Collapse competition', String.raw`
      <div class="eyebrow">10 · From class commitment to sample commitment</div>
      <h2>Collapse is a competition between one guaranteed-close sample and an exponentially large crowd</h2>
      <div class="grid-2 wide-right">
        <div class="figure-card"><img src="assets/figures/dynamical-regimes/collapse-gm.png" alt="Gaussian mixture collapse" /></div>
        <div class="card">
          <div class="formula compact">\[
            x=a_ta_1+b_tz,\qquad z\sim\mathcal N(0,I_d)
          \]</div>
          <div class="formula compact">\[
            p_t^e(x)\propto
            \underbrace{Z_{\mathrm{self}}}_{a_1}
            +
            \underbrace{Z_{\mathrm{crowd}}}_{a_2,\ldots,a_n}
          \]</div>
          <div class="formula compact">\[
            Z_{\mathrm{self}}=e^{-\|z\|^2/2}\asymp e^{-d/2},
            \qquad
            Z_{\mathrm{crowd}}=\sum_{\mu\ne1}
            e^{-\|x-a_ta_\mu\|^2/(2b_t^2)}
          \]</div>
          <ul class="clean-list">
            <li>\(a_1\) is guaranteed to be unusually close because \(x\) was generated by noising it.</li>
            <li>A typical other sample is far away and contributes almost nothing.</li>
            <li>But there are \(n=e^{\rho d}\) other samples, so rare unusually close members of the crowd can matter.</li>
          </ul>
        </div>
      </div>
      <div class="callout">The key question is an <strong>extreme-value question</strong>: can the best rare energy band in the crowd beat the guaranteed self contribution?</div>
    `);

    replaceSlide(12, 'Rare-energy mechanism', String.raw`
      <div class="eyebrow">11 · The central collapse insight</div>
      <h2>Memorization is controlled by rare low-energy neighbors—not by a typical neighbor</h2>
      <div class="grid-2">
        <div class="card">
          <div class="formula compact">\[
            \varepsilon_\mu(t):=
            \frac{1}{d}\frac{\|x-a_ta_\mu\|^2}{2b_t^2},
            \qquad
            \Pr\bigl(\varepsilon_\mu(t)\approx u\bigr)\asymp e^{-dI_t(u)}
          \]</div>
          <div class="symbols">
            <span class="symbol"><b>\(\varepsilon_\mu\)</b> energy per dimension of sample \(\mu\)</span>
            <span class="symbol"><b>\(I_t(u)\)</b> large-deviation cost of seeing energy \(u\)</span>
            <span class="symbol"><b>\(\rho=\log n/d\)</b> log number of data per dimension</span>
          </div>
        </div>
        <div class="card">
          <div class="formula compact">\[
            \#\{\mu:\varepsilon_\mu\approx u\}
            \asymp e^{d[\rho-I_t(u)]}
          \]</div>
          <div class="formula compact">\[
            \text{total weight from energy }u
            \asymp
            e^{d[\rho-I_t(u)]}\,e^{-du}
            =e^{d[\rho-I_t(u)-u]}
          \]</div>
          <ul class="clean-list">
            <li>Lower \(u\) gives exponentially larger density weight \(e^{-du}\).</li>
            <li>But lower \(u\) is exponentially rarer through \(e^{-dI_t(u)}\).</li>
            <li>The dominant crowd contribution is the energy band with the best rarity–weight trade-off.</li>
          </ul>
        </div>
      </div>
      <div class="callout cool"><strong>Rare-event mechanism:</strong> an exponentially rare near-neighbor can still dominate because its likelihood contribution is exponentially larger.</div>
    `);

    replaceSlide(13, 'Crowd exponent and collapse time', String.raw`
      <div class="eyebrow">12 · Summarizing the crowd</div>
      <h2>The crowd exponent \(\psi_t\) is the per-dimension log density supplied by all non-self samples</h2>
      <div class="grid-2">
        <div class="card">
          <div class="formula compact">\[
            \psi_t
            :=\lim_{d\to\infty}\frac1d\log Z_{\mathrm{crowd}}
            =\sup_{u:\,I_t(u)\le\rho}
            \bigl\{\rho-I_t(u)-u\bigr\}
          \]</div>
          <p class="muted">\(\psi_t\) is <strong>not</strong> a probability and not an individual energy. It is the exponential rate of the crowd's total density contribution after optimizing over all feasible energy bands.</p>
        </div>
        <div class="card">
          <div class="formula compact">\[
            \frac1d\log Z_{\mathrm{self}}\to-\frac12
          \]</div>
          <div class="formula compact">\[
            \begin{cases}
            \psi_t>-\tfrac12,& Z_{\mathrm{crowd}}>Z_{\mathrm{self}}:\ \text{no sample commitment},\\[1mm]
            \psi_t<-\tfrac12,& Z_{\mathrm{self}}>Z_{\mathrm{crowd}}:\ \text{collapse to }a_1.
            \end{cases}
          \]</div>
          <div class="formula">\[
            \boxed{\psi_{t_C}=-\frac12}
          \]</div>
        </div>
      </div>
      <div class="formula compact">\[
        \text{Gaussian mixture:}\qquad
        \frac{b_{t_C}^2}{a_{t_C}^2}
        =\frac{\sigma^2}{e^{2\rho}-1}
      \]</div>
      <div class="callout cool">More data increases \(\rho\), so the crowd can defeat the self point until a lower noise-to-signal ratio: collapse is postponed closer to the data endpoint.</div>
    `);

    replaceSlide(14, 'Entropy-volume proof', String.raw`
      <div class="eyebrow">13 · A second proof with the same insight</div>
      <h2>Collapse is also the moment when separated empirical neighborhoods cannot cover the population typical set</h2>
      <div class="grid-2">
        <div class="card">
          <div class="formula compact">\[
            V_{\mathrm{pop}}(t)\asymp e^{dh_t},
            \qquad
            h_t:=-\frac1d\int p_t(x)\log p_t(x)\,dx
          \]</div>
          <div class="formula compact">\[
            V_{\mathrm{sep}}(t)
            \asymp n\,e^{dh_G(t)}
            =e^{dh_t^{\mathrm{sep}}},
            \qquad
            h_t^{\mathrm{sep}}
            =\rho+\frac12\bigl[1+\log(2\pi b_t^2)\bigr]
          \]</div>
          <div class="symbols">
            <span class="symbol"><b>\(h_t\)</b> population entropy per dimension</span>
            <span class="symbol"><b>\(h_t^{\mathrm{sep}}\)</b> entropy per dimension of \(n\) non-overlapping noised sample neighborhoods</span>
          </div>
        </div>
        <div class="card">
          <div class="formula">\[
            g_t:=h_t^{\mathrm{sep}}-h_t,
            \qquad
            g_{t_C}=0
          \]</div>
          <ul class="clean-list">
            <li>\(g_t>0\): the crowd of noised samples has enough total volume to cover the population typical set.</li>
            <li>\(g_t<0\): separated sample neighborhoods occupy an exponentially vanishing fraction of population volume.</li>
            <li>Then trajectories lie in isolated sample basins and the empirical score becomes sample-specific.</li>
          </ul>
          <div class="callout cool">REM language: <strong>entropy versus energy</strong>. Volume language: <strong>coverage versus localization</strong>. They express the same transition.</div>
          <button class="chip dr-jump" type="button" data-appendix="A6">See how the paper measures \(t_C\) →</button>
        </div>
      </div>
    `);

    const a1 = findAppendix('A1');
    if (a1) {
      a1.dataset.title = 'A1 Landau derivation';
      a1.innerHTML = String.raw`
        <div class="eyebrow">A1 · Landau / cumulant expansion</div>
        <h2>Deriving \(M_t=I-(a_t^2/b_t^2)C_0\)</h2>
        <div class="formula tiny">\[
          p_t(x)=\frac{e^{-\|x\|^2/(2b_t^2)}}{(2\pi b_t^2)^{d/2}}
          \;\mathbb E_{x_0\sim p_0}
          \exp\!\left(
            \frac{a_t}{b_t^2}x^\top x_0
            -\frac{a_t^2}{2b_t^2}\|x_0\|^2
          \right)
        \]</div>
        <div class="grid-2">
          <div class="card">
            <h3>1. Expand the log moment-generating function</h3>
            <div class="formula tiny">\[
              \log p_t(x)=K_t+\frac{a_t}{b_t^2}\mu_0^\top x
              -\frac{1}{2b_t^2}x^\top
              \left(I_d-\frac{a_t^2}{b_t^2}C_0\right)x+O(a_t^3)
            \]</div>
            <p class="muted">For centered data, \(\mu_0=0\), so the first structural correction is the covariance term.</p>
          </div>
          <div class="card">
            <h3>2. Project onto covariance eigenvectors</h3>
            <div class="formula tiny">\[
              C_0v_j=\lambda_jv_j
              \quad\Longrightarrow\quad
              v_j^\top M_tv_j=1-\frac{a_t^2\lambda_j}{b_t^2}
            \]</div>
            <p class="muted">The top mode \(\lambda_1=\Lambda\) crosses zero first, yielding the speciation criterion.</p>
          </div>
        </div>
        <button class="chip dr-jump" type="button" data-main-title="Landau proof">← Return to proof sketch</button>
      `;
      changed.push(a1);
    }

    const a2 = findAppendix('A2');
    if (a2) {
      a2.dataset.title = 'A2 Order-parameter dynamics';
      a2.innerHTML = String.raw`
        <div class="eyebrow">A2 · Gaussian-mixture dynamics</div>
        <h2>Why \(q_t\) changes from an \(O(1)\) fluctuation to a class-selective branch</h2>
        <div class="grid-2">
          <div class="card">
            <div class="formula tiny">\[
              s(x,t)=-\frac{x}{\Gamma_t}
              +\frac{a_tm}{\Gamma_t}
              \tanh\!\left(\frac{a_tm^\top x}{\Gamma_t}\right),
              \qquad \Gamma_t=b_t^2+\sigma^2a_t^2
            \]</div>
            <div class="formula tiny">\[
              q_t=\frac{m^\top x_t}{\sqrt d},
              \qquad
              -dq_t=-\partial_qV_t(q_t)\,dt+d\eta_t
            \]</div>
          </div>
          <div class="card">
            <div class="formula tiny">\[
              V_t(q)\approx\frac12q^2
              -2\widetilde\mu^2
              \log\cosh\!\left(\frac{a_t\sqrt d}{\Gamma_t}q\right)
            \]</div>
            <ul class="clean-list">
              <li>Small \(a_t\sqrt d/\Gamma_t\): one noise-dominated branch around zero.</li>
              <li>Order-one value: curvature at zero is lost.</li>
              <li>Large value: two macroscopically separated class branches.</li>
            </ul>
          </div>
        </div>
        <button class="chip dr-jump" type="button" data-main-title="Regime II">← Return to Regime II</button>
      `;
      changed.push(a2);
    }

    const a4 = findAppendix('A4');
    if (a4) {
      a4.dataset.title = 'A4 REM derivation';
      a4.innerHTML = String.raw`
        <div class="eyebrow">A4 · Random Energy Model derivation</div>
        <h2>From a large-deviation principle to the crowd exponent</h2>
        <div class="grid-2">
          <div class="card">
            <div class="formula tiny">\[
              \Pr(\varepsilon_\mu\in[u,u+du])\asymp e^{-dI_t(u)}du,
              \qquad n=e^{\rho d}
            \]</div>
            <div class="formula tiny">\[
              N_t(u)\asymp e^{d[\rho-I_t(u)]}
            \]</div>
            <p class="muted">Only energies satisfying \(I_t(u)\le\rho\) are represented with non-vanishing probability in a dataset of this size.</p>
          </div>
          <div class="card">
            <div class="formula tiny">\[
              Z_{\mathrm{crowd}}
              \asymp\int_{I_t(u)\le\rho}
              \exp\!\left(d[\rho-I_t(u)-u]\right)du
            \]</div>
            <div class="formula tiny">\[
              \psi_t=\sup_{I_t(u)\le\rho}\{\rho-I_t(u)-u\}
            \]</div>
            <p class="muted">The optimizer may sit at a typical interior energy or at the lowest energy available in the finite dataset; the latter is the condensation/extreme-value regime.</p>
          </div>
        </div>
        <button class="chip dr-jump" type="button" data-main-title="Rare-energy mechanism">← Return to rare-energy intuition</button>
      `;
      changed.push(a4);
    }

    const a5 = findAppendix('A5');
    if (a5) {
      a5.dataset.title = 'A5 Gaussian collapse formula';
      a5.innerHTML = String.raw`
        <div class="eyebrow">A5 · Gaussian-mixture closed form</div>
        <h2>How the schedule-free collapse ratio is obtained</h2>
        <div class="grid-2">
          <div class="card">
            <p class="muted">For the same-class crowd in the non-collapsed branch, the Gaussian moment calculation gives</p>
            <div class="formula">\[
              \psi_t
              =\rho+\frac12\log\frac{b_t^2}{b_t^2+\sigma^2a_t^2}-\frac12
            \]</div>
          </div>
          <div class="card">
            <p class="muted">Equating the crowd exponent to the self exponent \(-1/2\) yields</p>
            <div class="formula">\[
              \frac{b_{t_C}^2}{a_{t_C}^2}
              =\frac{\sigma^2}{e^{2\rho}-1}
            \]</div>
            <p class="muted">For the OU schedule \(a_t=e^{-t}\), \(b_t^2=1-a_t^2\), this reduces to the paper's displayed expression for \(t_C\).</p>
          </div>
        </div>
        <button class="chip dr-jump" type="button" data-main-title="Crowd exponent and collapse time">← Return to collapse criterion</button>
      `;
      changed.push(a5);
    }

    const a6 = findAppendix('A6');
    if (a6) {
      a6.dataset.title = 'A6 Collapse diagnostics';
      a6.innerHTML = String.raw`
        <div class="eyebrow">A6 · What the collapse figure measures</div>
        <h2>Three empirical diagnostics locate the same transition</h2>
        <div class="grid-2 wide-left">
          <div class="figure-card"><img src="assets/figures/dynamical-regimes/collapse-real.png" alt="Collapse diagnostics on realistic datasets" /></div>
          <div class="card">
            <ul class="clean-list">
              <li><strong>Top left — \(\phi_C(t)\):</strong> probability that two clones created at time \(t\) end at the same training sample.</li>
              <li><strong>Top right — \(\widehat t_C\):</strong> distribution of the last reverse time at which the nearest-neighbor identity changes.</li>
              <li><strong>Bottom — \(g_t^e=h_t^{\mathrm{sep}}-h_t^e\):</strong> empirical coverage gap; its zero estimates the entropy criterion.</li>
              <li><strong>Vertical dashed lines:</strong> mean nearest-neighbor locking time, compared against the clone and entropy estimates.</li>
            </ul>
            <div class="callout cool">The figure is evidence that <strong>trajectory locking, nearest-neighbor commitment, and entropy coverage failure</strong> occur at the same scale.</div>
            <button class="chip dr-jump" type="button" data-main-title="Entropy-volume proof">← Return to volume proof</button>
          </div>
        </div>
      `;
      changed.push(a6);
    }

    const style = document.createElement('style');
    style.dataset.dynamicRegimesRevision = 'true';
    style.textContent = `
      .slide .dr-jump { cursor: pointer; margin-top: 8px; color: var(--cyan); }
      .slide .dr-jump:hover { border-color: rgba(99,227,217,.55); color: var(--ink); }
      .slide[data-title="Rare-energy mechanism"] .formula,
      .slide[data-title="Crowd exponent and collapse time"] .formula,
      .slide[data-title="Entropy-volume proof"] .formula { font-size: clamp(18px,1.42vw,27px); }
      .slide[data-title="Regime II"] .paper-caption,
      .slide[data-title="Cloning observable"] .paper-caption { font-size: clamp(13px,.9vw,16px); }
    `;
    document.head.appendChild(style);

    const renderOptions = {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }
      ],
      throwOnError: false,
      strict: false
    };
    if (window.renderMathInElement) changed.forEach((slide) => renderMathInElement(slide, renderOptions));

    const jumpTo = (target) => {
      const currentText = document.getElementById('slideNo')?.textContent || '1';
      const currentIndex = Math.max(0, Number.parseInt(currentText, 10) - 1);
      const targetIndex = slides.indexOf(target);
      if (targetIndex < 0) return;
      const forward = (targetIndex - currentIndex + slides.length) % slides.length;
      const backward = (currentIndex - targetIndex + slides.length) % slides.length;
      const button = forward <= backward ? document.getElementById('next') : document.getElementById('prev');
      const steps = Math.min(forward, backward);
      for (let step = 0; step < steps; step += 1) button?.click();
    };

    document.querySelectorAll('.dr-jump').forEach((button) => {
      button.addEventListener('click', () => {
        let target = null;
        if (button.dataset.appendix) target = findAppendix(button.dataset.appendix);
        if (button.dataset.mainTitle) target = slides.find((slide) => slide.dataset.title === button.dataset.mainTitle);
        if (target) jumpTo(target);
      });
    });
  } catch (error) {
    console.error(error);
    const notice = document.createElement('div');
    notice.style.cssText = 'position:fixed;inset:18px 18px auto;z-index:9999;padding:14px 18px;border:1px solid #ff91a5;border-radius:12px;background:#24111a;color:#ffe8ed;font:16px/1.4 system-ui';
    notice.textContent = `Presentation revision failed to load: ${error.message}`;
    document.body.appendChild(notice);
  }
})();