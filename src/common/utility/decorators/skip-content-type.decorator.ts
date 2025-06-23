import { SetMetadata } from '@nestjs/common';

export const SKIP_CONTENT_TYPE_CHECK = 'SKIP_CONTENT_TYPE_CHECK';
export const SkipContentTypeCheck = () => SetMetadata(SKIP_CONTENT_TYPE_CHECK, true);