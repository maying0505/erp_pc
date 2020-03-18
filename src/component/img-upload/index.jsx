import React from 'react';
import PropTypes from 'prop-types';
import {Upload, Icon, Modal, message, Carousel, Button} from 'antd';
import api from 'api'
import {apiUrl} from 'common/request/request.js'
import {local, session} from 'common/util/storage.js'
import imgUrl from 'common/util/imgUrl'
import PictureBrowsing from '../picture-browsing'
import BigImgBrowsing from '../big-img-browsing'
import './index.scss'

import Enlarge from './fangda.png';
import Narrow from './suoxiao.png';
import Scale from './xuanzhuan.png';

const TransformType = ['rotate', 'scale'];
const ModalWidth = 0.8 * document.body.clientWidth;
const ModalHeight = 0.8 * document.body.clientHeight;

class SamplePrevArrow extends React.Component {
    render() {
        const {cn, style, onClick} = this.props;
        return (
            <div className='img-arrow img-arrow-prev' onClick={onClick}>
                <Icon type='left' style={{fontSize: 20, color: 'white'}}/>
            </div>
        );
    }
}

class SampleNextArrow extends React.Component {
    render() {
        const {cn, style, onClick} = this.props;
        return (
            <div className='img-arrow img-arrow-next' onClick={onClick}>
                <Icon type='right' style={{fontSize: 20, color: 'white'}}/>
            </div>
        );
    }
}

class PicturesWall extends React.Component {
    static propTypes = {
        defaultFileList: PropTypes.array,
        disabled: PropTypes.bool,
        componentsIndex: PropTypes.number,
        componentsStyle: PropTypes.string,
        onPicturesWallChange: PropTypes.func,
        isDelete: PropTypes.bool,
    };

    static defaultProps = {
        defaultFileList: [],
        disabled: false,
        componentsIndex: 0,
        componentsStyle: '',
        isDelete: true,
        onPicturesWallChange: () => {
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            multiple: true,
            nextProps: [],
            carouselList: [],
            carouseCurrentIndex: 0,
            transformRotate: 0,
            transformScale: 1,
            transformType: null,
            dragEndOffset: {ex: null, ey: null},
            curImageIndex: 0,
            bigImgVisible: false
        };
        this.dragStartOffset = {sx: null, sy: null};

    }

    componentDidMount() { //预加载数据
        console.log(this.props)
        // this.fileListChange()
    }

    componentWillReceiveProps(nextProps) { //组件接收到新的props时调用
        console.log(nextProps.defaultFileList)
        console.log(8888888888888888888)
        if (nextProps.defaultFileList != this.state.nextProps && nextProps.defaultFileList) {
            if (nextProps.defaultFileList.length > 0 && nextProps.defaultFileList[0] != "") {
                this.setState({
                    nextProps: nextProps.defaultFileList
                })
                this.fileListChange(nextProps)
            }
        }
    }

    fileListChange = (nextProps) => {
        this.setState({
            fileList: nextProps.defaultFileList
        }, function () {
            console.log(this.state.fileList)
        })
    }
    handleCancel = () => {
        this.setState({previewVisible: false, previewImage: ''});
        this._onAfterChange(this.state.carouseCurrentIndex);
    };

    handlePreview = (file) => {

        const {fileList} = this.state;
        console.log('fileList:', fileList)
        let goToIndex = null;
        if (fileList.length > 0) {
            fileList.forEach((item, index) => {
                if (item.uid === file.uid) {
                    goToIndex = index;
                }
            });
        }

        this.setState({
            previewImage: file['bigUrl'] || file.url || file.thumbUrl,
            previewVisible: true,
            carouselList: fileList,
            curImageIndex: goToIndex
        }, () => {
            this.slider && this.slider.innerSlider.slickGoTo(goToIndex);
        });
    };

