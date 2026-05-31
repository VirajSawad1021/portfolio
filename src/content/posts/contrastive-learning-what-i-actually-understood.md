---
title: "Contrastive Learning: What I Actually Understood After Building With It"
description: "A practical, intuitive exploration of SimCLR, MoCo, BYOL, Barlow Twins, and CLIP, detailing what actually matters when building representation learning systems."
date: "2026-05-31"
tags: ["deep-learning", "representation-learning"]
readTime: "15 min read"
---

<p class="lede">Most explanations of contrastive learning hand you the math and move on. This is me writing down what actually clicked, after months of using it in a multimodal retrieval system, hitting walls, and slowly understanding why the method works the way it does.</p>

<p>I came to contrastive learning sideways. I was building a cross-modal retrieval system, images and text living in the same embedding space, queryable against each other, and kept running into this fundamental question: how do you get two completely different types of data to "mean" the same thing in vector space?</p>

<p>The answer kept pointing back to contrastive learning. So I went deeper, read the original papers, implemented pieces of it, and somewhere in that process, things clicked in a way they usually don't from just reading papers. This post is that understanding, written down.</p>

<hr>

<h2>The core idea</h2>

<p>Here is the simplest version: you have an encoder. You want it to map semantically similar things close together and semantically different things far apart in embedding space. Contrastive learning is the training recipe that does this, without labels.</p>

<p>The trick is inventing your own supervision signal. Take an image. Apply two different random augmentations to it: crop, flip, color jitter. Now you have two views of the same image. They look different but they're semantically the same thing. Those are your positives. Everything else in the batch is a negative.</p>

<div class="fig">
  <img src="/images/triplet-loss.png" alt="Triplet loss positive and negative representation mapping" style="display:block; margin: 0 auto; max-width:85%; border-radius:6px; border: 1px solid rgba(28,27,27,0.05); background:#ffffff; padding:10px;" />
  <p class="fig-cap">Fig 1. Triplet mapping concept: pulling the anchor close to positive views while pushing the negative samples beyond a configured margin (Schroff et al., 2015).</p>
</div>

<p>Train the encoder to score positive pairs higher than negative pairs, and eventually it learns to embed images by their semantic content rather than low-level pixel statistics. The augmentations define what "same" means, and by extension, what the encoder should be invariant to.</p>

<div class="personal"><strong>What clicked for me:</strong> the augmentation set is a design choice, not a given. Crop + color jitter says: "I don't care about exact position or color, I care about shape and content." If you're working with medical images, you probably shouldn't augment with aggressive color jitter, that information matters. The augmentation set encodes your inductive bias about what should be invariant.</div>

<hr>

<h2>The loss function: InfoNCE</h2>

<p>The loss that made all of this work at scale is InfoNCE. For a batch of N samples, each with one positive:</p>

<div class="eq">
$$\mathcal{L} = -\frac{1}{N} \sum_{i=1}^{N} \log \frac{\exp(\text{sim}(z_i, z_i^+) / \tau)}{\sum_{j=1}^{N} \exp(\text{sim}(z_i, z_j) / \tau)}$$
</div>

<p>where <code>z_i = f(x_i)</code> are the projected embeddings and <code>\tau</code> is a temperature hyperparameter.</p>

<p>The easiest way to read this: it's an N-way classification problem. For each anchor, identify which sample in the batch is the positive. The denominator sums over all N samples, so the model gets penalized whenever a negative ends up with high similarity to the anchor.</p>

<div class="personal"><strong>Key Takeaway:</strong> Temperature operates as a confidence-scaling hyperparameter. A low temperature concentrates the gradient on the hardest negatives, forcing the encoder to learn fine-grained boundaries. A high temperature flattens the gradients, spreading attention across all negatives.</div>

<p>Temperature is the hyperparameter I spent the most time understanding. The standard framing ("low temperature = more confident, high temperature = more random") is technically true but doesn't tell you what it's actually doing. What it's doing is controlling which negatives contribute gradient. Low temperature makes the model hyperfocus on whoever is closest to the anchor and getting it wrong. High temperature distributes attention across all negatives.</p>

<hr>

<h2>SimCLR: the clean baseline</h2>

<p>SimCLR (Chen et al., 2020) is the method that made contrastive learning the dominant paradigm for self-supervised image representation. Its contribution wasn't a new loss function; it was an unusually systematic study of what actually matters in the pipeline.</p>



<p>The projection head detail is one of those things that seems like a footnote but isn't. When I first read the paper I glossed over it. Then I understood what it means: the projection head appears to throw away information that helps the contrastive objective but hurts downstream tasks. By training with it and then removing it, you get an encoder that builds richer representations than it would if the loss hit it directly. It's doing a kind of information routing that wasn't designed in, it just emerged.</p>

