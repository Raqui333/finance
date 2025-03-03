import { SetMetadata } from '@nestjs/common';

// used to set routes public

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
