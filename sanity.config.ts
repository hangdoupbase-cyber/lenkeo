"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { projectId, dataset } from "./src/sanity/env";
import { guide } from "./src/sanity/schemas/guide";
import { venuePhoto } from "./src/sanity/schemas/venuePhoto";

export default defineConfig({
  name: "default",
  title: "Lên Kèo",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: [guide, venuePhoto] },
});
