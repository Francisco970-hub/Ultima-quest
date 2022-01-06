// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import Axios from 'axios';
//import { useHistory } from 'react-router';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  console.log('currentuser');
  //return {data:body.username};
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
  /*return request<{
    data: API.CurrentUser;
  }>('http://localhost:5000/getUser', {
    method: 'GET',
    ...(options || {}),
  });

  /*return request('http://localhost:5000/getUser', {
    method: 'GET',
    data: {
      email: body.username,
    },
  });*/
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function getUser(body: API.LoginParams) {
  var email = body.username;
  return request('http://localhost:5000/getUtilizador?email=' + email?.toString(), {
    method: 'GET',
    data: {
      email: email?.toString(),
    },
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return Axios('http://localhost:5000/login', {
    method: 'POST',
    data: {
      email: body.username,
      password: body.password,
    },
  });
}

export async function validate(body: API.LoginParams, options?: { [key: string]: any }) {
  const token = /*localStorage.getItem('token')*/ '';
  return Axios('http://localhost:5000/isUserAuth', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    if (res.data.authenticated) {
      console.log('User Authencticated');
    } else {
      console.log('User not Authencticated');
    }
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
