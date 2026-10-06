import React from "react";
import MDXComponents from "@theme-original/MDXComponents";

import Screenshot from "@site/src/components/Screenshot";
import NarrowImage from "@site/src/components/NarrowImage";
import ContentRef from "@site/src/components/ContentRef";
import ExternalUrlRef from "@site/src/components/ExternalUrlRef";
import * as ModuleBadges from "@site/src/components/Badge/ModuleBadges";
import PatchRelease, { FixTag, ImprovementTag } from "@site/src/components/PatchRelease/PatchRelease";

export default {
  ExternalUrlRef,
  Screenshot,
  NarrowImage,
  ContentRef,
  PatchRelease,
  FixTag,
  ImprovementTag,
  ...MDXComponents,
  ...ModuleBadges,
};
