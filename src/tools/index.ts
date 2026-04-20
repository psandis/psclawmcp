import type { ToolDef } from "./types.js";

import { tools as dietclawTools } from "./dietclaw.js";
import { tools as driftclawTools } from "./driftclaw.js";
import { tools as dustclawTools } from "./dustclaw.js";
import { tools as feedclawTools } from "./feedclaw.js";
import { tools as wirewatchTools } from "./wirewatch.js";

export const allTools: ToolDef[] = [
  ...feedclawTools,
  ...dustclawTools,
  ...driftclawTools,
  ...dietclawTools,
  ...wirewatchTools,
];
