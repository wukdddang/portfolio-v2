export * from "./types";
import type { Study } from "./types";
import { sar } from "./sar";
import { embedded } from "./embedded";

export const studies: Study[] = [sar, embedded];
