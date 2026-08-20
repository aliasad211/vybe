// Story rings and fallback avatars are tinted per person so a row of them reads
// as distinct faces. The tone has to be stable across renders and pages, so it
// is derived from the user id rather than the list position.
const STORY_TONES = ["story-blue", "story-sand", "story-lilac", "story-green", "story-coral"];

const hash = (value) => {
  const text = String(value || "");
  let total = 0;
  for (let i = 0; i < text.length; i++) total = (total + text.charCodeAt(i)) % 997;
  return total;
};

export const storyTone = (id) => STORY_TONES[hash(id) % STORY_TONES.length];
