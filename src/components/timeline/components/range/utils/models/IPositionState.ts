export interface IPositionState {
  left: number;
  top: number;
  width: number;
  startLeft: number;
  startTop: number;
  scrollLeftStart: number;
  scrollTopStart: number;
  dragging: boolean;
  draggingLeft: boolean;
  draggingRight: boolean;
}

export const PositionStateDefault: IPositionState = {
  left: 0,
  top: 0,
  width: 0,
  startLeft: 0,
  startTop: 0,
  scrollLeftStart: 0,
  scrollTopStart: 0,
  dragging: false,
  draggingLeft: false,
  draggingRight: false,
};
