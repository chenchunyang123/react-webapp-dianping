import React, { Component } from 'react';
import './style.css';
import LikeItem from '../LikeItem';
import Loading from '../../../../components/Loading';

class LikeList extends Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.removeListener = false;
    }

    componentDidMount() {
        if(this.props.pageCount < 3) {
            document.addEventListener('scroll', this.handleScroll);
        } else {
            this.removeListener = true;
        }
        if(this.props.pageCount === 0) {
            this.props.fetchData();
        }
    }

    componentDidUpdate() {
        if(this.props.pageCount >= 3) {
            document.removeEventListener('scroll', this.handleScroll);
            this.removeEventListener = true;
        }
    }

    componentWillUnmount() {
        !this.removeEventListener && document.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;    // 兼容不同的浏览器
        const screenHeight = document.documentElement.clientHeight;
        const likeListTop = this.myRef.current.offsetTop;
        const likeListHeight = this.myRef.current.offsetHeight;
        if(scrollTop >= likeListTop + likeListHeight - screenHeight) {
            this.props.fetchData();
        }
    }
  
    render() {
        const { data, pageCount } = this.props;
        return (
            <div className='likeList' ref={this.myRef}>
                <div className='likeList__header'>猜你喜欢</div>
                <div className='likeList__list'>
                	{
                        data.map((item, idx) => {
                            return <LikeItem key={idx} data={item} />
                        })
                    }
                </div>
                {
                    pageCount < 3 ?
                    <Loading /> :
                    <a className='likeList__viewAll' href=''>查看更多</a>
                }
            </div>
        );
    }
}

export default LikeList;
