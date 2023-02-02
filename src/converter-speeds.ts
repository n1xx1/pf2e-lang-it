import { Converter } from "./babele";
import { convertFeet } from "./utils";

type Pf2Speed = {
  value: number;
  details: string;
  otherSpeeds: Pf2OtherSpeed[];
};
type Pf2OtherSpeed = {
  type: string;
  value: number;
  label?: string;
};

export const speedPf2: Converter<Pf2Speed | undefined | null> = (
  speed,
  translation?: string
) => {
  if (!speed) {
    return speed;
  }
  return {
    ...speed,
    details: translation || speed.details,
    value: convertFeet(speed.value),
    otherSpeeds: speed.otherSpeeds.map((s) => ({
      ...s,
      value: convertFeet(speed.value),
    })),
  };
};

export const otherSpeedsPf2: Converter<Pf2OtherSpeed[] | undefined | null> = (
  otherSpeeds,
  translation: Record<string, string>
) => {
  if (!otherSpeeds || !translation) {
    return otherSpeeds;
  }
  return otherSpeeds.map((s) => {
    const translated = translation[s.type];
    if (translated) {
      return { ...s, label: translated };
    }
    return s;
  });
};
