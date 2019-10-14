import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as userActions, getCurrentTab, getDeletingOrderId, getCommentingOrderId, getCurrentOrderComment, getCurrentOrderStars } from '../../../../redux/modules/user';
import './style.css';
import OrderItem from '../../components/OrderItem';
import Confirm from '../../../../components/Confirm';

const tabTitles = ['全部订单', '待付款', '可使用', '退款/售后'];

export class UserMain extends Component {

    handleClickTab = idx => {
        this.props.userActions.setCurrentTab(idx);
    }

    // 删除订单
    handleRemove = orderId => {
        this.props.userActions.showDeleteDialog(orderId);
    }

    // 评价内容变化
    handleCommentChange = comment => {
        const { userActions: { setComment } } = this.props;
        setComment(comment);
    }

    // 订单评级变化
    handleStarsChange = stars => {
        const { userActions: { setStars } } = this.props;
        setStars(stars);
    }

    // 选中订单显示评价
    handleComment = orderId => {
        const { userActions: { showCommentArea } } = this.props;
        showCommentArea(orderId);
    }

    // 提交评价
    handelSubmitComment = () => {
        const { userActions: { submitComment } } = this.props;
        submitComment();
    }

    // 取消评价
    handleCancelComment = () => {
        const { userActions: { hideCommentArea } } = this.props;
        hideCommentArea();
    }

    renderOrderList = data => {
        const { commentingOrderId, orderComment, orderStars } = this.props;
        return data.map(item => {
            return (
                <OrderItem 
                    key={item.id}
                    data={item}
                    onRemove={this.handleRemove.bind(this, item.id)}
                    isCommenting={item.id === commentingOrderId}
                    comment={item.id === commentingOrderId ? orderComment : ''}
                    stars={item.id === commentingOrderId ? orderStars : ''}
                    onCommentChange={this.handleCommentChange}
                    onStarsChange={this.handleStarsChange}
                    onComment={this.handleComment.bind(this, item.id)}
                    onSubmitComment={this.handelSubmitComment}
                    onCancelComment={this.handleCancelComment}
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

    // 删除对话框
    renderConfirmDialog = () => {
        const { userActions: { hideDeleteDialog, removeOrder } } = this.props;
        return (
            <Confirm 
                content='确认删除该订单吗？'
                cancelText='取消'
                confirmText='确定'
                onCancel={hideDeleteDialog}
                onConfirm={removeOrder}
            />
        )
    }

    render() {
        const { currentTab, data, deletingOrderId } = this.props;
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
                {
                    deletingOrderId ? this.renderConfirmDialog() : null
                }
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        currentTab: getCurrentTab(state),
        deletingOrderId: getDeletingOrderId(state),
        commentingOrderId: getCommentingOrderId(state),
        orderComment: getCurrentOrderComment(state),
        orderStars: getCurrentOrderStars(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMain);
