export interface TextOverlay {
  id: string;
  text: string;
  position: string;
  size: string;
  color: string;
}

export interface Magnifier {
  id: string;
  shape: string;
  style: string;
  position: string;
  size: string;
  color: string;
}

export interface AdvancedSettings {
  backgroundNoise: boolean;
  windowShadow: number;
  windowHeader: "dark" | "light" | "none";
  frameCorners: number;
  windowScale: number;
  horizontalOffset: number;
  verticalOffset: number;
  border: boolean;
  borderWidth: number;
  borderColor: string;
}

export interface EditorState {
  selectedBackground: string;
  selectedShadow: string;
  textOverlays: TextOverlay[];
  magnifiers: Magnifier[];
  advancedSettings: AdvancedSettings;
  isCropping: boolean;
  cropArea: CropArea | null;
  fitToImage: boolean;
  canvasSize: { width: number; height: number };
  canvasScale: number;
  aspectRatio: string;
  padding: number;
  canvasCorners: number;
  imageScale: number;
  imageHorizontalOffset: number;
  imageVerticalOffset: number;
  imageCornerRadius: number;
}

export interface Screenshot {
  id: string;
  image: string;
  name: string;
  createdAt?: Date;
  state?: EditorState;
}

export interface CropArea {
  unit: "%" | "px";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AIStyle {
  backgroundCss: string;
  backgroundName: string;
  description: string;
  canvasRadius?: number;
  frameBorderRadius?: number;
  padding?: number;
  shadow?: number;
  windowHeaderStyle?: "dark" | "light" | "none";
  noise?: boolean;
}

export interface AutoStyleResponse {
  success: boolean;
  style?: AIStyle;
  error?: string;
  details?: string;
}

export interface GenerationConfig {
  responseMimeType: "application/json";
  responseSchema: {
    type: "ARRAY";
    items: {
      type: "OBJECT";
      properties: {
        backgroundCss: {
          type: "STRING";
          description: string;
        };
        backgroundName: {
          type: "STRING";
          description: string;
        };
        description: {
          type: "STRING";
          description: string;
        };
        canvasRadius: {
          type: "INTEGER";
          description: string;
        };
        frameBorderRadius: {
          type: "INTEGER";
          description: string;
        };
        padding: {
          type: "INTEGER";
          description: string;
        };
        shadow: {
          type: "INTEGER";
          description: string;
        };
        windowHeaderStyle: {
          type: "STRING";
          enum: ["dark", "light", "none"];
          description: string;
        };
        noise: {
          type: "BOOLEAN";
          description: string;
        };
        imageAugmentation?: {
          type: "OBJECT";
          description: string;
        };
      };
      required: string[];
    };
  };
}

export interface AutoStylePayload {
  contents: {
    inlineData: {
      mimeType: string;
      data: string;
    };
    text: string;
  };
  generationConfig: GenerationConfig;
}
