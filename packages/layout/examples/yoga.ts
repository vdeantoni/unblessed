import { Screen } from "../../node/dist/index.js";
import { LayoutManager } from "../dist/index.js";

const screen = new Screen();
const manager = new LayoutManager({ screen, debug: true });

const container = manager.createNode("container", {
  flexDirection: "row",
  gap: 2,
  padding: 1,
});

// Create children with flexbox properties
const left = manager.createNode(
  "left",
  { width: 20, height: 5 },
  { content: "Left", border: { type: "line" } },
);

const spacer = manager.createNode("spacer", { flexGrow: 1 });

const right = manager.createNode(
  "right",
  { width: 20, height: 5 },
  { content: "Right", border: { type: "line" } },
);

// Build tree
manager.appendChild(container, left);
manager.appendChild(container, spacer);
manager.appendChild(container, right);

// Calculate layout and render
manager.performLayout(container);

screen.key(["q", "C-c"], () => {
  process.exit(0);
});
