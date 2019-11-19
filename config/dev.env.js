/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-15 20:54:43
 * @LastEditTime: 2019-10-06 15:08:30
 * @LastEditors: Please set LastEditors
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.31.185:8003"'
  // BASE_API: '"http://192.168.31.1:8003"'
})
