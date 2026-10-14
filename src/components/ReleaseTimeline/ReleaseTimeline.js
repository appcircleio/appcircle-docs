import React from "react";
import styles from "./ReleaseTimeline.module.css";

// One release on the release notes timeline. The remark-release-timeline
// plugin wraps each `## <version>` section in this component automatically.
export default function ReleaseEntry({ patch, children }) {
  return (
    <section className={`${styles.entry} ${patch ? styles.patch : styles.release}`}>
      {children}
    </section>
  );
}

// Add to a version heading to mark it as a patch release:
// ## 3.34.1 - 2026-09-18 <PatchBadge/>
export const PatchBadge = () => (
  <span className={styles.patchBadge}>Patch</span>
);

export const FixTag = () => (
  <span className={`${styles.tag} ${styles.fix}`}>Fix</span>
);

export const ImprovementTag = () => (
  <span className={`${styles.tag} ${styles.improvement}`}>Improvement</span>
);
