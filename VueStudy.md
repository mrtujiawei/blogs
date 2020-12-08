# Vue study #

## 单向数据绑定 ? ##

```javascript

/**
 * 简单实现Vue
 * 现在要做的功能
 * 只有现实已经存在的数据
 * 不包括双向数据绑定和刷新
 */
class Vue {
    constructor(options) {
        this.el = this.getElement(options.el);
        this.data = this.getData(options.data);
        new Compile(this.el, this);
    }

    /**
     * 获取元素
     * @param el
     * @returns {any}
     */
    getElement(el) {
        return util.isString(el) ? document.querySelector(el) : el;
    }

    /**
     * 获取data属性
     * @param data
     * @returns {*}
     */
    getData(data) {
        return util.isFunction(data) ? data() : data;
    }
}

/**
 * 只编译一层dom节点
 */
class Compile {
    /**
     * 编译准备
     * @param el
     * @param vm
     */
    constructor(el, vm) {
        this.vm = vm;
        let fragment = document.createDocumentFragment();
        while (el.firstChild) {
            fragment.appendChild(el.firstChild);
        }
        this.fragment = fragment;
        this.compile(this.fragment);
        el.appendChild(fragment);
    }

    /**
     * 正式开始编译
     * @param fragment
     */
    compile(fragment) {
        fragment.childNodes.forEach(node => {
            if (node.hasChildNodes()) {
                this.compile(node);
            }
            // 处理文本属性
            // 需要改属性，直接改node.data
            if (node.nodeType == 3) {
                // 去掉所有的空格
                node.data = node.data.replace(/[ \n]*/g, '');
                this.compileText(node);
            }

            // 处理元素属性
            if (node.attributes && node.attributes.length) {
                this.compileElement(node);
            }
        });
    }

    /**
     * 编译dom节点
     * @param node
     */
    compileElement(node) {
        let attributes = node.attributes;
        const filter = config.compileConfig.filterAttributes;
        let attribute;
        for (let i = 0; i < attributes.length; i++) {
            attribute = attributes[i];
            if (filter[attribute.name]) {
                continue;
            }
            if (attribute.name == 'v-for') {
                node.removeAttribute(attribute.name);
                let list = util.getData(this.vm, attribute.value.split(' ').pop().split('.'));
                let propName = attribute.value.split(' ').shift();
                let originNode = node;
                list.forEach((item, idx) => {
                    let newNode = originNode.cloneNode(true);
                    node.parentNode.appendChild(newNode);
                    newNode.childNodes.forEach(node => {
                        node.data = node.data.replace(util.pattern(), $1 => {
                            let props = $1.substring(2, $1.length - 2).replace(util.getPropReplaceReg(propName), '');
                            let data = util.getData({
                                data: item,
                            }, props.split('.'));
                            return data || node.data;
                        });
                    });
                });
                originNode.remove();
            }
            if (attribute.name == 'v-show') {
                if (!util.getData(this.vm, attribute.value.split('.'))) {
                    node.style.display = 'none';
                }
            }
            if (attribute.name == 'v-if') {
                if (!util.getData(this.vm, attribute.value.split('.'))) {
                    node.remove();
                }
            }
            node.removeAttribute(attribute.name);
        }
    }


    /**
     * 编译文本节点
     * @param node
     */
    compileText(node) {
        if (node.data && util.pattern().test(node.data)) {
            node.data = node.data.replace(util.pattern(), $1 => {
                let props = $1.substring(2, $1.length - 2);
                let data = util.getData(this.vm, props.split('.'));
                return data || $1;
            });
        }
    }


}

/**
 * 工具
 * @type {{}}
 */
const util = {
    isString(val) {
        return typeof val == typeof '';
    },
    isFunction(val) {
        return typeof val == typeof function () {
        };
    },
    /**
     * 先实现不带空格的
     * 之后想加就在这里改
     * @returns {RegExp}
     */
    pattern() {
        return reg = /\{\{[\w\W]*?\}\}/g;
    },
    getData(vm, props) {
        let data = vm.data;
        try {
            props.forEach(prop => {
                data = data[prop];
            });
        } catch (e) {
            data = null;
        }
        return data;
    },
    getPropReplaceReg(prop) {
        return new RegExp(`${prop}\.`, 'g');
    }
};

/**
 * 编译配置
 */
const config = {
    compileConfig: {
        filterAttributes: {
            'class': true,
            id: true
        }
    }
}


```
