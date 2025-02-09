/**
 * 手动实现一个简单的 HTML 清洗函数
 * 1. 删除 <script> 标签及其内容
 * 2. 移除所有内联事件属性（如 onclick、onerror 等）
 * 3. 将 javascript: URI 替换为安全默认值
 */
export default function sanitizeHtml(input: string): string {
  let output = input;

  // 删除 <script> 标签及其内容
  output = output.replace(/<script[\s\S]*?<\/script>/gi, '');
  // 删除所有内联事件处理属性（双引号）
  output = output.replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '');
  // 删除所有内联事件处理属性（单引号）
  output = output.replace(/\s*on\w+\s*=\s*'[^']*'/gi, '');
  // 替换 javascript: URI 为 "#"
  output = output.replace(/\s*(href|src)\s*=\s*"javascript:[^"]*"/gi, ' $1="#"');
  output = output.replace(/\s*(href|src)\s*=\s*'javascript:[^']*'/gi, " $1='#'");

  return output;
}