import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, HashRouter, Route, Switch, Link, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import DocumentTitle from 'react-document-title';
import { dynamicWrapper, GLOBAL_NAME, RenderEmpty } from './util/util';
import configureStore from './store/configureStore';
import zhCN from 'antd/es/locale/zh_CN';

import logo from './logo.svg';
import './App.css';


const store = configureStore();
const supportsHistory = 'pushState' in window.history;

const AsyncLogin = dynamicWrapper(() => { return import(`./pages/login/login`) });
// const AsyncModify = dynamicWrapper(() => { return import(`../pages/modifypassword/modify`) });
const AsyncHome = dynamicWrapper(() => { return import(`./pages/home/home`) });

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
        <Provider store={store}>
        <DocumentTitle title={GLOBAL_NAME}>
            <ConfigProvider locale={zhCN} renderEmpty={RenderEmpty}>
                <HashRouter forceRefresh={!supportsHistory}>
                    <Switch>
                        <Route path='/login' component={AsyncLogin} />
                        {/* <Route path='/modify' component={AsyncModify} /> */}
                        <Route path='/home' component={AsyncHome} />
                        <Route path='/independent' render={(match) => {
                            let pathName = match.location.pathname,
                                path = pathName.replace(/\/independent\//, '');
                            const AsyncComp = dynamicWrapper(() => { return import(`./pages/${path}`) });
                            return <AsyncComp addTab={() => { }} removeTab={() => { }} noRefresh={() => { }} />;
                        }} />
                        <Redirect to='/login' />
                    </Switch>
                </HashRouter>
            </ConfigProvider>
        </DocumentTitle>
    </Provider>
  );
}

export default App;
