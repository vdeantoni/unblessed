/**
 * index.ts - Animation system exports
 */

export {
  startTreeAnimations,
  stopTreeAnimations,
} from "./animation-integration.js";
export { hasAnimations, startAnimations, stopAnimations } from "./lifecycle.js";
export {
  borderAnimations,
  getBorderGenerator,
  getTextAnimationConfig,
  getTransitionConfig,
  textAnimationDefaults,
  transitionDefaults,
} from "./presets.js";
export type {
  AnimationConfigs,
  BorderAnimationConfig,
  BorderAnimationType,
  TextAnimationConfig,
  TextAnimationType,
  TransitionConfig,
  TransitionType,
} from "./types.js";
