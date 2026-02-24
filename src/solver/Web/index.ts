/**
 * Web挑战工具模块
 * 提供HTTP分析、Web安全和JavaScript分析工具
 */

import * as HTTP from './HTTP/HTTPAnalyzer';
import * as Security from './Security/WebSecurity';

/**
 * Web模块命名空间
 */
export {
  HTTP,
  Security
};

/**
 * 导出Web模块
 */
export default {
  HTTP,
  Security
};
