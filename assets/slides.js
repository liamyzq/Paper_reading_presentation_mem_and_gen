(async () => {
  try {
    const response = await fetch('assets/slides-v2.js.gz.b64', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load revised presentation source: ${response.status}`);

    const base64 = (await response.text()).trim();
    const compressed = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
    if (typeof DecompressionStream !== 'function') {
      throw new Error('This browser does not support gzip DecompressionStream. Please use a current browser.');
    }

    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
    const source = await new Response(stream).text();
    (0, eval)(source);

    const originalSlides = [...document.querySelectorAll('.slide')];
    const changed = [];

    const replace = (slide, title, html) => {
      if (!slide) return;
      slide.dataset.title = title;
      slide.innerHTML = html;
      changed.push(slide);
    };

    const makeSlide = (title, html, classes = 'compact') => {
      const section = document.createElement('section');
      section.className = `slide ${classes}`.trim();
      section.dataset.title = title;
      section.innerHTML = html;
      changed.push(section);
      return section;
    };

    const insertAfter = (reference, node) => {
      reference.parentNode.insertBefore(node, reference.nextSibling);
    };

    const findAppendix = (prefix) => [...document.querySelectorAll('.slide')].find((slide) => {
      const eyebrow = slide.querySelector('.eyebrow');
      return eyebrow && eyebrow.textContent.trim().startsWith(prefix);
    });

    const speciation = originalSlides[6];
    const curvature = originalSlides[7];
    const gaussianModel = originalSlides[8];
    const noisedClasses = originalSlides[9];
    const posteriorDecision = originalSlides[10];
    const collapse = originalSlides[11];
    const rareEnergy = originalSlides[12];
    const crowdExponent = originalSlides[13];
    const entropyVolume = originalSlides[14];

    replace(speciation, 'Speciation criterion', String.raw`
      <div class="eyebrow">05 · Speciation criterion</div>
      <h2>First locate the population direction that becomes visible above noise</h2>
      <div class="grid-2">
        <div class="card">
          <div class="formula">\[
            x_t=a_tx_0+b_t\epsilon,\qquad \epsilon\sim\mathcal N(0,I_d)
          \]</div>
          <div class="formula">\[
            C_t=a_t^2C_0+b_t^2I_d
          \]</div>
          <div class="symbols">
            <span class="symbol"><b>\(C_0\)</b> covariance of the clean population</span>
            <span class="symbol"><b>\(C_t\)</b> covariance after noising</span>
            <span class="symbol"><b>\(a_t,b_t\)</b> retained signal and added-noise scales</span>
          </div>
        </div>
        <div class="card">
          <p class="muted">Let \(\Lambda\) be the largest eigenvalue of \(C_0\). Along that direction:</p>
          <div class="formula">\[
            \operatorname{SNR}_{\max}(t):=\frac{a_t^2\Lambda}{b_t^2}
          \]</div>
          <div class="formula">\[
            \boxed{\operatorname{SNR}_{\max}(t_S)\asymp1}
          \]</div>
          <ul class="clean-list">
            <li><span class="rose">Before \(t_S\):</span> structured variance is smaller than noise.</li>
            <li><span class="gold">At \(t_S\):</span> the strongest population direction becomes marginally detectable.</li>
            <li><span class="green">After \(t_S\):</span> reverse trajectories can separate along that direction.</li>
          </ul>
        </div>
      </div>
      <div class="callout cool">This criterion says <strong>when a class-scale direction becomes visible</strong>. The next slide explains why visibility becomes a genuine symmetry-breaking transition.</div>
    `);

    replace(curvature, 'Curvature transition', String.raw`
      <div class="eyebrow">06 · From visibility to symmetry breaking</div>
      <h2>The same SNR threshold is where the central state loses stability</h2>
      <div class="grid-2">
        <div class="card">
          <p class="muted">Let \(v_1\) be the unit eigenvector satisfying \(C_0v_1=\Lambda v_1\), and let</p>
          <div class="formula">\[
            r:=v_1^\top x
          \]</div>
          <p class="muted">be the coordinate of a state along the strongest data direction. Near the mixed central state, the effective negative log-density has the Landau form</p>
          <div class="formula compact">\[
            \mathcal U_t(r)\approx
            \frac{\kappa_1(t)}{2b_t^2}r^2+\frac{\beta_t}{4}r^4,
            \qquad \beta_t>0.
          \]</div>
        </div>
        <div class="card">
          <div class="formula">\[
            \kappa_1(t):=1-\frac{a_t^2\Lambda}{b_t^2}
            =1-\operatorname{SNR}_{\max}(t)
          \]</div>
          <div class="phase-table">
            <div class="definition-box"><strong>\(\kappa_1>0\):</strong> \(r=0\) is stable; classes remain mixed.</div>
            <div class="definition-box"><strong>\(\kappa_1=0\):</strong> the central curvature vanishes at \(t_S\).</div>
            <div class="definition-box"><strong>\(\kappa_1<0\):</strong> \(r=0\) is unstable; the quartic term stabilizes two nonzero branches.</div>
          </div>
        </div>
      </div>
      <div class="callout">The spectral criterion and the phase transition are the same statement: <strong>unit SNR means zero curvature in the top covariance direction</strong>.</div>
      <button class="chip dr-jump" type="button" data-appendix="A1">See the full cumulant expansion →</button>
    `);

    replace(gaussianModel, 'Two-class Gaussian model', String.raw`
      <div class="eyebrow">07 · Give the unstable direction semantic meaning</div>
      <h2>In a two-class Gaussian model, the top covariance direction is exactly the class direction</h2>
      <div class="grid-2">
        <div class="card">
          <div class="formula compact">\[
            c\in\{-1,+1\},\qquad
            x_0\mid c\sim\mathcal N(cm,\sigma^2I_d),\qquad
            \Pr(c=\pm1)=\tfrac12.
          \]</div>
          <div class="symbols">
            <span class="symbol"><b>\(c\)</b> class label</span>
            <span class="symbol"><b>\(\pm m\)</b> two class centers</span>
            <span class="symbol"><b>\(\sigma^2\)</b> within-class variance per coordinate</span>
          </div>
          <div class="formula compact">\[
            \widetilde\mu:=\frac{\|m\|}{\sqrt d},
            \qquad \text{distance between centers}=2\sqrt d\,\widetilde\mu.
          \]</div>
        </div>
        <div class="card">
          <p class="muted">The mixture is centered, and its covariance is</p>
          <div class="formula">\[
            C_0=\sigma^2I_d+mm^\top.
          \]</div>
          <div class="formula compact">\[
            v_1=\frac{m}{\|m\|},
            \qquad
            \Lambda=\sigma^2+\|m\|^2
            =\sigma^2+d\widetilde\mu^2.
          \]</div>
          <div class="callout cool">The abstract unstable coordinate \(r=v_1^\top x\) is now simply the projection onto the line separating the two semantic classes.</div>
        </div>
      </div>
    `);

    replace(noisedClasses, 'Noised class distributions', String.raw`
      <div class="eyebrow">08 · Propagate each class through the forward process</div>
      <h2>Noising shrinks the class centers and adds to the within-class variance</h2>
      <div class="grid-2">
        <div class="card">
          <div class="formula">\[
            x_t=a_tx_0+b_t\epsilon
          \]</div>
          <p class="muted">Conditioning on the class label \(c\), Gaussianity is preserved:</p>
          <div class="formula">\[
            x_t\mid c\sim\mathcal N(ca_tm,\Gamma_tI_d)
          \]</div>
          <div class="formula">\[
            \boxed{\Gamma_t:=a_t^2\sigma^2+b_t^2}
          \]</div>
          <p class="equation-note">\(\Gamma_t\) is the total variance within either noised class: retained original variance plus diffusion noise.</p>
        </div>
        <div class="card">
          <h3>Geometry at time \(t\)</h3>
          <div class="formula compact">\[
            \text{distance between noised means}=2a_t\|m\|,
            \qquad
            \text{class standard deviation}=\sqrt{\Gamma_t}.
          \]</div>
          <div class="formula">\[
            \text{class separation ratio}
            =\frac{a_t\|m\|}{\sqrt{\Gamma_t}}.
          \]</div>
          <ul class="clean-list">
            <li>Small ratio: the two noised classes strongly overlap.</li>
            <li>Large ratio: a state carries reliable information about its class.</li>
          </ul>
          <div class="callout cool">For high-dimensional separated classes, this ratio grows at the same scale as the top-direction SNR from the previous slides.</div>
        </div>
      </div>
    `);

    replace(posteriorDecision, 'Posterior class decision', String.raw`
      <div class="eyebrow">09 · Convert geometry into a class decision</div>
      <h2>The class posterior is controlled by one log-likelihood coordinate</h2>
      <div class="grid-2">
        <div class="card">
          <p class="muted">Bayes' rule for the two noised Gaussians gives</p>
          <div class="formula compact">\[
            \log\frac{\Pr(c=+1\mid x)}{\Pr(c=-1\mid x)}
            =2u_t(x),
            \qquad
            \boxed{u_t(x):=\frac{a_tm^\top x}{\Gamma_t}}.
          \]</div>
          <div class="symbols">
            <span class="symbol"><b>\(u_t(x)\)</b> half of the posterior class log-odds</span>
            <span class="symbol"><b>\(m^\top x\)</b> signed projection onto the class direction</span>
          </div>
          <div class="formula compact">\[
            \Pr(c=+1\mid x)=\frac{1+\tanh u_t(x)}{2},
            \qquad
            \mathbb E[c\mid x]=\tanh u_t(x).
          \]</div>
        </div>
        <div class="card">
          <h3>What changes at speciation?</h3>
          <ul class="clean-list">
            <li><span class="rose">Before \(t_S\):</span> class distributions overlap; \(|u_t|\) is not large and the posterior remains soft.</li>
            <li><span class="gold">Near \(t_S\):</span> curvature is lost along \(m\), so fluctuations begin choosing a sign.</li>
            <li><span class="green">After \(t_S\):</span> a trajectory follows one branch, and the deterministic contribution to \(u_t\) dominates its fluctuations.</li>
          </ul>
          <div class="formula compact">\[
            x\approx ca_tm+\text{noise}
            \quad\Longrightarrow\quad
            u_t(x)\approx c\frac{a_t^2\|m\|^2}{\Gamma_t}+\text{fluctuation}.
          \]</div>
        </div>
      </div>
      <div class="callout">This is the missing bridge: <strong>the SNR/curvature transition makes the posterior class logit acquire a stable sign</strong>.</div>
    `);

    const scoreSaturation = makeSlide('Class score saturation', String.raw`
      <div class="eyebrow">10 · From class posterior to the reverse vector field</div>
      <h2>Once the posterior saturates, the mixture score becomes the score of one whole class</h2>
      <div class="grid-2">
        <div class="card">
          <p class="muted">The exact score of the noised two-class mixture is</p>
          <div class="formula compact">\[
            s(x,t):=\nabla_x\log p_t(x)
            =-\frac{x}{\Gamma_t}
            +\frac{a_tm}{\Gamma_t}\,\mathbb E[c\mid x].
          \]</div>
          <p class="muted">Using \(\mathbb E[c\mid x]=\tanh u_t(x)\):</p>
          <div class="formula">\[
            s(x,t)=-\frac{x}{\Gamma_t}
            +\frac{a_tm}{\Gamma_t}\tanh u_t(x).
          \]</div>
        </div>
        <div class="card">
          <div class="formula compact">\[
            |u_t(x)|\gg1
            \quad\Longrightarrow\quad
            \tanh u_t(x)\to c\in\{-1,+1\}.
          \]</div>
          <div class="formula">\[
            s(x,t)\to s_c(x,t)
            :=-\frac{x-ca_tm}{\Gamma_t}.
          \]</div>
          <p class="muted">\(s_c\) is exactly the score of the entire noised class distribution</p>
          <div class="formula compact">\[
            \mathcal N(ca_tm,\Gamma_tI_d).
          \]</div>
        </div>
      </div>
      <div class="callout cool"><strong>Regime II:</strong> the trajectory has selected a population class, but no individual training sample has yet dominated. This is the paper's class-level generalization regime.</div>
      <button class="chip dr-jump" type="button" data-appendix="A2">Optional: derive the one-dimensional order-parameter dynamics →</button>
    `);

    const cloningDefinition = makeSlide('Cloning observable', String.raw`
      <div class="eyebrow">11 · Operational definition of speciation</div>
      <h2>Clone one intermediate state and test whether its class decision is already irreversible</h2>
      <div class="grid-2">
        <div class="card">
          <div class="proof-chain">
            <div class="proof-step"><span class="step-no">1</span><p>Run one reverse trajectory until time \(t\), producing a shared state \(X_t\).</p></div>
            <div class="proof-step"><span class="step-no">2</span><p>Copy \(X_t\) into two clones and continue them with independent future Brownian noise.</p></div>
            <div class="proof-step"><span class="step-no">3</span><p>Compare the semantic classes of their endpoints \(X_0^{(1)}\) and \(X_0^{(2)}\).</p></div>
          </div>
        </div>
        <div class="card">
          <div class="formula compact">\[
            \boxed{\phi(t):=
            \Pr\!\left(c(X_0^{(1)})=c(X_0^{(2)})\mid X_t^{(1)}=X_t^{(2)}\right)}
          \]</div>
          <div class="symbols">
            <span class="symbol"><b>\(\phi(t)\)</b> same-class probability of two independent continuations</span>
            <span class="symbol"><b>\(c(X_0)\)</b> final semantic class</span>
          </div>
          <div class="formula compact">\[
            \phi(t)\approx\tfrac12\quad\text{before class commitment},
            \qquad
            \phi(t)\approx1\quad\text{after class commitment}.
          \]</div>
        </div>
      </div>
      <div class="callout">The transition of \(\phi(t)\) supplies an observable definition of \(t_S\), independent of inspecting the internal score field.</div>
      <button class="chip dr-jump" type="button" data-appendix="A3">Derive the cloning formula from Bayes' rule →</button>
    `);

    const gaussianEvidence = makeSlide('Gaussian-mixture evidence', String.raw`
      <div class="eyebrow">12 · Analytic model evidence</div>
      <h2>The two-Gaussian model exhibits the predicted crossover from unresolved to committed classes</h2>
      <div class="grid-2 wide-left">
        <div class="figure-card"><img src="assets/figures/dynamical-regimes/speciation-gm.png" alt="Gaussian-mixture speciation results" /></div>
        <div class="card">
          <h3>How to read the figure</h3>
          <ul class="clean-list">
            <li>The relevant observable is the same-class clone probability \(\phi(t)\).</li>
            <li>At high noise, independent continuations can choose opposite mixture components, giving the two-class baseline \(\phi\approx1/2\).</li>
            <li>After the predicted speciation scale, both continuations inherit the same posterior-logit sign, so \(\phi\to1\).</li>
            <li>The transition sharpens with dimension, consistent with a high-dimensional symmetry-breaking crossover.</li>
          </ul>
          <div class="callout cool">This figure tests the chain already derived: <strong>SNR threshold → stable posterior sign → same-class cloned futures</strong>.</div>
        </div>
      </div>
      <p class="paper-caption">Figure: Biroli et al., analytic and numerical speciation behavior in the two-Gaussian model.</p>
    `);

    const realEvidence = makeSlide('Real-data speciation evidence', String.raw`
      <div class="eyebrow">13 · Real-data validation</div>
      <h2>The same clone transition aligns across image datasets using the spectral prediction for \(t_S\)</h2>
      <div class="grid-2 wide-left">
        <div class="figure-card"><img src="assets/figures/dynamical-regimes/speciation-real.png" alt="Clone-based speciation curves across realistic datasets" /></div>
        <div class="card">
          <h3>Quantities in the plot</h3>
          <ul class="clean-list">
            <li><strong>Vertical axis:</strong> \(\phi(t)\), estimated by classifying the endpoints of cloned reverse trajectories.</li>
            <li><strong>Horizontal axis:</strong> reverse-process time/noise level rescaled by the predicted spectral transition \(t_S\).</li>
            <li><strong>Classifier \(c\):</strong> a dataset-specific image classifier replaces the sign rule used in the Gaussian model.</li>
          </ul>
          <div class="formula compact">\[
            t_S\text{ is predicted from }\frac{a_{t_S}^2\Lambda}{b_{t_S}^2}\asymp1,
            \quad\text{then used without fitting the clone curves.}
          \]</div>
          <div class="callout cool">The alignment supports the claim that speciation is controlled primarily by the leading population covariance scale.</div>
        </div>
      </div>
      <p class="paper-caption">Figure: Biroli et al., clone-based speciation measurements on MNIST, CIFAR, ImageNet, and LSUN.</p>
    `);

    insertAfter(posteriorDecision, scoreSaturation);
    insertAfter(scoreSaturation, cloningDefinition);
    insertAfter(cloningDefinition, gaussianEvidence);
    insertAfter(gaussianEvidence, realEvidence);

    replace(collapse, 'Collapse competition', String.raw`
      <div class="eyebrow">14 · From class commitment to sample commitment</div>
      <h2>Collapse is a competition between one guaranteed-close sample and an exponentially large crowd</h2>
      <div class="grid-2 wide-right">
        <div class="figure-card"><img src="assets/figures/dynamical-regimes/collapse-gm.png" alt="Gaussian mixture collapse" /></div>
        <div class="card">
          <div class="formula compact">\[
            x=a_ta_1+b_tz,\qquad z\sim\mathcal N(0,I_d)
          \]</div>
          <div class="formula compact">\[
            p_t^e(x)\propto Z_{\mathrm{self}}+Z_{\mathrm{crowd}}
          \]</div>
          <div class="formula compact">\[
            Z_{\mathrm{self}}=e^{-\|z\|^2/2}\asymp e^{-d/2},\qquad
            Z_{\mathrm{crowd}}=\sum_{\mu\ne1}
            e^{-\|x-a_ta_\mu\|^2/(2b_t^2)}.
          \]</div>
          <ul class="clean-list">
            <li>\(a_1\) is guaranteed to be unusually close because \(x\) was generated by noising it.</li>
            <li>A typical other sample is far away and contributes almost nothing.</li>
            <li>But there are \(n=e^{\rho d}\) other samples, so rare unusually close members can matter.</li>
          </ul>
        </div>
      </div>
      <div class="callout">The key question is an <strong>extreme-value question</strong>: can the best rare energy band in the crowd beat the guaranteed self contribution?</div>
    `);

    replace(rareEnergy, 'Rare-energy mechanism', String.raw`
      <div class="eyebrow">15 · The central collapse insight</div>
      <h2>Memorization is controlled by rare low-energy neighbors—not by a typical neighbor</h2>
      <div class="grid-2">
        <div class="card">
          <div class="formula compact">\[
            \varepsilon_\mu(t):=\frac1d\frac{\|x-a_ta_\mu\|^2}{2b_t^2},
            \qquad
            \Pr(\varepsilon_\mu(t)\approx u)\asymp e^{-dI_t(u)}.
          \]</div>
          <div class="symbols">
            <span class="symbol"><b>\(\varepsilon_\mu\)</b> energy per dimension of sample \(\mu\)</span>
            <span class="symbol"><b>\(I_t(u)\)</b> large-deviation cost of seeing energy \(u\)</span>
            <span class="symbol"><b>\(\rho=\log n/d\)</b> log dataset size per dimension</span>
          </div>
        </div>
        <div class="card">
          <div class="formula compact">\[
            \#\{\mu:\varepsilon_\mu\approx u\}\asymp e^{d[\rho-I_t(u)]}
          \]</div>
          <div class="formula compact">\[
            \text{total weight from energy }u
            \asymp e^{d[\rho-I_t(u)-u]}.
          \]</div>
          <ul class="clean-list">
            <li>Lower energy gives exponentially larger density weight.</li>
            <li>But lower energy is exponentially rarer.</li>
            <li>The dominant band optimally trades rarity against likelihood weight.</li>
          </ul>
        </div>
      </div>
      <div class="callout cool"><strong>Rare-event mechanism:</strong> a near-neighbor can be exponentially rare and still dominate because its likelihood contribution is exponentially larger.</div>
      <button class="chip dr-jump" type="button" data-appendix="A4">See the full large-deviation optimization →</button>
    `);

    replace(crowdExponent, 'Crowd exponent and collapse time', String.raw`
      <div class="eyebrow">16 · Summarize the entire crowd</div>
      <h2>\(\psi_t\) is the per-dimension log density supplied by all non-self samples</h2>
      <div class="grid-2">
        <div class="card">
          <div class="formula compact">\[
            \psi_t:=\lim_{d\to\infty}\frac1d\log Z_{\mathrm{crowd}}
            =\sup_{u:I_t(u)\le\rho}\{\rho-I_t(u)-u\}.
          \]</div>
          <p class="muted">\(\psi_t\) is neither a probability nor an individual energy. It is the exponential rate of the crowd's total density contribution after optimizing over feasible energy bands.</p>
        </div>
        <div class="card">
          <div class="formula compact">\[
            \frac1d\log Z_{\mathrm{self}}\to-\frac12.
          \]</div>
          <div class="formula compact">\[
            \begin{cases}
            \psi_t>-\tfrac12,&\text{crowd dominates: no sample commitment},\\
            \psi_t<-\tfrac12,&\text{self dominates: collapse to }a_1.
            \end{cases}
          \]</div>
          <div class="formula">\[\boxed{\psi_{t_C}=-\frac12}\]</div>
        </div>
      </div>
      <div class="formula compact">\[
        \text{Gaussian mixture:}\qquad
        \frac{b_{t_C}^2}{a_{t_C}^2}=\frac{\sigma^2}{e^{2\rho}-1}.
      \]</div>
      <div class="callout cool">More data keeps the crowd competitive down to a lower noise-to-signal ratio, postponing collapse toward the data endpoint.</div>
      <button class="chip dr-jump" type="button" data-appendix="A5">Derive the Gaussian closed form →</button>
    `);

    replace(entropyVolume, 'Entropy-volume proof', String.raw`
      <div class="eyebrow">17 · The same transition in geometric language</div>
      <h2>Collapse begins when separated sample neighborhoods cannot cover the population typical set</h2>
      <div class="grid-2">
        <div class="card">
          <div class="formula compact">\[
            V_{\mathrm{pop}}(t)\asymp e^{dh_t},\qquad
            h_t:=-\frac1d\int p_t(x)\log p_t(x)\,dx.
          \]</div>
          <div class="formula compact">\[
            V_{\mathrm{sep}}(t)\asymp n\,e^{dh_G(t)}=e^{dh_t^{\mathrm{sep}}},
          \]</div>
          <div class="formula compact">\[
            h_t^{\mathrm{sep}}=\rho+\frac12[1+\log(2\pi b_t^2)].
          \]</div>
          <div class="symbols">
            <span class="symbol"><b>\(h_t\)</b> population entropy per dimension</span>
            <span class="symbol"><b>\(h_t^{\mathrm{sep}}\)</b> entropy of non-overlapping noised sample neighborhoods</span>
          </div>
        </div>
        <div class="card">
          <div class="formula">\[
            g_t:=h_t^{\mathrm{sep}}-h_t,
            \qquad g_{t_C}=0.
          \]</div>
          <ul class="clean-list">
            <li>\(g_t>0\): the noised empirical neighborhoods have enough aggregate volume to cover the population typical set.</li>
            <li>\(g_t<0\): they occupy an exponentially small fraction of population volume.</li>
            <li>The empirical density then decomposes into isolated sample basins.</li>
          </ul>
          <div class="callout cool">REM language: <strong>entropy versus energy</strong>. Volume language: <strong>coverage versus localization</strong>.</div>
          <button class="chip dr-jump" type="button" data-appendix="A6">See the experimental collapse diagnostics →</button>
        </div>
      </div>
    `);

    const a1 = findAppendix('A1');
    if (a1) {
      a1.dataset.title = 'A1 Landau derivation';
      a1.innerHTML = String.raw`
        <div class="eyebrow">A1 · Full cumulant expansion</div>
        <h2>How the quadratic curvature matrix arises</h2>
        <div class="formula tiny">\[
          p_t(x)=\frac{e^{-\|x\|^2/(2b_t^2)}}{(2\pi b_t^2)^{d/2}}
          \mathbb E_{x_0\sim p_0}
          \exp\!\left(\frac{a_t}{b_t^2}x^\top x_0-\frac{a_t^2}{2b_t^2}\|x_0\|^2\right).
        \]</div>
        <div class="grid-2">
          <div class="card">
            <h3>Second-order cumulant expansion</h3>
            <div class="formula tiny">\[
              \log p_t(x)=K_t+\frac{a_t}{b_t^2}\mu_0^\top x
              -\frac{1}{2b_t^2}x^\top\left(I_d-\frac{a_t^2}{b_t^2}C_0\right)x+O(a_t^3).
            \]</div>
            <p class="muted">\(K_t\) is independent of \(x\); \(\mu_0\) is the data mean. For centered data, \(\mu_0=0\).</p>
          </div>
          <div class="card">
            <h3>Project onto covariance eigenvectors</h3>
            <div class="formula tiny">\[
              C_0v_j=\lambda_jv_j
              \Longrightarrow
              v_j^\top M_tv_j=1-\frac{a_t^2\lambda_j}{b_t^2}.
            \]</div>
            <p class="muted">The top mode \(\lambda_1=\Lambda\) reaches zero first.</p>
          </div>
        </div>
        <button class="chip dr-jump" type="button" data-main-title="Curvature transition">← Return to curvature intuition</button>
      `;
      changed.push(a1);
    }

    const a2 = findAppendix('A2');
    if (a2) {
      a2.dataset.title = 'A2 Order-parameter dynamics';
      a2.innerHTML = String.raw`
        <div class="eyebrow">A2 · Optional one-dimensional dynamical reduction</div>
        <h2>Projecting the reverse process onto the class direction</h2>
        <div class="definition-box">This appendix introduces an additional symbol only for the detailed dynamical reduction; it is not needed in the main argument.</div>
        <div class="grid-2">
          <div class="card">
            <div class="formula tiny">\[
              q_t:=\frac{m^\top x_t}{\sqrt d}
            \]</div>
            <p class="muted">\(q_t\) is the normalized signed class projection: positive and negative values correspond to the two branches.</p>
            <div class="formula tiny">\[
              -dq_t=-\partial_qV_t(q_t)\,dt+d\eta_t.
            \]</div>
            <p class="muted">\(\eta_t\) is the one-dimensional noise obtained by projecting the reverse Brownian motion onto \(m\).</p>
          </div>
          <div class="card">
            <div class="formula tiny">\[
              V_t(q)\approx\frac12q^2-2\widetilde\mu^2
              \log\cosh\!\left(\frac{a_t\sqrt d}{\Gamma_t}q\right).
            \]</div>
            <ul class="clean-list">
              <li>Small control parameter: one stable branch near \(q=0\).</li>
              <li>At the transition: curvature at \(q=0\) vanishes.</li>
              <li>Afterward: two stable class-selective branches emerge.</li>
            </ul>
          </div>
        </div>
        <button class="chip dr-jump" type="button" data-main-title="Class score saturation">← Return to class-level generalization</button>
      `;
      changed.push(a2);
    }

    const a4 = findAppendix('A4');
    if (a4) {
      a4.dataset.title = 'A4 REM derivation';
      a4.innerHTML = String.raw`
        <div class="eyebrow">A4 · Random Energy Model derivation</div>
        <h2>From large deviations to the crowd exponent</h2>
        <div class="grid-2">
          <div class="card">
            <div class="formula tiny">\[
              \Pr(\varepsilon_\mu\in[u,u+du])\asymp e^{-dI_t(u)}du,
              \qquad n=e^{\rho d}.
            \]</div>
            <div class="formula tiny">\[
              N_t(u)\asymp e^{d[\rho-I_t(u)]}.
            \]</div>
            <p class="muted">Only energy bands with \(I_t(u)\le\rho\) are represented in an exponentially large dataset.</p>
          </div>
          <div class="card">
            <div class="formula tiny">\[
              Z_{\mathrm{crowd}}\asymp\int_{I_t(u)\le\rho}
              \exp\!\left(d[\rho-I_t(u)-u]\right)du.
            \]</div>
            <div class="formula tiny">\[
              \psi_t=\sup_{I_t(u)\le\rho}\{\rho-I_t(u)-u\}.
            \]</div>
            <p class="muted">A boundary optimizer corresponds to the lowest energies available in the finite dataset—the condensation/extreme-value regime.</p>
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
            <p class="muted">For the same-class crowd in the non-collapsed branch:</p>
            <div class="formula">\[
              \psi_t=\rho+\frac12\log\frac{b_t^2}{b_t^2+\sigma^2a_t^2}-\frac12.
            \]</div>
          </div>
          <div class="card">
            <p class="muted">Equating the crowd exponent to the self exponent \(-1/2\):</p>
            <div class="formula">\[
              \frac{b_{t_C}^2}{a_{t_C}^2}=\frac{\sigma^2}{e^{2\rho}-1}.
            \]</div>
            <p class="muted">Substituting a particular schedule then gives a time \(t_C\).</p>
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
              <li><strong>Top left — \(\phi_C(t)\):</strong> probability that two clones end at the same training sample.</li>
              <li><strong>Top right — \(\widehat t_C\):</strong> last reverse time when nearest-neighbor identity changes.</li>
              <li><strong>Bottom — \(g_t^e=h_t^{\mathrm{sep}}-h_t^e\):</strong> empirical coverage gap.</li>
              <li><strong>Vertical dashed lines:</strong> nearest-neighbor locking estimate.</li>
            </ul>
            <div class="callout cool">Trajectory locking, nearest-neighbor commitment, and entropy coverage failure occur at the same scale.</div>
            <button class="chip dr-jump" type="button" data-main-title="Entropy-volume proof">← Return to volume proof</button>
          </div>
        </div>
      `;
      changed.push(a6);
    }

    const style = document.createElement('style');
    style.dataset.dynamicRegimesRevision = 'v3';
    style.textContent = `
      .slide .dr-jump { cursor:pointer; margin-top:8px; color:var(--cyan); }
      .slide .dr-jump:hover { border-color:rgba(99,227,217,.55); color:var(--ink); }
      .phase-table { display:grid; gap:11px; }
      .slide[data-title="Posterior class decision"] .formula,
      .slide[data-title="Class score saturation"] .formula,
      .slide[data-title="Rare-energy mechanism"] .formula,
      .slide[data-title="Crowd exponent and collapse time"] .formula,
      .slide[data-title="Entropy-volume proof"] .formula { font-size:clamp(18px,1.38vw,27px); }
      .slide[data-title="Gaussian-mixture evidence"] .figure-card img,
      .slide[data-title="Real-data speciation evidence"] .figure-card img { max-height:52vh; }
      .slide[data-title="Cloning observable"] .proof-step p { font-size:clamp(17px,1.2vw,23px); }
    `;
    document.head.appendChild(style);

    const allSlides = [...document.querySelectorAll('.slide')];
    allSlides.forEach((slide, index) => {
      const eyebrow = slide.querySelector('.eyebrow');
      if (!eyebrow || !/^\d+\s*·/.test(eyebrow.textContent.trim())) return;
      eyebrow.textContent = eyebrow.textContent.replace(/^\d+\s*·/, `${String(index).padStart(2, '0')} ·`);
    });

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

    try {
      (0, eval)(`slides = [...document.querySelectorAll('.slide')]`);
    } catch (refreshError) {
      console.warn('Could not refresh the base slide array:', refreshError);
    }

    const refreshedSlides = [...document.querySelectorAll('.slide')];
    const activeSlide = document.querySelector('.slide.active') || refreshedSlides[0];
    const activeIndex = Math.max(0, refreshedSlides.indexOf(activeSlide));
    if (typeof showSlide === 'function') showSlide(activeIndex);

    const findTarget = (button) => {
      if (button.dataset.appendix) return findAppendix(button.dataset.appendix);
      if (button.dataset.mainTitle) return refreshedSlides.find((slide) => slide.dataset.title === button.dataset.mainTitle);
      return null;
    };

    document.querySelectorAll('.dr-jump').forEach((button) => {
      button.addEventListener('click', () => {
        const target = findTarget(button);
        if (!target) return;
        const current = document.querySelector('.slide.active');
        const from = Math.max(0, refreshedSlides.indexOf(current));
        const to = refreshedSlides.indexOf(target);
        if (to < 0) return;
        const forward = (to - from + refreshedSlides.length) % refreshedSlides.length;
        const backward = (from - to + refreshedSlides.length) % refreshedSlides.length;
        const navButton = forward <= backward ? document.getElementById('next') : document.getElementById('prev');
        for (let step = 0; step < Math.min(forward, backward); step += 1) navButton?.click();
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
