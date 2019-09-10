import React, { Component } from 'react';
import './style.css';

class PopularSearch extends Component {

    handleClick = item => {
        this.props.onClickItem(item);
    }

    render() {
        const { data } = this.props;
        return (
            <div className='popularSearch'>
                {
                    data.map((item, idx) => {
                        return (
                            <span 
                                className='popularSearch__item' 
                                key={item.id} 
                                onClick={this.handleClick.bind(this, item)}
                            >{item.keyword}</span>
                        )
                    })
                }
            </div>
        );
    }
}

export default PopularSearch;
