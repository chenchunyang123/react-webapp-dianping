import React, { Component } from 'react';
import './style.css';
import OrderItem from '../OrderItem';

const tabTitles = ['全部订单', '待付款', '可使用', '退款/售后'];

const data = [
    {
      "id": "o-2",
      "statusText": "已消费",
      "orderPicUrl": "https://p1.meituan.net/deal/95e79382c20a78da3068c4207ab7a9b4329494.jpg.webp@700w_700h_1e_1c_1l|watermark=1&&r=1&p=9&x=20&y=20",
      "channel": "团购",
      "title": "华莱士：华莱士单人套餐",
      "text": ["1张 | 总价：￥11.99", "有效期至2018-09-17"],
      "type": 1
    },
]

export class UserMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
        }
    }

    handleClickTab = idx => {
        this.setState({
            currentTab: idx,
        })
    }

    renderOrderList = data => {
        return data.map(item => {
            return (
                <OrderItem 
                    key={item.id}
                    data={item}
                />
            )
        })
    }

    renderEmpty = () => {
        return (
            <div className='userMain__empty'>
                <div className='userMain__emptyIcon'></div>
                <div className='userMain__emptyText1'>您还没有相关订单</div>
                <div className='userMain__emptyText2'>去逛逛看有哪些想买的</div>
            </div>
        )
    }

    render() {
        const { currentTab } = this.state;
        return (
            <div className='userMain'>
                <div className='userMain__menu'>
                    {
                        tabTitles.map((item, idx) => {
                            return (
                                <div key={idx} className='userMain__tab' onClick={this.handleClickTab.bind(this, idx)}>
                                    <span 
                                        className={
                                            currentTab === idx ? 'userMain__title userMain__title--active' : 'userMain__title'
                                        }
                                    >{item}</span>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='userMain__content'>
                    {
                        data && data.length > 0 ? this.renderOrderList(data) : this.renderEmpty()
                    }
                </div>
            </div>
        );
    }
}

export default UserMain;
