import React, { Component } from 'react';

export default function asyncComponent(importComponent) {
    class AsyncComponent extends Component {
        constructor(props) {
            super(props);
            this.state = {
                component: null,
            }
        }

        componentDidMount() {   // import返回的是一个promise对象
            importComponent().then((mod) => {
                this.setState({
                    component: mod.default,     // 返回的对象的default属性才是真正要渲染的组件
                })
            })
        }

        render() {
            const C = this.state.component;
            return C ? <C {...this.props} /> : null
        }
    }

    return AsyncComponent;
}