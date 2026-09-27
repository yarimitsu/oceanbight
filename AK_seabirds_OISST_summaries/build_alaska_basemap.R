#!/usr/bin/env Rscript

# Build the self-contained colony-navigation map from Natural Earth 1:50m
# land polygons. Usage:
#   Rscript build_alaska_basemap.R path/to/ne_50m_land.shp

suppressPackageStartupMessages(library(sf))

args <- commandArgs(trailingOnly = TRUE)
if (length(args) != 1L) {
  stop("Provide the path to ne_50m_land.shp", call. = FALSE)
}

source_path <- normalizePath(args[[1]], mustWork = TRUE)
`%||%` <- function(x, y) if (is.null(x)) y else x
script_path <- sub("^--file=", "", grep("^--file=", commandArgs(), value = TRUE)[1])
output_path <- file.path(dirname(normalizePath(script_path)), "alaska_colony_map.svg")
script_output_path <- file.path(dirname(output_path), "alaska_colony_map.js")

colonies <- data.frame(
  code = c("AIKT", "BULD", "STGE", "CALI", "CHIS", "CHOW/SUKL", "GULL", "MDO", "STLA"),
  name = c("Aiktak", "Buldir", "St. George", "Cape Lisburne", "Chisik", "Chowiet/Suklik", "Gull Island", "Middleton Island", "St. Lazaria"),
  lat = c(54.1886, 52.3581, 56.57882, 68.88142, 60.13929, 56.0509, 59.58405, 59.4349304, 56.9872),
  lon = c(-164.84, 175.9247, -169.701, -166.21030, -152.664, -156.6378, -151.3285, -146.4045243, -135.7047)
)

land <- st_read(source_path, quiet = TRUE)
points <- st_as_sf(colonies, coords = c("lon", "lat"), crs = 4326)

# EPSG:3338 is Alaska Albers Equal Area. It keeps the Aleutian chain
# continuous and gives the 100-km buffers an honest geographic scale.
land_ak <- st_transform(land, 3338)
points_ak <- st_transform(points, 3338)

point_bbox <- st_bbox(points_ak)
# Include more of the Russian Far East and surrounding water than a uniform
# point buffer would provide, so the western frame is cartographic context
# rather than an abrupt crop immediately beyond Buldir.
map_bbox <- point_bbox + c(-1000000, -150000, 400000, 150000)
land_crop <- suppressWarnings(st_crop(land_ak, map_bbox))
land_crop <- st_simplify(land_crop, dTolerance = 2500, preserveTopology = TRUE)

width <- 900
x_range <- unname(map_bbox[c("xmin", "xmax")])
y_range <- unname(map_bbox[c("ymin", "ymax")])
height <- round(width * diff(y_range) / diff(x_range))

map_x <- function(x) (x - x_range[[1]]) / diff(x_range) * width
map_y <- function(y) height - (y - y_range[[1]]) / diff(y_range) * height

format_ring <- function(ring) {
  paste0(
    "M", paste0(formatC(map_x(ring[, 1]), digits = 1, format = "f"), ",",
                formatC(map_y(ring[, 2]), digits = 1, format = "f"),
                collapse = "L"), "Z"
  )
}

polygon_paths <- character()
for (feature in st_geometry(land_crop)) {
  polygons <- if (inherits(feature, "MULTIPOLYGON")) unclass(feature) else list(unclass(feature))
  for (polygon in polygons) {
    rings <- Filter(function(ring) is.matrix(ring) && ncol(ring) >= 2, polygon)
    if (length(rings)) {
      polygon_paths <- c(polygon_paths, paste(vapply(rings, format_ring, character(1)), collapse = ""))
    }
  }
}

point_xy <- st_coordinates(points_ak)
cx <- map_x(point_xy[, "X"])
cy <- map_y(point_xy[, "Y"])
radius <- 100000 / diff(x_range) * width

xml_escape <- function(x) {
  x <- gsub("&", "&amp;", x, fixed = TRUE)
  x <- gsub("<", "&lt;", x, fixed = TRUE)
  x <- gsub('"', "&quot;", x, fixed = TRUE)
  x
}

land_svg <- paste0(
  '<path class="land" fill-rule="evenodd" d="',
  paste(polygon_paths, collapse = ""),
  '"/>'
)

colony_svg <- vapply(seq_len(nrow(colonies)), function(i) {
  paste0(
    '<g class="colony" data-code="', xml_escape(colonies$code[[i]]),
    '" role="button" tabindex="0" aria-label="Select ', xml_escape(colonies$name[[i]]), '">',
    '<title>', xml_escape(colonies$name[[i]]), ' (', xml_escape(colonies$code[[i]]), ')</title>',
    '<circle class="foraging-area" cx="', formatC(cx[[i]], digits = 1, format = "f"),
    '" cy="', formatC(cy[[i]], digits = 1, format = "f"),
    '" r="', formatC(radius, digits = 1, format = "f"), '"/>',
    '<circle class="colony-point" cx="', formatC(cx[[i]], digits = 1, format = "f"),
    '" cy="', formatC(cy[[i]], digits = 1, format = "f"), '" r="7"/>',
    '</g>'
  )
}, character(1))

svg <- paste0(
  '<?xml version="1.0" encoding="UTF-8"?>\n',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ', width, ' ', height,
  '" role="img" aria-labelledby="map-title map-desc">\n',
  '<title id="map-title">Alaska seabird colony map</title>\n',
  '<desc id="map-desc">Clickable seabird colonies and their 100-kilometer foraging areas across Alaska and the Aleutian Islands.</desc>\n',
  '<metadata>Basemap derived from Natural Earth 1:50m land polygons, public domain, naturalearthdata.com.</metadata>\n',
  '<style>\n',
  'svg{background:#d8ebf4}.land{fill:#f3efe3;stroke:#80909a;stroke-width:1.5;vector-effect:non-scaling-stroke}',
  '.colony{cursor:pointer;outline:none}.foraging-area{fill:rgba(13,111,139,.18);stroke:rgba(13,111,139,.72);stroke-width:2;vector-effect:non-scaling-stroke}',
  '.colony-point{fill:#0d6f8b;stroke:#083d4b;stroke-width:2;vector-effect:non-scaling-stroke}',
  '.colony:hover .colony-point,.colony:focus .colony-point{stroke:#fff;stroke-width:4}',
  '.colony.selected .foraging-area{fill:rgba(199,92,37,.24);stroke:rgba(199,92,37,.95);stroke-width:3}',
  '.colony.selected .colony-point{fill:#c75c25;stroke:#8f3d17;stroke-width:3}',
  '</style>\n',
  land_svg, "\n", paste(colony_svg, collapse = "\n"), "\n</svg>\n"
)

writeLines(svg, output_path, useBytes = TRUE)
svg_js <- paste0("window.ALASKA_COLONY_MAP = ", jsonlite::toJSON(svg, auto_unbox = TRUE), ";\n")
writeLines(svg_js, script_output_path, useBytes = TRUE)
message("Wrote ", output_path, " (", file.info(output_path)$size, " bytes)")
message("Wrote ", script_output_path, " (", file.info(script_output_path)$size, " bytes)")
