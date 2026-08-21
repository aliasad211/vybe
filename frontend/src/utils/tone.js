// Story rings and fallback avatars are tinted per person so a row of them reads
// as distinct faces. The tone has to be stable across renders and pages, so it
// is derived from the user id rather than the list position.
const STORY_TONES = ["story-blue", "story-sand", "story-lilac", "story-green", "story-coral"];
const AVATAR_TONES = ["avatar-blue", "avatar-lilac", "avatar-peach", "avatar-cream", "avatar-green", "avatar-coral"];

const hash = (value) => {
  const text = String(value || "");
  let total = 0;
  for (let i = 0; i < text.length; i++) total = (total + text.charCodeAt(i)) % 997;
  return total;
};

export const storyTone = (id) => STORY_TONES[hash(id) % STORY_TONES.length];
export const avatarTone = (id) => AVATAR_TONES[hash(id) % AVATAR_TONES.length];

//shown behind a missing profile picture, so the tinted circle still says who it is
export const initials = (name) =>
  String(name || "?")
    .trim()
    .split(/\s+/)
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
