/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 20:54:43
 * @LastEditTime: 2019-12-03 11:22:31
 * @LastEditors: Please set LastEditors
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.31.185:8003"'
  // BASE_API: '"http://192.168.31.164:8003"'
  BASE_API: '"http://47.110.126.198:8003"'
})
