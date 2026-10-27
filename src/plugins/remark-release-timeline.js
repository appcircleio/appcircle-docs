const path = require("path");

// Groups docs/release-notes.md into one <ReleaseEntry> per version heading
// (`## 3.34.0 - ...`) so the page can render as a version timeline.
// A heading that contains <PatchBadge/> becomes a patch entry.
const RELEASE_NOTES_PATH = path.join("docs", "release-notes.md");
const VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)/;

// Releases older than this keep the classic layout
const TIMELINE_START_VERSION = [3, 34, 0];

const getVersion = (node) => {
  if (node.type !== "heading" || node.depth !== 2) return null;
  if (node.children[0]?.type !== "text") return null;
  const match = node.children[0].value.match(VERSION_PATTERN);
  return match ? match.slice(1).map(Number) : null;
};

const isOnTimeline = (version) => {
  for (let i = 0; i < version.length; i++) {
    if (version[i] !== TIMELINE_START_VERSION[i]) {
      return version[i] > TIMELINE_START_VERSION[i];
    }
  }
  return true;
};

const isPatchHeading = (node) =>
  node.children.some(
    (child) => child.type === "mdxJsxTextElement" && child.name === "PatchBadge"
  );

const createEntry = (patch) => ({
  type: "mdxJsxFlowElement",
  name: "ReleaseEntry",
  attributes: patch ? [{ type: "mdxJsxAttribute", name: "patch", value: null }] : [],
  children: [],
  data: {
    _mdxExplicitJsx: true,
  },
});

const remarkReleaseTimeline = () => {
  return (tree, file) => {
    if (!file.path?.endsWith(RELEASE_NOTES_PATH)) return;

    const children = [];
    let entry = null;

    for (const node of tree.children) {
      // Imports and exports (including the generated TOC export) must stay at the root
      if (node.type === "mdxjsEsm") {
        children.push(node);
        continue;
      }
      const version = getVersion(node);
      if (version) {
        entry = isOnTimeline(version) ? createEntry(isPatchHeading(node)) : null;
        if (entry) children.push(entry);
      }
      if (entry) {
        entry.children.push(node);
      } else {
        children.push(node);
      }
    }

    tree.children = children;
  };
};

module.exports = remarkReleaseTimeline;
