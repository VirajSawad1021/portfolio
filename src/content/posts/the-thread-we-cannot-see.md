---
title: "The Thread We Cannot See"
description: "A reflection on Hume's skepticism, Judea Pearl's ladder of causation, and why causal reasoning is machine learning's last and hardest ceiling."
date: "2026-02-17"
tags: ["philosophy", "machine-learning"]
readTime: "6 min read"
---

There is something quietly unsettling about the word "because."

We use it dozens of times a day without much thought. The glass broke because it fell. He left because he was tired. The model failed because it overfit. It carries this weight of explanation, of certainty, of a direct line drawn between one thing and another. But if you sit with the word long enough, you start to wonder what exactly is being claimed.

David Hume asked this in the 18th century and nobody has quite recovered from it. His question was simple: when you say X caused Y, what are you actually pointing at? What is the causal connection itself, the thing that makes one event produce another?

Because if you look closely at any causal claim, what you actually observe is this: X happened, and then Y happened. That's it. The connection, the invisible thread between the two, is never directly in front of you. You infer it. You conclude it. You feel it. But you do not see it.

Hume called this **constant conjunction**. We watch one billiard ball strike another, we see the second ball move, and we call it causation. But we've only seen sequence. The "causing" part is something we add, a story we tell over the top of what's actually there.

This seems like a small philosophical quibble until you sit with it. Then it starts to unravel things.

---

The problem with causation goes deeper than just epistemology. It's not merely that we can't be certain about causal claims. It's that we don't even agree on what causation actually is.

One influential view is the **counterfactual account**. To say X caused Y is really to say: *if X had not happened, Y would not have happened.* It's a definition built on an imagined alternate world. Had I not dropped the glass, it would not have broken. This is clean and intuitive in simple cases, and it breaks almost immediately in complicated ones. If two people simultaneously and independently push the same boulder off the same cliff, you can't say either one caused it to fall by the counterfactual standard, because the boulder would have fallen anyway. Neither of them caused it, by this logic. Both of them did. The logic buckles under its own weight.

Another view insists on **mechanisms**. Causation isn't just about correlation or counterfactual dependence, it requires a physical process, a chain of events connecting cause to effect. This is more satisfying to scientists, and it handles some of the cases the counterfactual theory drops. But it shifts the problem rather than solving it, because now you have to explain what a mechanism is, and that turns out to be its own long conversation.

What philosophers call **causal pluralism** is the quiet suspicion that we might be chasing a single unified account that doesn't exist. Maybe causation means something different in physics than it does in biology, something different again in history or social science. Maybe the word is doing different conceptual work in different domains and we keep tripping over ourselves by pretending it's one coherent thing.

This is where it gets genuinely interesting. Because right around the time philosophy started making peace with that uncertainty, we built something that has the same problem encoded into it at a much larger scale.

---

Modern machine learning is, at its foundation, a very sophisticated tool for finding patterns in data. This is not a criticism, it's just what it is. A model trained on images learns to associate certain pixel arrangements with certain labels. A language model learns to associate sequences of tokens with other sequences of tokens. The associations are extraordinarily fine-grained and often useful. But they are associations. The model has no representation of what is causing what. It knows that these things tend to go together. It does not know why.

Judea Pearl, one of the most consequential figures in statistics and AI of the last few decades, laid this out in a framework he called the **ladder of causation**:

1. **Association (rung 1):** seeing that X and Y tend to occur together. This is what most ML does.
2. **Intervention (rung 2):** being able to answer what happens if we do X, not just what happens when X occurs.
3. **Counterfactuals (rung 3):** reasoning about what would have happened if something had been different.

The gap between rungs matters more than it might seem. A model can tell you that people who carry lighters are more likely to develop lung cancer. It cannot tell you whether banning lighters would reduce cancer rates. That requires causal reasoning. Without it, you have a system that knows correlations inside the training distribution and comes apart the moment the world changes, or the moment you try to use it to actually make a decision.

There is a famous example from healthcare. A pneumonia risk model learned that asthmatic patients had lower mortality rates than average. The correlation was real. The causal story was backwards. Asthmatic patients got more aggressive care, so they survived more. The model had learned a shadow cast by a mechanism it could not see.

---

What Hume noticed about human cognition, that we infer causation rather than observe it, turns out to be a precise description of the ceiling we've hit in current AI. We built systems on statistical association and called it intelligence. It's only when you press on the edges that the problem becomes obvious.

The deeper irony is that humans, despite Hume's skepticism, do reason causally in practice. We build mental models of the world that include not just patterns but mechanisms. We imagine counterfactuals constantly. We intervene, observe the results, and update our understanding. We are doing something that runs along all three rungs of Pearl's ladder, more or less all the time, without thinking about it.

Consider what that actually means. Every causal claim you've ever made, every "because," every explanation you've offered for anything, has rested on an inference, not an observation. The thread was always constructed, not found. And yet it works. Civilization, science, medicine, engineering, all of it built on top of a kind of reasoning that, if you follow Hume far enough down, has no ground beneath it.

There is something almost vertiginous about that, and something strangely freeing too.

Because if causation is partly a construct of the mind, a useful fiction we impose on the chaos of sequence and coincidence, then what we're really talking about when we talk about causal reasoning is a capacity for a particular kind of **imagination**. The ability to picture a world slightly different from this one, to ask what would have happened if, to trace the mechanism forward and backward in time, to hold the model of a system in mind and reason about how it behaves under pressure.

This is what Pearl's ladder is really pointing at. Association is passive. You observe. Intervention is active. You do, and you watch what changes. Counterfactuals are something else entirely. They require you to reason about a world that doesn't exist. That's not a statistical operation. That's closer to storytelling, or to empathy, or to the kind of model-building that philosophers call understanding.

Current AI is very good at the first rung. It is beginning, slowly and partially, to climb the second. The third is still largely a human territory, not because the math is intractable, but because it requires something that looks a lot less like pattern recognition and a lot more like imagination.

Which brings you back to Hume, and to the word "because," and to the strange fact that the thing we've been trying to formalize and automate for decades might be, at its core, a creative act. We don't discover causal structure in the data. We propose it. We test it. We revise it. We tell a story about the world and check whether the world agrees.

That's not a comfortable foundation for knowledge. But it might be the only one we have. And it turns out, it might be enough.
