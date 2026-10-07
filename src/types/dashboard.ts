export type WidgetType = 'clock' | 'timer' | 'todo' | 'notes' | 'image';

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized?: boolean;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface BackgroundOption {
  id: string;
  name: string;
  type: 'image' | 'gradient';
  value: string;
  thumbnail: string;
}
