import closeDark from "./images/close_dark.png";
import closeLight from "./images/close_light.png";
import menuDark from "./images/dots_dark.png";
import menuLight from "./images/dots_light.png";
import backDark from "./images/left_arrow_dark.png";
import backLight from "./images/left_arrow_light.png";
import backDisabled from "./images/left_arrow_disabled.png";
import forwardDark from "./images/right_arrow_dark.png";
import forwardLight from "./images/right_arrow_light.png";
import forwardDisabled from "./images/right_arrow_disabled.png";
import { ImageSourcePropType } from "react-native/types";

type Images = {
  closeDark: ImageSourcePropType;
  closeLight: ImageSourcePropType;
  menuDark: ImageSourcePropType;
  menuLight: ImageSourcePropType;
  backDark: ImageSourcePropType;
  backLight: ImageSourcePropType;
  backDisabled: ImageSourcePropType;
  forwardDark: ImageSourcePropType;
  forwardLight: ImageSourcePropType;
  forwardDisabled: ImageSourcePropType;
};

export const images: Images = {
  closeDark,
  closeLight,
  menuDark,
  menuLight,
  backDark,
  backLight,
  backDisabled,
  forwardDark,
  forwardLight,
  forwardDisabled,
};
