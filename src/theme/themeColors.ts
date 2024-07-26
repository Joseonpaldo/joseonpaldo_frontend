declare module "@mui/material/styles" {
  interface PaletteColor {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    red: string;
    purple: string;
    yellow: string;
  }
}

export const primary = {
  100: "#F0E0D1", // 아주 연한 갈색
  200: "#D9C1A3", // 연한 갈색
  300: "#C2A08D", // 중간 갈색
  400: "#A88A6E", // 다소 진한 갈색
  500: "#8B6B4F", // 진한 갈색
  main: "#8B6B4F", // 진한 갈색
  light: "#F0E0D1", // 아주 연한 갈색
  dark: "#6B4A34", // 더 진한 갈색
  red: "#FF6B93",
  purple: "#A798FF",
  yellow: "#FF9777",
};

export const secondary = {
  100: "#F9F9F9",
  200: "#ECEFF5",
  300: "#E5EAF2", // outline or border
  400: "#94A4C4", // text muted
  500: "#1d2438", // main text
  main: "#1d2438", // main text
  light: "#F9F9F9",
  red: "#FF6B93",
  purple: "#A798FF",
  yellow: "#FF9777",
};

export const error = {
  main: "#FD396D",
};

export const success = {
  main: "#2CC5BD",
};

export const warning = {
  main: "#FFE91F",
  dark: "#FFD600",
};

export const info = {
  main: "#A798FF",
};

export const text = {
  primary: secondary[500],
  secondary: secondary[400],
  disabled: secondary[300],
};
