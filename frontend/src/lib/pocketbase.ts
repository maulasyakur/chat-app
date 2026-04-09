import PocketBase from "pocketbase";
import type { TypedPocketBase } from "./pocketbase-types";

const PB_URL = import.meta.env.VITE_POCKETBASE_URL || "http://127.0.0.1:8090";
export const pb = new PocketBase(PB_URL) as TypedPocketBase;
