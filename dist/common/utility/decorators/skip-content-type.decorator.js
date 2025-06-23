"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipContentTypeCheck = exports.SKIP_CONTENT_TYPE_CHECK = void 0;
const common_1 = require("@nestjs/common");
exports.SKIP_CONTENT_TYPE_CHECK = 'SKIP_CONTENT_TYPE_CHECK';
const SkipContentTypeCheck = () => (0, common_1.SetMetadata)(exports.SKIP_CONTENT_TYPE_CHECK, true);
exports.SkipContentTypeCheck = SkipContentTypeCheck;
//# sourceMappingURL=skip-content-type.decorator.js.map