<p>The other finding that stuck with me: augmentation composition matters far more than architecture. Crop + color jitter is not just "a good combination"; it's almost necessary. Cropping forces the model to recognize parts as belonging to the whole. Color jitter removes an easy shortcut (matching by histogram) and forces it to learn shape. Remove either one and representations degrade measurably.</p>

<div class="personal"><strong>The practical wall I hit:</strong> SimCLR needs large batches (4096 to 8192) because all negatives come from within the batch. Small batches mean mostly easy negatives, which provide near-zero gradient once the model has learned basic structure. If you are not on TPU-scale hardware, this is a real problem. MoCo solves it.</div>

<hr>

<h2>MoCo: decoupling negatives from batch size</h2>

<div class="fig">
  <img src="/images/MoCo.png" alt="MoCo momentum encoder and FIFO queue pipeline" style="display:block; margin: 0 auto; max-width:90%; border-radius:6px; border: 1px solid rgba(28,27,27,0.05); background:#ffffff; padding:10px;" />
  <p class="fig-cap">Fig 2. MoCo workflow: query representations are checked against a dynamic FIFO queue of recent keys encoded by a slowly drifting momentum encoder (He et al., 2019).</p>
</div>


<p>Momentum Contrast (He et al., 2020) kept the contrastive objective but changed where negatives come from. Instead of the current batch, MoCo maintains a queue of encoded keys from recent batches. This lets you have 65k negatives regardless of batch size.</p>



<p>The EMA update is what makes the queue coherent. If the key encoder updated at the same speed as the query encoder, old keys in the queue would be stale, encoded by a meaningfully different model. Slow EMA keeps the key encoder drifting gradually, so the queue stays approximately from the same distribution. MoCo v2 added SimCLR's projection head and stronger augmentation, closing most of the gap with SimCLR while using a fraction of the batch size.</p>

<hr>

<h2>BYOL: no negatives needed</h2>

<p>BYOL (Grill et al., 2020) is the one that really surprised me when I first understood it. It removed negatives entirely. By any intuition about what contrastive learning is doing, this should not work.</p>

<div class="fig">
  <img src="/images/BYOL.png" alt="BYOL online and target twin network architecture" style="display:block; margin: 0 auto; max-width:95%; border-radius:6px; border: 1px solid rgba(28,27,27,0.05); background:#ffffff; padding:10px;" />
  <p class="fig-cap">Fig 3. BYOL architecture: the online network uses a predictor to match target features, while target network weights are slowly updated as an EMA of the online parameters (Grill et al., 2020).</p>
</div>

<p>The loss is the negative cosine similarity between the online network's prediction of one view and the target network's projection of another view:</p>

<div class="eq">
$$\mathcal{L} = 2 - 2 \cdot \frac{\langle q_\theta(z_\theta), z'_\xi \rangle}{\|q_\theta(z_\theta)\| \cdot \|z'_\xi\|}$$
</div>

<p>No negatives. The loss is minimized when the prediction matches the target projection.</p>

<p>The obvious failure mode is collapse: if the encoder outputs the same constant vector for every input, the loss is zero. But BYOL doesn't collapse. The honest answer to why is: we don't fully know. The EMA target creates a consistent but always slightly ahead bootstrap signal. The predictor creates an asymmetry that makes the trivial solution unstable. Batch normalization in the projector implicitly carries batch-level statistics that act as a soft negative signal.</p>

<p>Whether these explanations are complete is still debated. What's not debated is that BYOL works; it matches SimCLR on ImageNet linear evaluation while being far less sensitive to batch size.</p>

<div class="personal"><strong>What this made me realize:</strong> when I was building multimodal retrieval, I kept framing it as "I need a contrastive loss." But BYOL showed me the actual requirement is weaker: I need some signal that prevents the encoder from collapsing to a constant. Contrastive negatives are one way to provide that signal. They're not the only way.</div>

<hr>

<h2>Barlow Twins: a different objective entirely</h2>

<div class="fig">
  <img src="/images/barlow-twins.png" alt="Barlow Twins cross-correlation matrix objective" style="display:block; margin: 0 auto; max-width:90%; border-radius:6px; border: 1px solid rgba(28,27,27,0.05); background:#ffffff; padding:10px;" />
  <p class="fig-cap">Fig 4. Barlow Twins: feeds twin augmented views to optimize a cross-correlation matrix toward the identity matrix, reducing representational redundancy (Zbontar et al., 2021).</p>
</div>

<p>Barlow Twins (Zbontar et al., 2021) takes a different angle. Instead of pulling positives together and pushing negatives apart, the objective is to make the cross-correlation matrix of the embeddings close to the identity matrix:</p>

