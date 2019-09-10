import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SearchBox from './components/SearchBox';
import PopularSearch from './components/PopularSearch';
import SearchHistory from './components/SearchHistory';
import { actions as searchActions, getHistoryKeywords, getInputText, getPopularKeywords, getRelatedKeywords } from '../../redux/modules/search';

class Search extends Component {

    componentDidMount() {
        const { loadPopularKeywords } = this.props.searchActions;
        loadPopularKeywords();
    }

    componentWillUnmount() {
        const { clearInputText } = this.props.searchActions;
        clearInputText();
    }

    // 搜索框输入
    handleChangeInput = text => {
        const { setInputText, loadRelatedKeywords } = this.props.searchActions;
        setInputText(text);
        loadRelatedKeywords(text);
    }

    // 清空搜索框
    handleClearInput = () => {
        const { clearInputText } = this.props.searchActions;
        clearInputText();
    }

    // 取消搜索
    handleCancel = () => {
        this.handleClearInput();
        this.props.history.goBack();
    }

    // 点击关键词
    handleClickItem = item => {
        const { setInputText, addHistoryKeyword, loadRelatedShops } = this.props.searchActions;
        setInputText(item.keyword);
        addHistoryKeyword(item.id);
        loadRelatedShops(item.id);
        // 跳转搜索结果页
        this.props.history.push('/search_result');
    }

    // 清除历史记录
    handleClearHistory = () => {
        const { clearHistoryKeywords } = this.props.searchActions;
        clearHistoryKeywords();
    }

    render() {
        const { inputText, relatedKeywords, popularKeywords, historyKeywords } = this.props;
        return (
            <div>
                <SearchBox 
                    inputText={inputText} 
                    relatedKeywords={relatedKeywords}  
                    onChange={this.handleChangeInput}
                    onClear={this.handleClearInput}
                    onCancel={this.handleCancel}
                    onClickItem={this.handleClickItem}
                />
                <PopularSearch 
                    data={popularKeywords}
                    onClickItem={this.handleClickItem}
                />
                <SearchHistory 
                    data={historyKeywords}
                    onClickItem={this.handleClickItem}
                    onClear={this.handleClearHistory}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        relatedKeywords: getRelatedKeywords(state),
        inputText: getInputText(state),
        popularKeywords: getPopularKeywords(state),
        historyKeywords: getHistoryKeywords(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        searchActions: bindActionCreators(searchActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
