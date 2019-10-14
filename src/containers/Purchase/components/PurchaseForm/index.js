import React, { Component } from 'react';
import './style.css';

class PurchaseForm extends Component {

    handleDecrease = () => {    // 减少
        const { quantity } = this.props;
        if(quantity > 0) {
            this.props.onSetQuantity(quantity - 1);
        }
        
    }

    handleIncrease = () => {    // 增加
        const { quantity } = this.props;
        this.props.onSetQuantity(quantity + 1);
    }

    handleClick = () => {   // 提交订单
        const { quantity } = this.props;
        if(quantity > 0) {
            this.props.onSubmit();
        }
    }

    handleChange = e => {
        let quantity = e.target.value;
        this.props.onSetQuantity(Number.parseInt(quantity));
    }

    render() {
        const { product: { currentPrice }, quantity, phone } = this.props;
        let totalPrice = (currentPrice * quantity).toFixed(1);
        if(totalPrice === 'NaN') {
            totalPrice = (0).toFixed(1);
        }
        return (
            <div className='purchaseForm'>
                <div className='purchaseForm__wrapper'>
                    <div className='purchaseForm__row'>
                        <div className='purchaseForm__rowLabel'>数量</div>
                        <div className='purchaseForm__counter'>
                            <span className='purchaseForm__counter--dec' onClick={this.handleDecrease}>-</span>
                            <input type='number' className='purchaseForm__quantity' value={quantity} onChange={this.handleChange} />
                            <span className='purchaseForm__counter--inc' onClick={this.handleIncrease}>+</span>
                        </div>
                    </div>
                    <div className='purchaseForm__row'>
                        <div className='purchaseForm__rowLabel'>小计</div>
                        <div className='purchaseForm__rowValue'>
                            <span className='purchaseForm__totalPrice'>￥{totalPrice}</span>
                        </div>
                    </div>
                    <div className='purchaseForm__row'>
                        <div className='purchaseForm__rowLabel'>手机号码</div>
                        <div className='purchaseForm__rowValue'>
                            {phone}
                        </div>
                    </div>
                </div>
                <ul className='purchaseForm__remark'>
                    <li className='purchaseForm__remarkItem'>
                        <i className='purchaseForm__sign'></i>
                        <span className='purchaseForm__desc'>支持随时退</span>
                    </li>
                    <li>
                        <i className='purchaseForm__sign'></i>
                        <span className='purchaseForm__desc'>支持随时退</span>
                    </li>
                </ul>
                <a className='purchaseForm__submit' onClick={this.handleClick}>提交订单</a>
            </div>
        );
    }
}

export default PurchaseForm;
