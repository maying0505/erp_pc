import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import './index.less';


class PictureBrowsing extends React.Component {
    static propTypes = {
        imgList: PropTypes.array,
        pictureBrowsingcancel: PropTypes.func,
        bigImgShowDo: PropTypes.func,
        curImageIndex: PropTypes.number,
    };

    static defaultProps = {
        curImageIndex: 0,
        imgList: [],
        bigImgShowDo: () => {
        },
        pictureBrowsingcancel: () => {
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            show: 'block',
            curViewImg: 0,
            gallery: {},
        }
    }

    componentDidMount() { //预加载数据
        const that = this
        const gallery = new Viewer(document.getElementById('images'), {
            title: false,
            hide() {
                that.props.pictureBrowsingcancel()
            },
            fullscreen: false,
            view(e) {
                that.setState({
                    curViewImg: e.detail.index
                })
            },
            loop: false,
            navbar: false
        });
        gallery.view(that.props.curImageIndex);
        that.setState({
            show: 'none',
            gallery: gallery
        })
    }

    bigImgShow = () => {
        let imgListB = this.props.imgList;
        let bigImgUrl = '';
        if (imgListB[this.state.curViewImg]['thumbUrl']) {
            bigImgUrl = imgListB[this.state.curViewImg]['thumbUrl']
        } else {
            if (imgListB[this.state.curViewImg].bigBUrl) {
                bigImgUrl = imgListB[this.state.curViewImg].bigBUrl
            }
        }
        console.log(this.state.curViewImg, bigImgUrl)
        this.props.bigImgShowDo(this.state.curViewImg, bigImgUrl);
        this.state.gallery.hide();
    };

    render() {
        const {showBigImage = true} = this.props;
        return (
            <div style={{position: 'relative'}}>
                <ul id="images">
                    {
                        this.props.imgList.map((item, index) =>
                            <li key={index} style={{display: this.state.show}}><img
                                src={item.bigUrl || item.url || item.thumbUrl} alt={`图片${index + 1}`}/></li>
                        )
                    }
                    {
                        showBigImage &&
                        <Button
                            className="view_big_img_btn"
                            onClick={this.bigImgShow}
                        >
                            查看原图
                        </Button>
                    }
                </ul>
            </div>
        );
    }
}

export default PictureBrowsing
