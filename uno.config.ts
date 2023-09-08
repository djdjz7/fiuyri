import transformerDirectives from "@unocss/transformer-directives";
import { defineConfig } from "unocss";
import { presetAttributify, presetUno } from "unocss";

export default defineConfig({
    presets: [
        presetUno(),
        presetAttributify(),
    ],
    transformers: [
        transformerDirectives(),
    ]
})