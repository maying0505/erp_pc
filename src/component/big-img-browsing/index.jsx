import React from 'react';
import PropTypes from 'prop-types';
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import './index.less';

class BigImgBrowsing extends React.Component {
    static propTypes = {
        bigImgUrl: PropTypes.string,
        bigImgcancel: PropTypes.func,
    };

    static defaultProps = {
        bigImgUrl: '',
        bigImgcancel: () =>{}
    };
    constructor(props) {
        super(props);
        this.state = {
            show: 'block',
            viewer: {},
        }
    }
    componentDidMount() { //预加载数据
        console.log(this.props)
        const that = this
        const viewer = new Viewer(document.getElementById('image'), {
            title: false,
            toolbar: {
                zoomIn: 4,
                zoomOut: 4,
                oneToOne: 4,
                reset: 4,
                prev: 0,
                play: {
                  show: 0,
                },
                next: 0,
                rotateLeft: 4,
                rotateRight: 4,
                flipHorizontal: 4,
                flipVertical: 4,
              },
            next: false,
            navbar: false,
            hide() {
                that.props.bigImgcancel()
            },
        });
        viewer.show();
        this.setState({
            viewer: viewer,
            show: 'none'
        })
    }

    render() {
        return (
            <div>
                <img id="image"  style={{display: this.state.show}} src={this.props.bigImgUrl} />
            </div>
        );
    }
}
export default BigImgBrowsing
