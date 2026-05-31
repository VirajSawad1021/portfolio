---
title: "Understanding, or Something Like It"
description: "A reflection on Searle's Chinese Room argument, the slippery nature of human comprehension, and whether large language models are truly just syntax without semantics."
date: "2026-03-10"
tags: ["philosophy", "machine-learning"]
readTime: "5 min read"
---

There is a particular kind of embarrassment that comes from realizing, mid-conversation, that you have been nodding along to something you did not actually understand. You heard the words. You tracked the syntax. You even had the right facial expressions. But somewhere between the sound entering your ears and the meaning that was supposed to form, nothing happened. You were processing. You were not understanding.

That gap, small and slightly humiliating as it is, turns out to be one of the hardest problems in philosophy of mind.

---

John Searle introduced a thought experiment in 1980 that has refused to go away. Imagine you are locked in a room. Through a slot in the door, someone passes you pieces of paper with symbols on them. You don't recognize the symbols. You don't know what language they're in. But you have a very detailed rulebook that tells you: *if you see this sequence of symbols, write back this other sequence of symbols.* So you follow the rules, you write back responses, and you pass them back through the slot.

From the outside, your responses are indistinguishable from those of a fluent speaker. Whoever is passing you notes concludes that you understand the language. But you don't. You never did. You were just following rules.

Searle's point was this: **syntax is not semantics**. You can manipulate symbols perfectly without any of those symbols meaning anything to you. And if that's true for a person in a room with a rulebook, why would it be any different for a computer running a program? A computer, Searle argued, is just a very fast, very complicated version of the person in the room. It processes symbols. It produces outputs. But it doesn't understand.

This argument landed hard in 1980, and it still does. It's uncomfortable because it's simple. You can't really dismiss it without feeling like you're being slightly dishonest.

---

But people have tried.

The most common counter is called the **systems reply**. It says: *sure, the person in the room doesn't understand Chinese. But the system as a whole, the person plus the rulebook plus the room plus the process, does.* Understanding isn't located in any single part. It's distributed across the whole thing.

Searle found this unconvincing. He modified the thought experiment: imagine the person memorizes the entire rulebook and internalizes the process. Now they walk around outside the room, carrying all the rules in their head, having conversations in Chinese they don't understand. The system and the person are now the same thing. Do they understand?

Most people's intuition says no. But that intuition starts to feel slippery when you push on it.

The **robot reply** goes further. It says the Chinese Room is missing something crucial: *embodiment*. A system that doesn't just process symbols but actually perceives the world, acts in it, gets feedback, and learns from that feedback might genuinely understand in a way that a rulebook can't capture. Understanding, on this view, requires a body, or at least some grounded connection between symbols and the world they're supposed to refer to.

This is more interesting. It doesn't dismiss Searle's point but redirects it. The problem isn't computation. The problem is that the room is sealed off from the world.

Neither reply fully resolves things. Both of them push the problem somewhere else rather than solving it.

---

Now consider a large language model.

A language model processes text. At a very high level, it takes a sequence of tokens, runs them through an enormous number of learned transformations, and produces the next token. It does this very well, well enough that the outputs are often indistinguishable from what a thoughtful person might write. But the mechanism underneath is, at some level, a very sophisticated version of the person in the room. Pattern recognition over a vast space of symbols.

The question is whether that's the whole story.

* **The case that it isn't:** language models trained on enough text develop internal representations that seem to capture something about the structure of the world, not just the structure of text. They can reason about spatial relationships they've never been explicitly taught. They generalize across domains in ways that suggest something more than surface pattern matching. Whether that constitutes understanding depends on what you think understanding is, which is exactly the problem.
* **The case that it is:** a language model has no body, no perception, no continuous experience, no feedback loop between its outputs and the world. It has read about pain but never felt it. It has read about seeing a sunset but has no visual cortex. It can produce the words associated with grief without anything that could plausibly be called grief. The symbols, however rich and interconnected they are internally, don't bottom out in anything.

Both cases feel partially right. That should make you suspicious of both.

---

Here is the part of this that gets missed in most discussions.

When we say a person understands something, what exactly are we pointing at? There is a temptation to think there is some additional thing beyond the processing, some inner light that turns on when comprehension occurs. But it's not obvious that such a thing exists, or that we could identify it if it did.

Think about understanding a proof. You follow each step. You verify each implication. At what point does understanding happen? Is it the moment you can reproduce it? The moment you can see why each step was necessary? The moment you can extend it to new cases? The moment it feels obvious? These are all different things, and we use the same word for all of them.

Or think about understanding a person. You might know someone for years and feel suddenly, in one conversation, that you finally understand them. Was your processing of them different that day? Probably not in any systematic way. Something shifted. But what?

The honest answer is that we don't have a clean account of what understanding is in humans. We have intuitions, and we have the word, and we use it as if it picks out something definite. But the moment you try to specify exactly what that thing is, it starts to dissolve.

Searle's argument is powerful because it shows that computation alone isn't sufficient for understanding. But it doesn't tell us what is sufficient. And that's the part nobody has answered.

---

So when someone asks whether LLMs understand, the question carries a hidden assumption: *that we know what understanding is, and we're checking whether this system has it.*

Maybe the more honest framing is: we have a concept called understanding that we apply loosely and inconsistently even to other humans, and we're not sure whether it applies to a system that does something recognizably similar in some ways and completely different in others.

That's not a satisfying answer. It won't end the argument. But it's closer to the truth than either side of the debate usually admits.

The person in Searle's room, following rules they don't understand, producing responses that look like understanding, might be the most accurate metaphor we have. Not for AI. For all of us.
