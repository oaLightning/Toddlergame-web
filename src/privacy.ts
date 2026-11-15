/** Private source assets are opt-in and must never be included in a Pages build. */
export const includePrivatePhotos = import.meta.env.VITE_INCLUDE_PRIVATE_PHOTOS === 'true';
export const privatePortrait = (path: string): string | undefined => includePrivatePhotos ? path : undefined;