    handleChange = ({fileList, file}) => {
        console.log('fileList', fileList);
        console.log('file', file);
        fileList = fileList.filter((file) => {
            return file.status !== undefined;
        });

        file.status === 'error' ? message.error('上传失败！') : null;

        if (file.response) {
            if (file.status !== 'removed' && !file.response.success) {
                message.error('上传失败！')
            }
        }

        if (file.status !== 'error' && file.status) {
            this.props.onPicturesWallChange(fileList, this.props.componentsIndex, this.props.componentsStyle, file.status);
            if (file.status === 'done' && file.response.success && file.response.data) {
                const arr = this._imgDataFormat([file.response.data]);
                fileList.forEach((t, index) => {
                    if (t.uid && (t.uid === file.uid)) {
                        fileList[index] = {...arr[0]};
                    }
                });
            } else if (file.status === 'done' && !file.response.success) {
                fileList = fileList.filter((file) => {
                    return file.response.success;
                });
            }
        }

        this.setState({
            fileList: [...fileList],
        });

        // console.log(fileList[fileList.length-1].response)
    };
    beforeUpload = (file) => { //上传前控制图片的格式和大小
        console.log('eee:', file)
        // const isJPG = file.type === 'image/jpeg';
        // if (!isJPG) {
        //   message.error('You can only upload JPG file!');
        // }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('文件必须小于10M！')
        }
        // return isJPG && isLt2M;
        return isLt2M;
    };

    _onNextPress = () => {

    };

    _onPrevPress = () => {

    };

    _onTransformRotate = (type) => {
        let transformRotate = this.state.transformRotate;
        if (type === '1') {
            transformRotate += 90;
        } else if (type === '2') {
            transformRotate -= 90;
        }
        this.setState({
            transformRotate,
            transformType: TransformType[0],
        });
    };

    _onAfterChange = (current) => {
        this.setState(preState => ({
            carouseCurrentIndex: current,
            transformRotate: preState.carouseCurrentIndex !== current ? 0 : preState.transformRotate,
            transformScale: preState.carouseCurrentIndex !== current ? 1 : preState.transformScale,
            dragStartOffset: preState.carouseCurrentIndex !== current ? {sx: null, sy: null} : preState.dragStartOffset,
            dragEndOffset: preState.carouseCurrentIndex !== current ? {ex: null, ey: null} : preState.dragEndOffset,
        }));
    };

    _onTransformScale = (type) => {
        let transformScale = this.state.transformScale;
        if (type === '1') {
            transformScale += 0.1;
        } else if (type === '2') {
            transformScale -= 0.1;
        }
        this.setState({
            transformScale,
            transformType: TransformType[1],
        });
    };


    _onDragStart = (domId, index, event) => {
        const img = document.getElementById(domId);
        const {clientX, clientY} = event.nativeEvent;
        const sx = clientX - [img.offsetLeft - index * (ModalWidth - 48)];
        this.dragStartOffset = {sx: sx, sy: clientY - img.offsetTop};
    };

    _onDrag = (domId, index, event) => {

    };

    _onDragEnd = (event) => {
        const {clientX, clientY} = event.nativeEvent;
        this.setState(() => ({
            dragEndOffset: {ex: clientX, ey: clientY},
        }));
    };

    _onRemove = (file) => {
        const {isDelete} = this.props;
        if (!isDelete) {
            return false;
        }
        if (file.response && file.response.data) {
            return true;
        }
        if (file.deletable) {
            return true;
        } else if (file.deletable === false) {
            message.warn('不能删除该图片');
            return false;
        } else {
            return true;
        }
    };

    pictureBrowsingcancel = () => {
        this.setState({
            previewVisible: false
        })
    }

    bigImgcancel = () => {
        this.setState({
            bigImgVisible: false,
            previewVisible: true
        })
    }

    bigImgShowDo = (index, url) => {
        this.setState({
            bigImgUrl: url,
            curImageIndex: index,
            bigImgVisible: true
        })
    }

    _imgDataFormat = (imgDataJson) => {
        let imgDataArr = [];
        for (let item of imgDataJson) {
            imgDataArr.push({
                url: item[imgUrl.small] ? item[imgUrl.small] : '',
                bigBUrl: item[imgUrl.bigB] ? item[imgUrl.bigB] : '',
                bigUrl: item[imgUrl.big] ? item[imgUrl.big] : '',
                uid: `${item.fileName}${Math.random()}`,
                status: 'done',
            });
        }
        return imgDataArr;
    };

    render() {
        const {
            bigImgVisible, previewVisible, transformRotate, carouseCurrentIndex, transformScale, multiple, dragEndOffset,
        } = this.state;

        const {isDelete} = this.props;
        console.log('this.state.fileList', this.state.fileList);

        const settings = {
            dots: false,
            arrows: true,
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            adaptiveHeight: false,
            nextArrow: <SampleNextArrow onClick={this._onNextPress}/>,
            prevArrow: <SamplePrevArrow onClick={this._onPrevPress}/>,
        };

        return (
            <div className="clearfix">
                {
                    this.state.fileList.length > 0 ?
                        <div className={isDelete ? null : 'show'}>
                            <Upload
                                action={`${apiUrl}${api.imgUpload}?token=${session.get('token')}`}
                                listType="picture-card"
                                fileList={this.state.fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                                beforeUpload={this.beforeUpload}
                                name="attach"
                                multiple={multiple}
                                onRemove={this._onRemove}
                            >
                                {this.props.disabled ? null : <div>
                                    <Icon type="plus"/>
                                    <div className="ant-upload-text">{`上传（<10M）`}</div>
                                </div>}
                            </Upload>
                        </div>
                        :
                        <div className={isDelete ? null : 'show'}>
                            <Upload
                                action={`${apiUrl}${api.imgUpload}?token=${session.get('token')}`}
                                listType="picture-card"
                                fileList={this.state.fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChange}
                                beforeUpload={this.beforeUpload}
                                name="attach"
                                multiple={multiple}
                            >
                                {this.props.disabled ? null :
                                    <div>
                                        <Icon type="plus"/>
                                        <div className="ant-upload-text">{`上传（<10M）`}</div>
                                    </div>}
                            </Upload>
                        </div>
                }
                {previewVisible &&
                <PictureBrowsing curImageIndex={this.state.curImageIndex} imgList={this.state.carouselList}
                                 pictureBrowsingcancel={this.pictureBrowsingcancel.bind(this)}
                                 bigImgShowDo={this.bigImgShowDo.bind(this)}/>
                }
                {bigImgVisible &&
                <BigImgBrowsing bigImgUrl={this.state.bigImgUrl} bigImgcancel={this.bigImgcancel.bind(this)}/>
                }
                <Modal
                    footer={null}
                    onCancel={this.handleCancel}
                    visible={false}
                    bodyStyle={{overflow: 'hidden'}}
                    width={`${ModalWidth}px`}
                >
                    <div className='button'>
                        <div className='b' onClick={() => this._onTransformRotate('1')}>
                            <img src={Scale}/>
                        </div>
                        {/*<div className='b' onClick={() => this._onTransformRotate('2')}>-90deg</div>*/}
                        <div className='b' onClick={() => this._onTransformScale('1')}>
                            <img src={Enlarge}/>
                        </div>
                        <div className='b' onClick={() => this._onTransformScale('2')}>
                            <img src={Narrow}/>
                        </div>
                    </div>
                    <Carousel
                        {...settings}
                        ref={slider => (this.slider = slider)}
                        afterChange={this._onAfterChange}
                    >
                        {
                            this.state.carouselList.map((item, index) => {
                                const url = item.bigUrl || item.url || item.thumbUrl;
                                const sRotate = `rotate(${transformRotate}deg)`;
                                const sScale = `scale(${transformScale})`;
                                let sTop = 0;
                                let sLeft = 0;
                                const {sx, sy} = this.dragStartOffset;
                                const {ex, ey} = dragEndOffset;
                                if (sx !== null && sy !== null && ex !== null && ey !== null) {
                                    sLeft = ex - sx;
                                    sTop = ey - sy;
                                }

                                const sty = carouseCurrentIndex === index ? {
                                    transform: `${sRotate} ${sScale}`,
                                    top: `${sTop}px`,
                                    left: `${sLeft}px`
                                } : null;

                                return (
                                    <div key={item.uid} className='img-container'>
                                        <img
                                            id={item.uid}
                                            alt="图片"
                                            src={url}
                                            draggable={true}
                                            onDrag={(e) => this._onDrag(item.uid, index, e)}
                                            onDragStart={(e) => this._onDragStart(item.uid, index, e)}
                                            onDragEnd={this._onDragEnd}
                                            style={sty}

                                        />
                                    </div>
                                )
                            })
                        }
                    </Carousel>
                </Modal>
            </div>
        );
    }
}

export default PicturesWall
