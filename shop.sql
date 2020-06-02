/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 80017
Source Host           : localhost:3306
Source Database       : shop

Target Server Type    : MYSQL
Target Server Version : 80017
File Encoding         : 65001

Date: 2020-03-06 14:20:05
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `addressId` int(100) NOT NULL AUTO_INCREMENT,
  `uid` int(100) DEFAULT NULL,
  `receiver` varchar(255) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `userAddress` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `default` tinyint(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`addressId`),
  KEY `uid` (`uid`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES ('1', '1', '大力', '12457896361', '地球联合国宾夕法尼亚大学', '0');
INSERT INTO `address` VALUES ('3', '1', '帅帅', '11233232332', '宇宙太阳系冥王星天王村', '0');
INSERT INTO `address` VALUES ('4', '1', '喜羊羊', '12345879636', '青青草原羊村喜羊羊家', '1');
INSERT INTO `address` VALUES ('5', '1', '小灰灰', '14785265874', '青青草原狼堡', '0');
INSERT INTO `address` VALUES ('7', '2', 'uzi', '12345612541', '宇宙黑暗势力天团RNG俱乐部', '1');

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `cartId` int(100) NOT NULL AUTO_INCREMENT,
  `uid` int(100) DEFAULT NULL,
  `productId` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `productName` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `count` int(100) NOT NULL,
  `productImageUrl` varchar(255) NOT NULL,
  `checked` int(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`cartId`),
  KEY `uid` (`uid`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cart
-- ----------------------------
INSERT INTO `cart` VALUES ('6', '2', '202003', '小黑音箱', '456.00', '1', 'http://localhost:3000/images/1.jpg', '0');
INSERT INTO `cart` VALUES ('9', '2', '202006', '小爱音箱', '324.00', '3', 'http://localhost:3000/images/8.jpg', '0');
INSERT INTO `cart` VALUES ('10', '1', '202001', '平衡车', '1999.00', '4', 'http://localhost:3000/images/pingheng.jpg', '0');
INSERT INTO `cart` VALUES ('12', '1', '202007', '小米电饭煲', '1699.00', '2', 'http://localhost:3000/images/9.jpg', '0');
INSERT INTO `cart` VALUES ('15', '1', '202010', '小米监控', '999.00', '1', 'http://localhost:3000/images/photo.jpg', '0');
INSERT INTO `cart` VALUES ('19', '2', '202009', 'type-c数据线', '12.00', '1', 'http://localhost:3000/images/15.jpg', '0');
INSERT INTO `cart` VALUES ('20', '2', '202001', '平衡车', '1999.00', '1', 'http://localhost:3000/images/pingheng.jpg', '0');

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `productId` varchar(255) NOT NULL,
  `productName` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `productImageUrl` varchar(255) NOT NULL,
  PRIMARY KEY (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES ('202001', '平衡车', '1999.00', 'pingheng.jpg');
INSERT INTO `goods` VALUES ('202002', '蓝牙耳机', '99.00', '2.jpg');
INSERT INTO `goods` VALUES ('202003', '小黑音箱', '456.00', '1.jpg');
INSERT INTO `goods` VALUES ('202004', '多孔插板', '68.00', '6.jpg');
INSERT INTO `goods` VALUES ('202005', '粉丝有线耳机', '55.00', '7.jpg');
INSERT INTO `goods` VALUES ('202006', '小爱音箱', '324.00', '8.jpg');
INSERT INTO `goods` VALUES ('202007', '小米电饭煲', '1699.00', '9.jpg');
INSERT INTO `goods` VALUES ('202008', '42寸液晶电视', '1836.00', '10.jpg');
INSERT INTO `goods` VALUES ('202009', 'type-c数据线', '12.00', '15.jpg');
INSERT INTO `goods` VALUES ('202010', '小米监控', '999.00', 'photo.jpg');
INSERT INTO `goods` VALUES ('202011', 'letme限量版蓝牙耳机', '900.00', '16.jpg');

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `orderId` varchar(255) NOT NULL,
  `orderTime` varchar(255) NOT NULL,
  `uid` int(7) DEFAULT NULL,
  `orderMoney` int(10) NOT NULL,
  `orderInfo` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `address` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`orderId`),
  KEY `uid` (`uid`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of order
-- ----------------------------
INSERT INTO `order` VALUES ('0920200305200749', '2020-03-05 20:07:49', '2', '55', '[{\"cartId\":13,\"uid\":2,\"productId\":\"202005\",\"productName\":\"粉丝有线耳机\",\"price\":55,\"count\":2,\"productImageUrl\":\"http://192.168.199.106:3000/images/7.jpg\",\"checked\":1}]', '宇宙黑暗势力天团RNG俱乐部');
INSERT INTO `order` VALUES ('1020200305200431', '2020-03-05 20:04:31', '2', '12', '[{\"cartId\":17,\"uid\":2,\"productId\":\"202009\",\"productName\":\"type-c数据线\",\"price\":12,\"count\":1,\"productImageUrl\":\"http://192.168.199.106:3000/images/15.jpg\",\"checked\":1}]', '宇宙黑暗势力天团RNG俱乐部');
INSERT INTO `order` VALUES ('1720200305201646', '2020-03-05 20:16:46', '2', '55', '[{\"cartId\":18,\"uid\":2,\"productId\":\"202005\",\"productName\":\"粉丝有线耳机\",\"price\":55,\"count\":1,\"productImageUrl\":\"http://192.168.199.106:3000/images/7.jpg\",\"checked\":1}]', '宇宙黑暗势力天团RNG俱乐部');
INSERT INTO `order` VALUES ('2020200305192653', '2020-03-05 19:26:53', '1', '12', '[{\"cartId\":4,\"uid\":1,\"productId\":\"202009\",\"productName\":\"type-c数据线\",\"price\":12,\"count\":2,\"productImageUrl\":\"http://192.168.199.106:3000/images/15.jpg\",\"checked\":1}]', '青青草原狼堡');
INSERT INTO `order` VALUES ('4520200305191730', '2020-03-05 19:17:30', '1', '491', '[{\"cartId\":5,\"uid\":1,\"productId\":\"202004\",\"productName\":\"多孔插板\",\"price\":68,\"count\":5,\"productImageUrl\":\"http://192.168.199.106:3000/images/6.jpg\",\"checked\":1},{\"cartId\":14,\"uid\":1,\"productId\":\"202002\",\"productName\":\"蓝牙耳机\",\"price\":99,\"count\":2,\"productImageUrl\":\"http://192.168.199.106:3000/images/2.jpg\",\"checked\":1},{\"cartId\":16,\"uid\":1,\"productId\":\"202006\",\"productName\":\"小爱音箱\",\"price\":324,\"count\":2,\"productImageUrl\":\"http://192.168.199.106:3000/images/8.jpg\",\"checked\":1}]', '地球联合国宾夕法尼亚大学');
INSERT INTO `order` VALUES ('5220200305200412', '2020-03-05 20:04:12', '2', '999', '[{\"cartId\":8,\"uid\":2,\"productId\":\"202010\",\"productName\":\"小米监控\",\"price\":999,\"count\":2,\"productImageUrl\":\"http://192.168.199.106:3000/images/photo.jpg\",\"checked\":1}]', '宇宙黑暗势力天团RNG俱乐部');
INSERT INTO `order` VALUES ('7620200305221359', '2020-03-05 22:13:59', '1', '1836', '[{\"cartId\":11,\"uid\":1,\"productId\":\"202008\",\"productName\":\"42寸液晶电视\",\"price\":1836,\"count\":2,\"productImageUrl\":\"http://192.168.199.106:3000/images/10.jpg\",\"checked\":1}]', '青青草原狼堡');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'wxb', '123456');
INSERT INTO `users` VALUES ('2', 'www', '123456');
INSERT INTO `users` VALUES ('3', 'wang', '123456');
