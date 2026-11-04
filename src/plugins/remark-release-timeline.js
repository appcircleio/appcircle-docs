const path = require("path");

// Groups docs/release-notes.md into one <ReleaseEntry> per version heading
// (`## 3.34.0 - ...`) so the page can render as a version timeline.
// A heading that contains <PatchBadge/> becomes a patch entry.
const RELEASE_NOTES_PATH = path.join("docs", "release-notes.md");
const VERSION_PATTERN = /^\d+\.\d+\.\d+/;

const isVersionHeading = (node) =>
  node.type === "heading" &&
  node.depth === 2 &&
  node.children[0]?.type === "text" &&
  VERSION_PATTERN.test(node.children[0].value);

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
      if (isVersionHeading(node)) {
        entry = createEntry(isPatchHeading(node));
        children.push(entry);
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
