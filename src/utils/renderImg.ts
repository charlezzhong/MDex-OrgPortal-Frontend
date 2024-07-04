import { imgUrl } from "@/services/uri";

export const renderImg = (str: string) => {
  return str ? `${imgUrl}/${str}` : "/images/noImage.webp";
};
