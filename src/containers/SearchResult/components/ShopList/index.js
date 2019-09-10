import React, { Component } from 'react';
import ShopItem from '../ShopItem';
import './style.css';

export class ShopList extends Component {
    render() {
        const { data } = this.props;
        return (
            <div className='shopList'>
                <div className='shopList__filter'>
                    <span className='shopList__filterItem'>全部商区</span>
                    <span className='shopList__filterItem'>全部分类</span>
                    <span className='shopList__filterItem'>智能排序</span>
                </div>
                <div>
                    {
                        data.map((item, idx) => {
                            return (
                                <div key={item.id}>
                                    <ShopItem data={item} />
                                    {
                                        idx < data.length - 1 ? <div className='shopList__divider'></div> : null
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

export default ShopList;
