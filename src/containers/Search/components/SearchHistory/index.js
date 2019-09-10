import React, { Component } from 'react';
import './style.css';

export class SearchHistory extends Component {

    handleClick = item => {
        this.props.onClickItem(item);
    }

    handleClear = () => {
        this.props.onClear();
    }

    render() {
        const { data } = this.props;
        return (
            <div className='searchHistory'>
                <div className='searchHistory__header'>搜索记录</div>
                <ul className='searchHistory__list'>
                    {
                        data.map((item, idx) => {
                            return (
                                <li 
                                    key={item.id} 
                                    className='searchHistory__item' 
                                    onClick={this.handleClick.bind(this, item)}
                                >{item.keyword}</li>
                            )
                        })
                    }
                </ul>
                <div className='searchHistory__clear' onClick={this.handleClear}>清除搜索记录</div>
            </div>
        );
    }
}

export default SearchHistory;

