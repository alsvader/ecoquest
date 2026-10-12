---
title: EcoQuest: put your phone away and let an open model check your discoveries
published: true
tags: hacktoberfest, ai, opensource, showdev
cover_image: https://raw.githubusercontent.com/alsvader/ecoquest/main/docs/hacktoberfest/cover-1000x420.png
---

<!-- markdownlint-disable MD013 MD034 -->

_This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)_

<!-- TODO: add the challenge's unique tag from the challenge page if it differs from the tags above. -->

![EcoQuest landing page](https://raw.githubusercontent.com/alsvader/ecoquest/main/docs/landing/screenshots/desktop-hero-1440@2x.png)

## What I Built

Most "outdoor" apps ask you to look at your screen more. **EcoQuest** does the opposite. You pick an expedition, put your phone in your pocket, walk, and take a photo only when you find something. An open-weight AI model checks whether the photo matches the mission, and at the end you get a short record of what you discovered.

The pilot expedition, **«Descubre el Edén»** (_Discover Eden_), takes about 20 minutes in Parque Tomás Garrido Canabal in Villahermosa, Tabasco, Mexico. It has three missions:

- **Find a large leaf.**
- **Discover a flower and record its colors.**
- **Find a tree with visible roots.**

The design goal is to ask as little attention as possible. The camera opens only when you find something, there are no accounts, no location tracking, and each mission is a few taps.

It is for people who already walk, garden, or spend time in parks and want a light reason to notice what is around them.

## Demo

{% youtube c11c0NfN7Dg %}

A 76-second walkthrough of EcoQuest. Every app screen in it is a real screenshot of the app running locally, and the classifier output is the real `/classify` response from SigLIP2 for three test photos. It is a motion-design video, not footage from the park.

> Test photos in the video, from Wikimedia Commons: _Zen of a Raindrop – Colocasia Leaf Beauty_ by Mandu joshi (CC0), _Barbados Heliconia psittacorum Parrot Heliconia 1209_ by ImagePerson ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)), and _Rubber fig (Ficus elastica) aerial roots_ by David E Mead (CC0). The music and sound effects are original, synthesized for the video.

Here is the real app, running locally against the real inference service. Nothing is mocked.

![The three steps of a mission: welcome, mission, result](https://raw.githubusercontent.com/alsvader/ecoquest/main/docs/hacktoberfest/app-flujo.png)

1. **Start the expedition.** The welcome screen shows the safety notice before anything else. The phone is meant to stay in the pocket.
2. **Pick a mission.** Each mission gives one clear instruction, like "look at it carefully before you take the camera out".
3. **Get the result.** I sent a real flower photo through the pipeline. SigLIP2 scored it against the flower prompts and the distractors, and the app marked the mission as complete. The result is labeled as a visual estimate, not a verification, and the bar shows the mission's threshold instead of a percentage.

> Photo credit: _Bougainvillea flower closeup_ by Kailash Easterling, [CC BY 4.0, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bougainvillea_flower_closeup.jpg). Used as a test image for the screenshot.

**What is still missing:** the outdoor test in Villahermosa has not happened yet, so there is no video of someone walking the park. I did not want to fake one. The app runs locally with Docker:

```bash
git clone https://github.com/alsvader/ecoquest.git
cd ecoquest
docker compose up --build -d
```

Then open `http://localhost:3000`. The first build takes about 8 minutes because it downloads ~1.5 GB of model weights.

<!-- TODO (optional): once the outdoor test happens, add a deployed link or a video of it. The video demo above covers the "deployed link or video demo" requirement once VIDEO_ID is filled in. -->

## Code

Repository: <https://github.com/alsvader/ecoquest> (MIT license)

{% github https://github.com/alsvader/ecoquest %}

Three main parts:

- `inference/`: a FastAPI service that runs SigLIP2 and exposes `POST /classify`.
- `web/`: a Next.js + TypeScript PWA with the mobile app and the landing page.
- `docs/`: design system, landing source, deployment notes with measured resource use, and the screenshots in this post.

## How I Built It

![Architecture: phone PWA, inference API, SigLIP2](https://raw.githubusercontent.com/alsvader/ecoquest/main/docs/hacktoberfest/arquitectura.png)

**The model.** The core is [`google/siglip2-base-patch16-256`](https://huggingface.co/google/siglip2-base-patch16-256), an open-weight vision-language model under **Apache-2.0**. It runs zero-shot: each mission has a few text prompts (for example, "a close-up photo of a blooming flower with petals"), a set of distractor prompts covers things that do not match (people, buildings, the sky, smooth palm trunks, thin leaves on a branch), and a softmax across the categories produces the similarity scores.

**The inference service.** A small FastAPI app loads the model with Hugging Face Transformers on CPU, scores the image, and maps the score to `confirmed`, `inconclusive`, or `unconfirmed` using per-mission thresholds in a JSON file. Images are processed in memory and are never written to disk or logged.

**The web app.** The phone downscales the photo before upload. Progress, photos, and the session log live in IndexedDB on the device, and the user can export or delete everything from the app.

**Deployment.** Both services ship as Docker images. The inference image runs as a non-root user, with a health check and the weights baked in. I measured it on an Apple Silicon Mac with Docker Desktop: it gets killed at 640 MB, runs comfortably at 2 GB, and takes about 0.5 s per photo with 2 vCPUs.

**Honesty about the model.** The scores are a similarity measure, not a calibrated probability, and the model does not identify species. The interface shows no percentages. If the AI fails, the user can mark a mission by hand, and that mark is labeled **«Unverified»** everywhere, including the badge.

**What is not finished.** The thresholds are provisional. They were tuned on 42 Wikimedia Commons photos, not on photos from the park or taken with a phone, so I have not yet measured how the model does on real park photos. Deployment has only been tested locally on arm64, not on x86_64 or a hosting provider.

## Why Does Open Innovation Matter?

Here the model is the product. Without it, there is no way to check whether a photo matches a mission, so an open model is not a decoration.

- **Inspectable and reproducible.** The prompts, thresholds, and calibration photos are in the repo, and an attribution list lets anyone re-download the benchmark photos. The benchmark reproduced 41/42 on the calibration set and 28/29 on the validation set.
- **Changeable without asking permission.** If the prompts or thresholds are wrong for Tabasco's plants, anyone can change them and rerun the benchmark. A closed API could change its behavior without notice, and its prompts and training data would be invisible.
- **Under the project's control.** Inference runs on a server the project controls, under a clear license. A closed API would tie the app to a vendor's pricing, terms, and availability, and make it harder to say where the photos go.
- **Honest about its limits.** An open model lets you measure its errors. The project documents its false positives, its uncalibrated thresholds, and the fact that it has not been tested outdoors. Those are the parts most worth examining, and an open setup makes that possible.

## My Agent Session

<!-- Optional. Save the session with DevRelay and embed it with the agent_session tag (see the challenge page), or link to it. Not included yet. -->

## Prize Categories

- **Overall winner**

<!-- TODO: add the partner categories this entry applies to, copied from the challenge page. I could not confirm the Week 1 partner category list from the public rules page. -->

<!-- Team Submissions: Please pick one member to publish the submission and credit teammates by listing their DEV usernames directly in the body of the post. -->

<!-- Thanks for participating! -->
