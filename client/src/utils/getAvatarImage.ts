import { BASE_PATH } from "@/config/keys";

export default function getAvatarImage(
  imageName?: string,
  isGroupChat: boolean = false
): string {
  if (isGroupChat) return `${BASE_PATH}/static/images/groupImages/${imageName}`;
  else return `${BASE_PATH}/static/images/userImages/${imageName}`;
}
