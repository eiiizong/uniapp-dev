import Vue from 'vue';
import Vuex from 'vuex';

// import { CHANGE_USERINFO, CHANGE_REGISTER_STATUS, } from '@/store/types';
import {
  INIT_CATEGORY_LIST,
  CLEAR_SHOPPING_CARET_LIST,
  CHANGE_SHOPINFO,
  CHANGE_USERINFO,
  CHANGE_AUTHORIZE_STATUS,
  CHANGE_REGISTER_STATUS,
  CHANGE_ORDERING_STATUS,
  CHANGE_CATEGORY_LIST,
  CHANGE_DELIVERY_ADDRESS,
  CHANGE_OPEN_ID,
  CHANGE_ACCESS_TOKEN,
  
  GET_OPEN_ID,
  GET_DELIVERY_ADDRESS,
  GET_ORDERING_STATUS,
  GET_SHOPINFO,
  GET_SHOPPING_CARET_LIST,
  GET_USERINFO,
  GET_REGISTER_STATUS,
  GET_AUTHORIZE_STATUS,
  GET_ACCESS_TOKEN,
  GET_CATEGORY_LIST,
  CHANGE_LOGIN_REQUEST_COMPLATED_STATUS,
  GET_LOGIN_REQUEST_COMPLATED_STATUS,
} from './types';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // 店铺信息
    shopInfo: {},
    // 用户信息
    userInfo: {},
    // 是否注册/绑定手机号
    isRegister: false,
    // 是否授权
    isAuthorize: false,
    // 购物车商品
    shoppingCartList: [],
    // 是否是外卖点餐
    isTakeout: true,
    // 配送地址
    deliveryAddress: {},
    // key
    accessToken: '',
    categoryList: [],
    openid: '',
    // 登陆请求是否完成
    loginRequestIsCompleted: false
  },
  mutations: {
    // 改变用户信息
    [CHANGE_USERINFO](state, data) {
      state.userInfo = Object.assign(
        {},
        {
          ...state.userInfo,
          ...data,
        }
      );
    },
    // 改变 配送地址
    [CHANGE_DELIVERY_ADDRESS](state, address) {
      state.deliveryAddress = {
        ...address
      };
    },
    // 改变 登陆请求状态
    [CHANGE_LOGIN_REQUEST_COMPLATED_STATUS](state, status) {
      state.loginRequestIsCompleted = status;
    },
     // 改变授权状态
     [CHANGE_AUTHORIZE_STATUS](state, data) {
      state.isAuthorize = data;
    },
    // 改变注册状态
    [CHANGE_REGISTER_STATUS](state, data) {
      state.isRegister = data;
    },
    // 改变注册状态
    [CHANGE_SHOPINFO](state, data) {
      state.shopInfo = data;
    },
    // 改变点餐状态
    [CHANGE_ORDERING_STATUS](state, takeoutStatus) {
      state.isTakeout = takeoutStatus;
    },
    // 改变openid
    [CHANGE_OPEN_ID](state, openid) {
      state.openid = openid;
    },
    // 改变openid
    [CHANGE_ACCESS_TOKEN](state, token) {
      state.accessToken = token;
    },

    // 初始化菜品列表
    [INIT_CATEGORY_LIST](state, categoryList) {
      state.categoryList = [].concat(categoryList);
      state.shoppingCartList = [].concat([]);
    },
    // 更改菜品列表
    // handleType add sum calcNum
    [CHANGE_CATEGORY_LIST](state, data) {
      let shoppingCartList = [];
      const good = data.good;
      let categoryList = [].concat(state.categoryList);
      // 更新左边菜单栏 选中状态
      if (data.categoryId) {
        categoryList.map(item => {
          item.checked = false;
          if (item.id === data.categoryId) {
            item.checked = true;
          }
        });
        state.categoryList = [].concat(categoryList);
        return;
      }

      // 多规格 传入时改变id
      if (good.is_multiple_spec === '1') {
        // 减少
        if (data.handleNum < 0) {
          categoryList.forEach(item => {
            item.goodsList.forEach(item2 => {
              item2.specs.forEach(item3 => {
                if (item3.id === good.id) {
                  item3.num -= 1;
                }
              });
            });
          });
        } else {
          // 添加
          categoryList.forEach(item => {
            item.goodsList.forEach(item2 => {
              item2.specs.forEach(item3 => {
                if (item3.id === good.id) {
                  if (data.type === 'shoppingCart') {
                    item3.num += data.handleNum;
                  } else {
                    item3.num = data.handleNum;
                  }
                }
              });
            });
          });
        }
      } else {
        // 单规格
        categoryList.forEach(item => {
          item.goodsList.forEach(item2 => {
            if (item2.id === good.id) {
              item2.num += data.handleNum;
            }
          });
        });
      }
      // 统计num
      categoryList.forEach(item => {
        let itemNum1 = 0;
        item.goodsList.forEach(item2 => {
          let itemNum2 = 0;
          if (item2.is_multiple_spec === '1') {
            item2.specs.forEach(item3 => {
              itemNum2 += item3.num;
            });
            item2.num = itemNum2;
          }
          itemNum1 += item2.num;
        });
        item.num = itemNum1;
      });

      // 统计购物车
      categoryList.forEach(item => {
        if (item.id === 'hot' || item.id === 'recommend') {
          return false;
        }

        if (item.num > 0) {
          item.goodsList.forEach(item2 => {
            if (item2.num > 0) {
              // 多规格
              if (item2.is_multiple_spec === '1') {
                item2.specs.forEach(item3 => {
                  if (item3.num > 0) {
                    shoppingCartList = shoppingCartList.concat({
                      ...item2,
                      ...item3,
                      spec_str: [item3.spec_str],
                    });
                  }
                });
              } else {
                shoppingCartList = shoppingCartList.concat(item2);
              }
            }
          });
        }
      });
      // 更新 categoryList
      state.categoryList = [].concat(categoryList);
      state.shoppingCartList = [].concat(shoppingCartList);
    },
  },
  getters: {
    // 获取配送地址
    [GET_DELIVERY_ADDRESS](state) {
      return state.deliveryAddress;
    },
    // 获取授权状态
    [GET_AUTHORIZE_STATUS](state) {
      return state.isAuthorize;
    },
    // 获取 登陆请求状态
    [GET_LOGIN_REQUEST_COMPLATED_STATUS](state) {
      return state.loginRequestIsCompleted;
    },
    // 获取注册状态
    [GET_REGISTER_STATUS](state) {
      return state.isRegister;
    },
    // 获取注册状态
    [GET_USERINFO](state) {
      return state.userInfo;
    },
    // 获取店铺信息
    [GET_SHOPINFO](state) {
      return state.shopInfo;
    },
    // 获取 key
    [GET_ACCESS_TOKEN](state) {
      return state.accessToken;
    },
    // 获取点餐状态
    [GET_ORDERING_STATUS](state) {
      return state.isTakeout;
    },
    // 获取点餐状态
    [GET_SHOPPING_CARET_LIST](state) {
      return [].concat(state.shoppingCartList);
    },
    // 获取菜品列表
    [GET_CATEGORY_LIST](state) {
      return [].concat(state.categoryList);
    },
    // 获取 openid
    [GET_OPEN_ID](state) {
      return state.openid;
    },
  },
  actions: {},
});

export default store;
