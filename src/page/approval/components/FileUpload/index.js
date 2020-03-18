import React from 'react';
import PropTypes from 'prop-types';
import {Upload, Icon, message,} from 'antd';

import './index.less';

import {request, apiUrl} from 'common/request/request';
import {session} from 'common/util/storage';
import DownloadFile from 'common/util/downloadFile';
import api from 'common/util/api';
import PictureBrowsing from '../../../../component/picture-browsing';

const FileType = ['image', 'file'];
const BusinessType = ['inst', 'task'];

class PicturesWall extends React.Component {
    static propTypes = {
        defaultFileList: PropTypes.array,
        disabled: PropTypes.bool,
        componentsIndex: PropTypes.number,
        componentsStyle: PropTypes.string,
        onPicturesWallChange: PropTypes.func,
        isDelete: PropTypes.bool,
        showUploadList: PropTypes.shape({
            showPreviewIcon: PropTypes.bool,
            showRemoveIcon: PropTypes.bool,
        }),
        businessId: PropTypes.string.isRequired,
        businessType: PropTypes.oneOf(BusinessType).isRequired,
        fileType: PropTypes.oneOf(FileType).isRequired,
        fileName: PropTypes.string.isRequired,
        action: PropTypes.string.isRequired,
    };

    static defaultProps = {
        showUploadList: {
            showPreviewIcon: false,
            showRemoveIcon: false,
        },
        defaultFileList: [],
        disabled: false,
        componentsIndex: 0,
        componentsStyle: '',
        isDelete: true,
        onPicturesWallChange: () => null,
        fileType: FileType[0],
    };

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            multiple: true,
            carouselList: [],
            curImageIndex: 0,
            pictureBrowsingVisible: false,
            bigImageVisible: false,
            bigImageUrl: null,
        };
    }

    componentDidMount() {
        const {defaultFileList} = this.props;
        if (defaultFileList.length > 0) {
            this.fileListChange(defaultFileList);
            this._setFieldsValue();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultFileList !== this.props.defaultFileList) {
            this.fileListChange(nextProps.defaultFileList);
        }
    }

    _imageRemove = (id, fileList) => {
        request(`${api.deleteFile}${id}`, {}, 'get', session.get('token'))
            .then(res => {
                let msg = '';
                if (res.success) {
                    fileList = fileList.filter((file) => {
                        if (file.response) {
                            if (file.response.success) {
                                file.thumbUrl = file.response.data.pathThumbFileName;
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return true;
                        }
                    });
                    msg = res.message ? res.message : '删除成功';
                    console.log('delete fileList', fileList);
                    this.setState({
                        fileList
                    });
                } else {
                    msg = res.message ? res.message : '删除失败';
                }
                message.info(msg);
            })
            .catch(err => {
                message.error('请求服务异常');
            });
    };

    fileListChange = (fileArr) => {
        const fileList = this._imgDataFormat(fileArr);
        this.setState({fileList});
    };

    handlePreview = (file) => {
        const {fileType} = this.props;
        if (fileType === FileType[0]) {
            const {fileList} = this.state;
            let goToIndex = null;
            if (fileList.length > 0) {
                fileList.forEach((item, index) => {
                    if (item.uid === file.uid) {
                        goToIndex = index;
                    }
                });
            }
            this.setState({
                pictureBrowsingVisible: true,
                carouselList: fileList,
                curImageIndex: goToIndex,
            });
        } else if (fileType === FileType[1]) {
            const {uid} = file;
            const fileUrl = `${apiUrl}${api.downEnclosure}${uid}`;
            this._onDownloadFile(fileUrl);
        }
    };

    _onDownloadFile = (fileUrl = undefined) => {
        if (!fileUrl) {
            return;
        }
        DownloadFile(fileUrl);
    };

    handleChange = ({fileList, file, event}) => {
        console.log('fileList:', fileList);
        console.log('file:', file);
        fileList = fileList.filter((file) => {
            return file.status !== undefined;
        });

        console.log('new fileList:', fileList);

        if (file.status === 'removed') {
            if (file.uid) {
                this._imageRemove(file.uid, fileList);
            }
        } else {
            if (file.status === 'error' || (!file.response && file.status === 'done') || (file.response && !file.response.success)) {
                let msg = '上传失败！';
                if (file.response.message) {
                    msg = file.response.message;
                }
                message.error(msg);
            }
            fileList = fileList.filter((file) => {
                if (file.response) {
                    if (file.response.success) {
                        file.thumbUrl = file.response.data.pathThumbFileName;
                        file.uid = file.response.data.id;
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            });
        }

        this.setState({
            fileList
        });

        file.status !== 'error' && file.status ? this.props.onPicturesWallChange(fileList, this.props.componentsIndex, this.props.componentsStyle, file.status) : null

        if (fileList.length > 0) {
            this._setFieldsValue();
        }
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
        console.log('isLt2M', isLt2M);
        return isLt2M;
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

    pictureBrowsingCancel = () => {
        this.setState({
            pictureBrowsingVisible: false,
        })
    };

    BigImageShow = (index, url) => {
        console.log('index', url);
        this.setState({
            bigImageUrl: url,
            curImageIndex: index,
            bigImageVisible: true,
        }, () => {
            console.log(this.state);
        });
    };

    BigImageHide = () => {
        this.setState({
            bigImageVisible: false,
            pictureBrowsingVisible: true,
        });
    };

    _imgDataFormat = (imgArr) => {
        let imgDataArr = [];
        for (let item of imgArr) {
            imgDataArr.push({
                status: 'done',
                uid: item.uid,
                fileType: item.fileType,
                name: item.fileOrginName,
                thumbUrl: item.mixFilePath,
                url: item.mixFilePath ? item.mixFilePath : '',
                bigBUrl: item.filePath ? item.filePath : '',
                bigUrl: item.middleFilePath ? item.middleFilePath : '',
            });
        }
        return imgDataArr;
    };

    _setFieldsValue = () => {
        const {form: {setFieldsValue}, fileName} = this.props;
        setFieldsValue({[fileName]: true});
    };

    render() {
        const {
            pictureBrowsingVisible,
            carouselList,
            multiple,
            fileList,
            curImageIndex,
            bigImageVisible,
            bigImageUrl,
        } = this.state;

        const {
            isDelete,
            disabled,
            businessId,
            businessType,
            fileType,
            fileName,
            form: {getFieldDecorator},
            action,
            isRequired,
            label,
        } = this.props;

        const showUploadList = {
            showPreviewIcon: true,
            showRemoveIcon: isDelete,
        };

        const listType = fileType === FileType[0] ? 'picture-card' : 'text';
        console.log('fileUploader this.props', this.props);
        console.log('this.state', this.state);
        return (
            <div className="clearfix flex-1">
                {
                    getFieldDecorator(fileName, {
                        rules: [
                            {required: isRequired, message: `*${label}必填`}
                        ]
                    })(
                        <div/>
                    )
                }
                <Upload
                    action={`${apiUrl}${action}?token=${session.get('token')}`}
                    listType={listType}
                    showUploadList={showUploadList}
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    beforeUpload={this.beforeUpload}
                    data={{businessId: businessId, businessType: businessType, varType: fileName}}
                    name="attach"
                    headers={{token: sessionStorage.getItem('token_y')}}
                    multiple={multiple}
                    onRemove={this._onRemove}
                >
                    {
                        disabled ? null :
                            <div className={fileType === FileType[0] ? '' : 'plus-view'}>
                                <Icon type="plus"/>
                                <div className="ant-upload-text">{`上传（<10M）`}</div>
                            </div>
                    }
                </Upload>
                {
                    pictureBrowsingVisible &&
                    <PictureBrowsing
                        showBigImage={false}
                        imgList={carouselList}
                        curImageIndex={curImageIndex}
                        bigImgShowDo={this.BigImageShow}
                        pictureBrowsingcancel={this.pictureBrowsingCancel}
                    />
                }
            </div>
        );
    }
}

export default PicturesWall
