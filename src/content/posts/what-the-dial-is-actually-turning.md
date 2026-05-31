---
title: "What the Dial Is Actually Turning"
description: "A mathematical deep-dive on temperature in LLMs, logits, softmax, and Hinton's concept of dark knowledge, revealing why creativity is not just randomness."
date: "2026-03-30"
tags: ["machine-learning", "statistics"]
readTime: "5 min read"
---

I was explaining temperature to someone a while back. High temperature means more random outputs, low temperature means more deterministic. The person nodded. I nodded. And then I had this specific feeling of having said something true and explained nothing.

Because what does "more random" actually mean here? Random how? The model isn't rolling dice. Something is happening mathematically and I had been describing the outcome without having any real picture of the mechanism.

So. What is actually happening.

When a language model produces an output, the last layer gives you a vector of raw scores, one for each token in the vocabulary. These are called **logits**. Before you can interpret them as probabilities you run them through a **softmax** function, which exponentiates each score and normalizes everything to sum to one. What you get is a probability distribution over the entire vocabulary.

Temperature is applied before the softmax. You divide every logit by a scalar, the temperature value, and then run softmax on the result. That's it. That's the whole operation.

When temperature is 1, nothing changes. When it's less than 1, you're dividing by a small number, which amplifies the differences between logits. The high scores get relatively higher, the low scores get relatively lower. The resulting distribution is sharper, more peaked. When temperature is greater than 1, you're dividing by a large number, which compresses the differences. The distribution flattens. Scores that were very different become more similar.

This is what "more random" and "more deterministic" actually mean. Not randomness in the sense of noise, but in the sense of how much probability mass is concentrated at the top prediction versus spread across the rest.

And here is where it gets interesting.

---

In 2015, Geoffrey Hinton published a paper on **knowledge distillation**. The goal was to transfer knowledge from a large, expensive model into a smaller, cheaper one. The technique was straightforward in principle: instead of training the small model on hard labels, you train it on the probability distributions produced by the large model.

The reason this works, Hinton argued, is that those distributions contain far more information than hard labels do. If a large model says a handwritten digit is "90% a 7, 9% a 1, 1% a 4," the 9% one and 1% four are not noise. They're telling you something real about how the model understands the relationships between those digits. Sevens and ones look alike in certain ways. Sevens and fours share a particular stroke. The model has learned this, and the information is sitting quietly in the soft distribution.

Hinton called this **dark knowledge**. The knowledge that doesn't live in the argmax, in the single predicted class, but in the full shape of the distribution. The stuff that gets thrown away the moment you convert probabilities to hard predictions.

To extract it cleanly in distillation, he used high temperature. Higher temperature softens the distribution, makes the small probabilities more visible, amplifies the signal that would otherwise be drowned out by the dominant prediction.

---

Go back to temperature at inference time and this reframes the whole thing.

When you raise the temperature on an LLM, you're not just adding randomness to make outputs more creative. You're doing the same thing Hinton did. You're softening the distribution, revealing the relationships the model has learned between tokens, surfacing the dark knowledge.

The model knows more than it says at temperature 1. At low temperature it's essentially shouting its top prediction and whispering everything else. At high temperature those whispers get louder. And those whispers are the model's understanding of how tokens relate to each other, which continuations are plausible, which ideas are adjacent, which words carry similar weight in similar contexts.

Creativity, in this framing, isn't randomness. It's the model reaching into the part of what it knows that it usually keeps quiet.

---

The uncomfortable part is what this implies about how we evaluate models.

Almost every benchmark works on **hard predictions**. You give the model a question, you take the argmax, you check if it's right. The soft distribution, the dark knowledge, is never looked at. We're measuring the tip of what the model knows and calling it a measure of the whole thing.

This isn't a minor quibble. If a model produces the right answer with 51% probability and the wrong answer with 49%, it scores the same on a benchmark as a model that produces the right answer with 99% probability. We treat them as equivalent. They're not.

And beyond calibration, the dark knowledge contains structural information about what the model has actually learned, what concepts it considers related, what it's uncertain about and in what direction. Most of that is invisible in standard evaluation. We have almost no systematic picture of what lives in there.

It's a strange situation. We've built systems whose knowledge is mostly dark to us, and we've built our entire understanding of what they know on the sliver they're forced to declare at temperature zero.

The dial is not just about randomness. It's about how much of what the model actually knows you're willing to let into the room.