<div class="eq">
$$\mathcal{L}_{BT} = \underbrace{\sum_i (1 - C_{ii})^2}_{\text{invariance term}} + \lambda \underbrace{\sum_i \sum_{j \neq i} C_{ij}^2}_{\text{redundancy reduction term}}$$
<br/>
$$\text{where } C_{ij} = \frac{\sum_b z^A_{b,i} \cdot z^B_{b,j}}{\sqrt{\sum_b (z^A_{b,i})^2} \sqrt{\sum_b (z^B_{b,j})^2}}$$
</div>

<p><strong>Invariance term:</strong> diagonal elements should be 1. Each dimension of the embedding should be maximally correlated between the two views of the same image.</p>
<p><strong>Redundancy reduction term:</strong> off-diagonal elements should be 0. Different embedding dimensions should be decorrelated from each other, meaning each dimension captures independent information.</p>



<p>What I find elegant about this is the redundancy reduction term. Each embedding dimension is forced to carry non-overlapping information. This is essentially a whitening objective: the representation is maximally informative because no two dimensions are encoding the same thing. It works with small batches, scales well with embedding dimension, and requires no momentum encoder.</p>

<hr>

<h2>CLIP: across modalities</h2>

<p>CLIP (Radford et al., 2021) is what started my real interest in this area, because it's where contrastive learning became the foundation for something I was actually building.</p>

<div class="fig">
  <img src="/images/CLIP.png" alt="CLIP multimodal joint pretraining matrix" style="display:block; margin: 0 auto; max-width:95%; border-radius:6px; border: 1px solid rgba(28,27,27,0.05); background:#ffffff; padding:10px;" />
  <p class="fig-cap">Fig 5. CLIP joint pretraining: optimizes a symmetric cross-entropy loss over a dense similarity matrix to align matching text-image pairs in a shared space (Radford et al., 2021).</p>
</div>

<p>What CLIP showed me about contrastive learning: the framework is not specific to vision. The only requirement is two views that share semantic content. Images and their captions share semantic content. Audio and transcripts. Code and documentation. The framework generalizes to any modality pair where you have co-occurring signal.</p>

<p>The training objective is symmetric InfoNCE over a batch of <code>N</code> (image, text) pairs. Each image should be closer to its paired text than to the other <code>N-1</code> texts, and vice versa. It optimizes a joint loss that aligns matching pairs in a shared space:</p>

<div class="eq">
$$\mathcal{L}_{CLIP} = \frac{1}{2}(\mathcal{L}_{i \to t} + \mathcal{L}_{t \to i})$$
</div>

<p>When I moved to SigLIP for my retrieval system, the core idea was the same as CLIP but with sigmoid loss instead of softmax. The practical difference: SigLIP doesn't require the full batch sum in the denominator, so it's less sensitive to batch composition and scales better to large batches with many negatives. For retrieval tasks where you want fine-grained matching, it tends to produce better-calibrated similarity scores.</p>

<div class="personal"><strong>Current state of the work:</strong> using SigLIP embeddings as the image-text backbone, ChromaDB for the vector store, and Gemini Embedding 2 for text-only queries. The hardest part has been not the retrieval itself but deciding what the augmentation policy should be for domain-specific images. The default ImageNet augmentations are too aggressive for anything where fine-grained visual details matter, aggressive cropping destroys information you actually want to preserve.</div>

<hr>

<h2>Hard negative mining</h2>

<p>The quality of negatives determines the quality of your representations. Easy negatives (images that are obviously different from the anchor) provide near-zero gradient once the model has learned basic structure. The real learning signal comes from <strong>hard negatives</strong>: images that are superficially similar but semantically different.</p>

<p>There are a few main ways to get them:</p>

<ul>
  <li><strong>In-batch hard negatives:</strong> Within a batch, upweight the negatives with the highest similarity to the anchor rather than treating all negatives equally. Simple to implement, but heavily limited by batch diversity.</li>
  <li><strong>Memory bank / queue:</strong> Store encoded representations from previous iterations. MoCo's queue is the classic implementation here, allowing you to select hard negatives from a pool much larger than any single batch.</li>
  <li><strong>Synthetic hard negatives:</strong> Mix embeddings in latent space to create representations that sit directly near the decision boundary. This is more aggressive, but carries a real risk of creating <strong>false negatives</strong>: synthetic samples that happen to actually be semantically similar to the anchor.</li>
</ul>

<div class="personal"><strong>My experience with the false negative problem:</strong> This is the central practical issue with hard mining. In self-supervised training, you don't have labels, so you cannot know whether a hard negative is actually semantically distinct or just a positive sample in disguise. If you mine too aggressively, you end up pulling apart semantically related samples, which degrades representations. This is a big reason why methods like BYOL and Barlow Twins (which avoid explicit negatives entirely) can sometimes outperform traditional contrastive methods on downstream transfer tasks.</div>

<hr>

<h2>How these methods compare</h2>

