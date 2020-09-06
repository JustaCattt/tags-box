import React, { Component } from 'react';
import { Tag, Input, Popover, Button, Radio, Menu, } from "antd";
import { PlusOutlined, PlusCircleOutlined, PlusCircleTwoTone, EditOutlined, } from "@ant-design/icons";
import 'antd/dist/antd.css';
import '../assets/tags.css';
import axios from 'axios';

//是否连接后端
const isConnect = false;

//定义预选颜色
const Color = ['red', 'orange', 'yellow', 'green', 'blue', '#666699']

//Tags组件
export default class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: [
                {
                    tagName: 'JustaCat',//标签名字
                    tagColor: Color[0],//标签颜色
                    tagCloseShow: false,//标签关闭按钮显示与否
                },
                {
                    tagName: '前端',
                    tagColor: Color[1],
                    tagCloseShow: false,
                },
                {
                    tagName: 'React',
                    tagColor: Color[2],
                    tagCloseShow: false,
                }
            ],
            inputVisible: false,//输入框显示
            inputValue: '',//输入值
            isInputing: false,//是否正在输入
            checkedColor: Color[0],//选中色，默认一号色
            match: false,//是否匹配到对应标签的一个标志
            matchTag: {},//所匹配到的标签
            createTagShow: {
                display: "none"//创建窗口显示与否
            },
            editVisible: {
                display: "none"//编辑窗口显示与否
            },
            flag: false,
        }
    }
    // componentWillUpdate = () => {

    // }
    // componentWillMount = () => {
    //     if (this.state.flag) {
    //         this.getTagInfo()
    //     }
    // }

    /*该区域为对接后端接口的方法*/
    getTagInfo = () => {
        var { tags } = this.state;
        console.log(tags)
        axios({
            url: "http://localhost:8080/get",
            method: "get",
        }).then((res) => {
            console.log('获取到的信息');
            console.log(res.data);
        })
    }
    sendTagInfo = (newTag) => {
        var { tags } = this.state;
        const params = {
            type: 'add',
        }
        console.log(tags)
        console.log(params)
        console.log(JSON.stringify(newTag))
        axios({
            url: "http://localhost:8080/add",
            method: "post",
            params: params,
            data: JSON.stringify(newTag),
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        }).then((res) => {
            console.log(res.data);
            if (res.data.state) {
                this.setState({
                    flag: true
                })
                console.log('send完成')
            }
        })
    }
    updateTagInfo = (tag) => {

    }
    deleteTagInfo = (tag) => {

    }

    //实现关闭事件
    handleClose = () => {
        let removedTag = this.state.matchTag;
        console.log(removedTag)
        // const { tags } = this.state;
        let tags = this.state.tags.filter((tag) => tag !== removedTag);
        // tags.splice(tags.indexOf(removedTag),1);
        console.log('删除后的标签数组内容为');
        tags.forEach((item) => {
            console.log(item)
        })
        this.setState({
            tags: [...tags],
            editVisible: {
                display: "none"
            },
        });//解构实现实时更新完整的视图
    };
    //显示输入框
    showInput = () => {
        this.setState({ inputVisible: true });
    }
    //劫持输入改变
    handleInputChange = (e) => {
        let tagsNameList = []
        this.state.tags.forEach((item) => {
            tagsNameList.push(item.tagName)
        })
        let { tags } = this.state;
        if (this.tagIsExist(e.target.value)) {
            console.log(tags[tagsNameList.indexOf(e.target.value)])
            let matchTag = tags[tagsNameList.indexOf(e.target.value)]
            this.setState({
                match: true,
                matchTag: matchTag
            })
        }
        if (e.target.value === '') {
            this.setState({
                match: false,
                matchTag: {},
                isInputing: false
            })
        } else {
            this.setState({
                inputValue: e.target.value,
                isInputing: true
            });
        }
    }
    //判断标签是否已存在
    tagIsExist = (tagName) => {
        let tagsNameList = []
        this.state.tags.forEach((item) => {
            tagsNameList.push(item.tagName)
        })
        if (tagsNameList.indexOf(tagName) === -1) {
            return false;
        } else {
            return true;
        }
    }
    //根据标签名返回标签数组中的对象
    findTagByName = (tagName) => {
        let tagsNameList = []
        this.state.tags.forEach((item) => {
            tagsNameList.push(item.tagName)
        })
        return this.state.tags[tagsNameList.indexOf(tagName)];
    }
    //创建标签
    createTag = () => {
        const { inputValue, checkedColor } = this.state;
        let { tags } = this.state;
        console.log(tags)
        console.log('inputValue = ' + inputValue);
        console.log('checkedColor = ' + checkedColor);
        let newTag = {
            tagName: inputValue,
            tagColor: checkedColor,
            tagCloseShow: false
        }
        if (isConnect) {
            this.sendTagInfo(newTag)
        } else {
            console.log('新标签：')
            console.log(newTag)
            if (!this.tagIsExist(newTag.tagName)) {
                tags = [...tags, newTag];//解构赋值
            }
            this.setState({
                tags,
                inputVisible: false,
                inputValue: "",
                //恢复预选色
                checkedColor: Color[0],
                createTagShow: {
                    display: "none"
                }
            });
        }
    }
    //定义防抖
    debounce = (fn, wait) => {
        let timeout = null;
        return function () {
            if (timeout !== null) clearTimeout(timeout);
            timeout = setTimeout(fn, wait)
        }
    }
    //颜色选择与更改事件方法
    handleColorChange = e => {
        console.log('current color = ' + e.target.value);
        this.setState({
            checkedColor: e.target.value
        })
    }
    //响应编辑点击事件
    editTagShow = () => {
        let { matchTag } = this.state;
        console.log('当前需要编辑的tag为')
        console.log(matchTag)
        this.setState({
            editVisible: {
                display: ""
            },
        })
    }
    //确认修改
    handleConfirm = () => {
        let { tags, matchTag, checkedColor, inputValue } = this.state;
        matchTag.tagName = inputValue;
        matchTag.tagColor = checkedColor;
        matchTag.tagCloseShow = false;
        console.log('匹配项编辑后为')
        console.log(matchTag);
        tags.splice(tags.indexOf(matchTag), 1, matchTag);
        console.log('修改后的tags数组为');
        console.log(tags);
        this.setState({
            tags,
            editVisible: {
                display: "none"
            },
            // 以下为：设置编辑后自动将搜索输入气泡隐藏，按需更改，我这里先注释掉
            // inputVisible: false,
            // inputValue: "",
        })
    }
    render() {
        const {
            tags,
            inputVisible,
            inputValue,
            createTagShow,
            editVisible,
        } = this.state;
        //颜色圈圈样式
        const RadioBtn = (key) => {
            return {
                borderRadius: "50%",
                backgroundColor: Color[key],
                margin: "0 2px",
            }
        }
        //创建标签的窗体
        const CreateTag = (
            <div className="add-newTag" style={createTagShow}>
                <Radio.Group defaultValue="red" style={{ margin: "20px auto" }} onChange={this.handleColorChange}>
                    <Radio.Button value="red" style={RadioBtn(0)} />
                    <Radio.Button value="orange" style={RadioBtn(1)} />
                    <Radio.Button value="yellow" style={RadioBtn(2)} />
                    <Radio.Button value="green" style={RadioBtn(3)} />
                    <Radio.Button value="blue" style={RadioBtn(4)} />
                    <Radio.Button value="#666699" style={RadioBtn(5)} />
                </Radio.Group>
                <Button type="primary" onClick={this.createTag}>创建</Button>
            </div>
        )
        //编辑窗体
        const EditForm = (
            <div className="add-newTag" style={editVisible}>
                <Radio.Group defaultValue="red" style={{ margin: "20px auto" }} onChange={this.handleColorChange}>
                    <Radio.Button value="red" style={RadioBtn(0)} />
                    <Radio.Button value="orange" style={RadioBtn(1)} />
                    <Radio.Button value="yellow" style={RadioBtn(2)} />
                    <Radio.Button value="green" style={RadioBtn(3)} />
                    <Radio.Button value="blue" style={RadioBtn(4)} />
                    <Radio.Button value="#666699" style={RadioBtn(5)} />
                </Radio.Group>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button style={{ width: "48%" }} type="danger" onClick={this.handleClose}>删除</Button>
                    <Button style={{ width: "48%" }} type="primary" onClick={this.handleConfirm}>确定</Button>
                </div>
            </div>
        )
        //搜索到的匹配项(列表)
        const MatchList = (
            <div>
                <Menu>
                    <Menu.Item
                        icon={
                            <EditOutlined
                                onClick={this.editTagShow}
                                style={{ position: "absolute", right: "8px", top: "12px" }} />}
                    >{this.state.matchTag.tagName}
                    </Menu.Item>
                </Menu>
            </div>
        )

        return (
            <div>
                {/* 遍历渲染所有标签 */}
                {tags.map((tag, index) => {
                    // console.log(tag);
                    const tagElem = (<Tag
                        className="tag"
                        key={index}
                        color={tag.tagColor}
                        closable={true}
                        onClose={() => console.log('标签已隐藏')}
                        //控制对应标签关闭按钮的显示与隐藏
                        // onMouseOver={() => {
                        //     // console.log(tags[index])
                        //     let tempTag = tags[index]
                        //     tempTag.tagCloseShow = true;
                        //     tags.splice(index, 1, tempTag);
                        //     this.setState({
                        //         tags
                        //     })
                        // }}
                        // onMouseOut={() => {
                        //     let tempTag = tags[index]
                        //     tempTag.tagCloseShow = false;
                        //     tags.splice(index, 1, tempTag);
                        //     this.setState({
                        //         tags
                        //     })
                        // }}
                    >
                        {tag.tagName}
                    </Tag>)
                    return tagElem;
                })}
                {(
                    <Tag className="site-tag-plus" onClick={this.showInput}>
                        <PlusOutlined />
                    </Tag>
                )}
                {/* 利用inputVisible去控制Popover的显示与隐藏 */}
                {inputVisible && (
                    <Popover
                        content={
                            <div className="add-newTag">
                                <Input
                                    placeholder="搜索标签"
                                    size="large"
                                    suffix={this.state.isInputing ?
                                        <PlusCircleTwoTone onClick={
                                            () => {
                                                if (editVisible.display !== "none") {
                                                } else {
                                                    this.setState({
                                                        createTagShow: {
                                                            display: ""
                                                        }
                                                    })
                                                }
                                            }} /> : <PlusCircleOutlined />}
                                    bordered={false}
                                    onChange={this.handleInputChange}
                                    // 回车和点击icon都会触发创建标签窗体的显示
                                    onPressEnter={() => {
                                        if (editVisible.display !== "none") {
                                        } else {
                                            this.setState({
                                                createTagShow: {
                                                    display: ""
                                                }
                                            })
                                        }
                                    }}
                                    //输入框回退事件
                                    onKeyDown={(e) => {
                                        if (e.keyCode !== 13) {
                                            this.setState({
                                                createTagShow: {
                                                    display: "none"
                                                },
                                                editVisible: {
                                                    display: "none"
                                                }
                                            })
                                        }
                                    }}
                                />
                                {/* 均用三元运算符去控制输入框截取输入数据后的显示变化 */}
                                {this.tagIsExist(inputValue) && (createTagShow.display === "none") && editVisible.display === "none" ? MatchList : (<div></div>)}
                                {createTagShow.display !== "none" ? CreateTag : (<div></div>)}
                                {editVisible.display !== "none" ? EditForm : (<div></div>)}
                            </div>
                        }
                        trigger="click"
                        visible="true"
                    // 默认显示气泡卡片组件
                    >
                    </Popover>
                )}
            </div>
        )
    }
}

