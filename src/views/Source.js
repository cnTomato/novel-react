/*
 * Created by pan 2018-12-12
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BookItem from '../components/BookItem';
import '../assets/scss/source.scss';
import Loading from '../components/Loading';

class Source extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            sources: [],
            isEmpty: false,
            sourceError: false,
            loading: false,
        };
    }

    componentWillMount() {
        this.setState({ loading: true });
        const params = require('query-string').parseUrl(
            this.props.location.search
        );
        const text = params.query.text.match(/[\u4e00-\u9fa5]/g).join('');
        document.title = `${text}搜索结果`;
        axios({
            method: 'GET',
            url: '/search',
            params: {
                text: text,
            },
        }).then(res => {
            if (res.data.result === 1) {
                this.setState({
                    data: [...this.state.data, ...res.data.data.books],
                    isEmpty: !!!res.data.data.books.length,
                });
            } else {
                this.setState({ isEmpty: true });
            }
            this.setState({ loading: false });
        });
    }

    getSource() {
        const items = document.querySelectorAll('.item');
        const { id, key } = arguments[0];
        axios({
            method: 'GET',
            url: '/source',
            params: {
                view: 'summary',
                bookid: id,
            },
        }).then(res => {
            console.log(res.data);
            if (res.data.result === 1) {
                let data = this.state.sources;
                data[key] = [].concat(res.data.data);
                this.setState({
                    sources: data,
                    sourceError: !!!res.data.data.length,
                });
            } else {
                this.setState({ sourceError: true });
            }
            Array.prototype.forEach.call(items, (v, k) => {
                v.classList.remove('show');
                items[key].classList.add('show');
            });
        });
    }

    render() {
        if (this.state.loading) {
            return <Loading />;
        }
        if (this.state.isEmpty) {
            return <div className="empty">暂无数据</div>;
        }
        return (
            <div className="source">
                {this.state.data.map((item, key) => (
                    <div
                        onClick={this.getSource.bind(this, {
                            id: item._id,
                            key: key,
                        })}
                        key={key}
                        className={`item item-${key}`}
                    >
                        <BookItem data={item} />
                        {(function(self) {
                            if (Array.isArray(self.state.sources[key])) {
                                return (
                                    <div className="list">
                                        <h3>
                                            {self.state.sources[key].length
                                                ? '选择小说来源'
                                                : '暂无数据'}
                                        </h3>
                                        {self.state.sources[key].map((v, k) => (
                                            <Link
                                                key={k}
                                                to={{
                                                    pathname: '/categories',
                                                    search: `?id=${v._id}`,
                                                }}
                                            >
                                                {v.name}
                                            </Link>
                                        ))}
                                    </div>
                                );
                            }
                        })(this)}
                    </div>
                ))}
            </div>
        );
    }
}

export default Source;
