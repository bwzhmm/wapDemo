import React, { createElement } from 'react';
import Loadable from 'react-loadable';
import { Spin, Icon, Empty } from 'antd';
import _ from 'lodash';

export const GLOBAL_NAME = 'React项目实战总结';
// 动态import组件
export const dynamicWrapper = (component) => {
  const defaultPath = 'notfound/notfound';
  // () => import('module')
  return Loadable({
    loader: () => {
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props
          });
      }).catch(e => {
        // 路径错误默认import 404
        if (_.startsWith(e.toString(), 'Error: Cannot find module')) {
          const NotFoundComponent = dynamicWrapper(() => { return import(`../pages/${defaultPath}`) });
          return NotFoundComponent;
        }
      });
    },
    loading: () => {
      return <Spin size='large' className='global-spin' />;
    }
  });
};

export const RenderEmpty = () => {
  return (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无数据' />
  );
};

export const IconFont = Icon.createFromIconfontCN({
  scriptUrl: 'iconfont.js'
});

// 解析URL参数, getUrlParam('flowId')
export function getUrlParam(href, name) {
  let args = arguments, newHref;
  if (args.length === 1) {
    newHref = window.location.href;
    name = args[0];
  } else if (args.length > 1) {
    newHref = href;
  } else {
    return '';
  }

  let urlArr = newHref.split('?');
  if (urlArr.length > 1) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
      url = urlArr[1];
    let r = url.match(reg);
    // 解码
    if (r != null) {
      let value = decodeURI(r[2]);
      if (value == 'undefined') {
        value = '';
      }
      return value;
    }
    return '';
  } else {
    return '';
  }
}

