export interface CameraPose {
  longitude: number;
  latitude: number;
  distance: number;
}

/** A zoom request from the buttons outside the canvas. A new sequence number applies it once. */
export interface ZoomCommand {
  factor: number;
  sequence: number;
}
