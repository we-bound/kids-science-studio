import assert from "node:assert/strict";
import test from "node:test";
import { episodeSchema, sceneSchema } from "../src/schema";
import { sceneRegistry } from "../src/scenes/registry";
import { cueFrame, episodeFrames, sceneDurationSec, sceneMidpoints, transitionFrames } from "../src/timeline";
import { theme } from "../src/theme";

const baseScene = {
  id: "test-scene",
  type: "OrbitScene" as const,
  narration: "La Luna gira alrededor de Tierra",
  props: { label: "La Luna gira" },
};

test("duration priority and cue word timing", () => {
  const estimated = episodeSchema.parse({ title: "Test", language: "es", scenes: [baseScene] });
  assert.equal(sceneDurationSec(estimated.scenes[0]), 3);

  const explicit = episodeSchema.parse({ title: "Test", language: "es", scenes: [{ ...baseScene, durationSec: 5 }] });
  assert.equal(sceneDurationSec(explicit.scenes[0]), 5);

  const timed = episodeSchema.parse({ title: "Test", language: "es", scenes: [{
    ...baseScene,
    durationSec: 5,
    timing: { startSec: 10, endSec: 14, words: [{ word: "gira", start: 11, end: 11.4 }] },
    cues: [{ atWord: "gira", action: "startOrbit" }],
  }] });
  assert.equal(sceneDurationSec(timed.scenes[0]), 4);
  assert.equal(cueFrame(timed.scenes[0], "startOrbit"), 30);
});

test("transition overlap is reflected in composition length and still midpoints", () => {
  const episode = episodeSchema.parse({ title: "Test", language: "es", scenes: [
    { ...baseScene, id: "one", durationSec: 5 },
    { ...baseScene, id: "two", durationSec: 5 },
  ] });
  assert.equal(transitionFrames(episode), theme.timing.transitionFrames);
  assert.equal(episodeFrames(episode), 300 - theme.timing.transitionFrames);
  assert.deepEqual(sceneMidpoints(episode).map((point) => point.frame), [75, 213]);
});

test("catalog is closed and scene fields reject invalid cues", () => {
  assert.deepEqual(Object.keys(sceneRegistry).sort(), sceneSchema.options.map((option) => option.shape.type.value).sort());
  const unknown = episodeSchema.safeParse({ title: "Test", language: "es", scenes: [{ ...baseScene, type: "MadeUpScene" }] });
  assert.equal(unknown.success, false);

  const wrongCue = episodeSchema.safeParse({ title: "Test", language: "es", scenes: [{ ...baseScene, cues: [{ atWord: "gira", action: "showTide" }] }] });
  assert.equal(wrongCue.success, false);
  if (!wrongCue.success) assert.deepEqual(wrongCue.error.issues[0].path, ["scenes", 0, "cues", 0, "action"]);

  const unknownProp = episodeSchema.safeParse({ title: "Test", language: "es", scenes: [{ ...baseScene, props: { label: "La Luna gira", customAnimation: "unsafe" } }] });
  assert.equal(unknownProp.success, false);

  const repeatedCue = episodeSchema.safeParse({ title: "Test", language: "es", scenes: [{ ...baseScene, cues: [
    { atWord: "gira", action: "startOrbit" },
    { atWord: "Luna", action: "startOrbit" },
  ] }] });
  assert.equal(repeatedCue.success, false);
});

test("top-down orbit keeps Moon separate from Earth and tides", () => {
  assert.ok(theme.size.orbitRadius > theme.size.earth / 2 + theme.size.moon / 2);
  assert.ok(theme.size.orbitRadius - theme.size.moon / 2 >= theme.size.tideMajor / 2 + theme.size.tideLobe / 6);
});
