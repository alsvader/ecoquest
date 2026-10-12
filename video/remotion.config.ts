import { Config } from "@remotion/cli/config";

// JPEG con calidad alta: los iconos pixel y los bordes de 4 px se ven nítidos sin el costo de PNG.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
