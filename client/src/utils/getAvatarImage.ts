import { BASE_PATH } from '@/config/keys';

export default function getAvatarImage(imageName?: string, isGroupChat: boolean = false): string {
    if (isGroupChat) return `${BASE_PATH}/images/groupImages/${imageName}`;
    else return `${BASE_PATH}/images/userImages/${imageName}`;
}