<table>
  <thead>
    <tr>
      <th>Method</th>
      <th>Negatives?</th>
      <th>Momentum enc.?</th>
      <th>Key constraint</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>SimCLR</td><td>In-batch</td><td>No</td><td>Large batch (4k+)</td></tr>
    <tr><td>MoCo v2</td><td>Queue</td><td>Yes</td><td>Queue coherence via EMA</td></tr>
    <tr><td>BYOL</td><td>None</td><td>Yes (target net)</td><td>Predictor + EMA to prevent collapse</td></tr>
    <tr><td>Barlow Twins</td><td>None</td><td>No</td><td>Large embedding dim helps</td></tr>
    <tr><td>CLIP / SigLIP</td><td>Cross-modal in-batch</td><td>No</td><td>Needs matched pairs at scale</td></tr>
  </tbody>
</table>

<hr>

<h2>What the representations actually learn</h2>

<p>The standard benchmark is linear evaluation: freeze the encoder, train a linear classifier on top, report accuracy. It tests how linearly separable the embedding space is. On ImageNet with ResNet-50, the best contrastive methods reach 70–75% top-1, vs ~76% for fully supervised training. The gap has closed a lot since 2020.</p>

<p>The more interesting question is transfer. Contrastive representations consistently outperform supervised representations when you move to tasks that differ from the pretraining domain, such as medical imaging, remote sensing, and scientific data. The contrastive objective forces the encoder to build more general structure because there's no fixed label set to overfit to. It has to learn what's common across augmented views of the same image, which tends to be semantic content rather than dataset-specific statistics.</p>

<p>One thing I've noticed in practice: contrastive embeddings have more internal structure than supervised ones. Related classes cluster together in ways that supervised training doesn't enforce. When I'm doing cross-modal retrieval and something goes wrong, it's almost never that the embedding space is random; it's usually that the boundary between two similar-looking categories is too soft. That's a property of the training distribution, not a failure of the method.</p>

<hr>

<h2>Practical notes</h2>

<p>A few things worth knowing if you are actually running these methods and not just reading about them:</p>

<p>Projection head nonlinearity matters more than dimension. The ReLU in the hidden layer of the projection MLP makes a measurable difference. Output dimension anywhere from 128 to 2048 works similarly. Don't spend much time tuning the dimension.</p>

<p>Training needs to run longer than supervised training to converge. 100-epoch evaluations consistently underestimate final performance. Plan for 200+ epochs minimum on ImageNet-scale data.</p>

<p>If you're working outside natural images (medical imaging, satellite data, scientific microscopy), treat the augmentation policy as a first-class design decision, not a default setting. What should be invariant in your domain is not what was invariant in ImageNet pretraining. Aggressive color jitter and random cropping can destroy exactly the information you're trying to preserve.</p>

<p>For multimodal settings specifically: the quality of your matched pairs matters as much as the training recipe. Noisy correspondences (captions that don't describe the image, misaligned audio/video) corrupt the positive signal more than any hyperparameter choice will compensate for.</p>

<hr>

<h2>Where things are now</h2>

<p>The core methods are mature at this point. SimCLR, MoCo, BYOL, Barlow Twins, CLIP, and SigLIP are stable, well-understood industry baselines. But the self-supervised landscape has expanded into two major directions that shift away from traditional contrastive learning:</p>

<h3>1. Joint Embedding Predictive Architectures (JEPA)</h3>
<p>Yann LeCun's team at Meta has pushed heavily for JEPA (such as I-JEPA and V-JEPA) as a way to avoid both the false-negative problem of contrastive learning and the pixel-reconstruction overhead of Masked Autoencoders (MAE). Instead of pulling augmented views together, JEPA works by masking regions of an input (like an image or video) and training a predictor to predict the <em>abstract representation</em> (embedding) of the missing region from the context region. It learns a world model in latent space, stripping out pixel-level noise to focus entirely on high-level semantic structures.</p>

<h3>2. The shift to generative, autoregressive pretraining</h3>
<p>In multimodal systems, we've seen a massive transition. While contrastive dual-encoders (like CLIP and SigLIP) remain the standard for heavy retrieval and embedding search, generative multimodal foundation models (like LLaMA-Vision, Chameleon, and Gemini) have largely taken over reasoning and generative tasks. Instead of pre-aligning distinct image and text embedding spaces via contrastive losses, these architectures project visual patches directly into LLM token spaces, pretraining end-to-end on unified autoregressive next-token prediction over interleaved image-text streams.</p>

<p>The contrastive framework turns out to be an incredibly successful chapter of self-supervised learning. It taught us how to structure vector spaces without labels, how to define inductive bias through data augmentations, and how to prevent representation collapse. Whether it remains the dominant pretraining paradigm or serves as the retrieval-specialized backbone for generative giants, the core lessons of contrastive representation learning remain the foundation of how we build modern AI systems.</p>