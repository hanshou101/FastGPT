/* 
 * 这段代码是用于导入和导出 Mongoose 的模块。 
 * 包含了导出 Mongoose 对象和导出所有 Mongoose 的内容。 
 * 还有一个全局的 MongoDB 连接对象 connectionMongo。 
 */

import mongoose from 'mongoose';

// 导出 Mongoose 对象作为默认导出 
export default mongoose;

// 导出所有 Mongoose 的内容 
export * from 'mongoose';

// 导出全局的 MongoDB 连接对象 connectionMongo 
export const connectionMongo = global.mongodb || mongoose;