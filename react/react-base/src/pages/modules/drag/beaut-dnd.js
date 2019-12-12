import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Row, Col, Button, Drawer, Avatar, Icon, Checkbox } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import styles from './beaut-dnd.less';
import userPng from '../../../assets/imgs/user.jpg';
import defaultPng from '../../../assets/imgs/default.png';

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 1,
    margin: `0 8px ${grid}px 0`,
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'white',
    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'white',
    padding: grid,
    // width: '90%',
    display: 'flex',
    flexFlow: 'row wrap',
});
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

class Permission extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            includeModules: {},
            excludeModules: {},
            visible: false
        }
    }
    componentDidMount() {
        let iModules = this.divideModules(getItems(12, 20));
        let eModules = this.divideModules(getItems(12, 50));
        this.setState({
            includeModules: {
                ...iModules
            },
            excludeModules: {
                ...eModules
            }
        });
    }

    showDrawer = () => {
        this.setState({
            visible: true
        });
    }

    onClose = () => {
        this.setState({
            visible: false
        });
    }

    mouseEnter = (currentId) => {
        this.setState({
            currentBox: currentId
        });
    }

    mouseLeave = () => {
        this.setState({
            currentBox: ''
        });
    }

    // 把接入模块按照一行n个切分
    divideModules = (modules, numPerRow) => {
        numPerRow = numPerRow || 5;
        let num = modules.length,
            rows = _.ceil(num / numPerRow);
        let result = {};
        for (let i = 0; i < rows; i++) {
            result[`row${i}`] = _.slice(modules, i * numPerRow, i * numPerRow + numPerRow);
        }

        return result;
    }

    // 把切分过的模块的对象(row0, row1等)合并成一个数组
    mergeModules = (rowModules) => {
        let result = [];
        _.each(rowModules, (row) => {
            result = _.concat(result, row);
        });

        return result;
    }

    // 从includeModules, excludeModules中获取某一行的modules
    getModulesByRow = (allModules, num) => {
        return allModules[`row${num}`] || [];
    }

    // 判断是已添加还是未添加模块
    getDroppableType = (droppableId) => {
        // 0 未添加, 1 已添加 
        if (_.startsWith(droppableId, 'include-droppable')) {
            return 1;
        } else {
            return 0;
        }
    }

    // 同一行的模块左右移动交换顺序
    reOrder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    // 跨行的模块位置交换, 分为未添加模块内部、已添加模块内部、未添加与已添加之间交互
    move = (sourceId, destinationId, droppableSource, droppableDestination) => {
        let { includeModules, excludeModules } = this.state;
        // 已添加模块内部
        if (_.startsWith(droppableSource.droppableId, 'include') && _.startsWith(droppableDestination.droppableId, 'include')) {
            let sourceModules = this.getModulesByRow(includeModules, sourceId),
                destModules = this.getModulesByRow(includeModules, destinationId);
            const [removed] = sourceModules.splice(droppableSource.index, 1);
            destModules.splice(droppableDestination.index, 0, removed);
        }
        // 未添加模块内部
        else if (_.startsWith(droppableSource.droppableId, 'exclude') && _.startsWith(droppableDestination.droppableId, 'exclude')) {
            let sourceModules = this.getModulesByRow(excludeModules, sourceId),
                destModules = this.getModulesByRow(excludeModules, destinationId);
            const [removed] = sourceModules.splice(droppableSource.index, 1);
            destModules.splice(droppableDestination.index, 0, removed);
        }
        // 已添加和为添加之间交互
        else if (_.startsWith(droppableSource.droppableId, 'exclude') && _.startsWith(droppableDestination.droppableId, 'include')) {
            let sourceModules = this.getModulesByRow(excludeModules, sourceId),
                destModules = this.getModulesByRow(includeModules, destinationId);
            const [removed] = sourceModules.splice(droppableSource.index, 1);
            destModules.splice(droppableDestination.index, 0, removed);
        }
        else if (_.startsWith(droppableSource.droppableId, 'include') && _.startsWith(droppableDestination.droppableId, 'exclude')) {
            let sourceModules = this.getModulesByRow(includeModules, sourceId),
                destModules = this.getModulesByRow(excludeModules, destinationId);
            const [removed] = sourceModules.splice(droppableSource.index, 1);
            destModules.splice(droppableDestination.index, 0, removed);
        }

        return {
            includeModules: this.divideModules(this.mergeModules(includeModules)),
            excludeModules: this.divideModules(this.mergeModules(excludeModules))
        };
    };

    handleClickModule = (sourceId, index, type) => {
        let { includeModules, excludeModules } = this.state;
        // 点击添加
        if (type === 'exclude') {
            let sourceModules = this.getModulesByRow(excludeModules, sourceId),
                destModules = this.getModulesByRow(includeModules, _.size(includeModules) - 1);
            const [removed] = sourceModules.splice(index, 1);
            destModules.splice(destModules.length, 0, removed);
            this.setState({
                includeModules: this.divideModules(this.mergeModules(includeModules)),
                excludeModules: this.divideModules(this.mergeModules(excludeModules))
            });
        }
        // 点击移除
        if (type === 'include') {
            let sourceModules = this.getModulesByRow(includeModules, sourceId),
                destModules = this.getModulesByRow(excludeModules, _.size(excludeModules) - 1);
            const [removed] = sourceModules.splice(index, 1);
            destModules.splice(destModules.length, 0, removed);
            this.setState({
                includeModules: this.divideModules(this.mergeModules(includeModules)),
                excludeModules: this.divideModules(this.mergeModules(excludeModules))
            });
        }
    }

    // 拖拽结束回调函数
    onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        const reg = /\d+/g;
        let { includeModules, excludeModules } = this.state;

        // 同一行的模块交换位置
        if (source.droppableId === destination.droppableId) {
            let dropType = this.getDroppableType(source.droppableId);
            let id = source.droppableId.match(reg) ? parseInt(source.droppableId.match(reg)[0]) : null;
            if (dropType === 1) {
                let modules = this.getModulesByRow(includeModules, id);
                let newModules = this.reOrder(modules, source.index, destination.index);
                includeModules[`row${id}`] = newModules;

                this.setState({
                    includeModules: includeModules
                });
            }
            if (dropType === 0) {
                let modules = this.getModulesByRow(excludeModules, id);
                let newModules = this.reOrder(modules, source.index, destination.index);
                excludeModules[`row${id}`] = newModules;

                this.setState({
                    excludeModules: excludeModules
                });
            }
        } else {
            let sourceId = source.droppableId.match(reg) ? parseInt(source.droppableId.match(reg)[0]) : null;
            let destId = destination.droppableId.match(reg) ? parseInt(destination.droppableId.match(reg)[0]) : null;
            let moveResult = this.move(
                sourceId,
                destId,
                source,
                destination
            );

            this.setState({
                includeModules: moveResult.includeModules,
                excludeModules: moveResult.excludeModules
            });
        }
    };

    render() {
        const { user, avatar, } = this.props;
        const { includeModules, excludeModules, currentBox, visible } = this.state;

        const reg = /\d+/g;
        let includeDroppable = _.map(includeModules, (row, key) => {
            // 从字符串row0, row1中的到索引顺序
            let id = key.match(reg) ? parseInt(key.match(reg)[0]) : null;
            return (
                <Droppable key={`include-droppable-${id}`} droppableId={`include-droppable-${id}`} direction='horizontal'>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {
                                row.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}>
                                                <div className={styles.modulebox}
                                                    onMouseEnter={this.mouseEnter.bind(this, item.id)}
                                                    onMouseLeave={this.mouseLeave.bind(this, item.id)}>
                                                    <img src={defaultPng} />
                                                    <span className={styles.moduletext}>{item.content}</span>
                                                    {
                                                        currentBox === item.id &&
                                                        <span  style={{ color: '#D92E2E' }} className={styles.moduledelete} onClick={this.handleClickModule.bind(this, id, index, 'include')}>
                                                            <Icon type='delete' /> 移除
                                                            </span>
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            );
        });
        let excludeDroppable = _.map(excludeModules, (row, key) => {
            // 从字符串row0, row1中的到索引顺序
            let id = key.match(reg) ? parseInt(key.match(reg)[0]) : null;
            return (
                <Droppable key={`exclude-droppable-${id}`} droppableId={`exclude-droppable-${id}`} direction='horizontal'>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {
                                row.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}>
                                                <div className={styles.modulebox}
                                                    onMouseEnter={this.mouseEnter.bind(this, item.id)}
                                                    onMouseLeave={this.mouseLeave.bind(this, item.id)}>
                                                    <img src={userPng} />
                                                    <span className={styles.moduletext}>{item.content}</span>
                                                    {
                                                        currentBox === item.id &&
                                                        <span style={{ color: '#1890ff' }} className={styles.moduleadd} onClick={this.handleClickModule.bind(this, id, index, 'exclude')}>
                                                            <Icon type='plus'/> 添加
                                                            </span>
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            );
        });
        return (
            <div>
                <Button style={{ margin: '10px' }}type='primary' onClick={this.showDrawer}> 打开弹框 </Button>
                <Drawer
                    title='个人中心'
                    width={640}
                    onClose={this.onClose.bind(this)}
                    visible={visible}>

                    <div className={styles.avatar_box}>
                        <Row type='flex' justify='start' className={styles.avatar_info}>
                            <Col span={2}><Avatar src={avatar || userPng} size='large' className={styles.avatar} /></Col>
                            <Col span={10}>
                                <Row><Col><span className={styles.avatar_user}>{user.name}</span>{user.id}</Col></Row>
                                <Row><Col>{user.orgName}</Col></Row>
                            </Col>
                        </Row>
                    </div>
                    <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
                        <div>
                            <h3>管理</h3>
                            <div>
                                <h4>已添加</h4>
                                {includeDroppable}
                            </div>
                            <div className={styles.clear} >
                                <h4>未添加</h4>
                                {excludeDroppable}
                            </div>
                        </div>
                    </DragDropContext>
                </Drawer>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        avatar: state.avatar
    }
}

Permission = Form.create()(Permission);
export default connect(mapStateToProps)(Permission);
