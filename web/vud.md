# vue3 源码学习 #

## 指令 ##

1. 通过 `compile` 编译, 生成 `code`
2. 在 `compiler` 的过程中，通过 `withDirectives` 关联 `directives` 和 `vnode`
3. 在 `mountElement` 的过程中，通过 `invokeDirectiveHook` 触发 `directive` 生命周期
3. 在 `patchElement` 的过程中，通过 `invokeDirectiveHook` 触发 `directive` 生命周期
4. 通过生命周期实现指令相关功能

## dom diff ##

<!--
1. 生成 `subTree`, `patch` `prevTree` 和 `nextTree`
2. `isSameVNodeType` 判断 type 和 key 是否相同
3. 
-->

1. sync from start   
  从头开始同步  
    `type` 和 `key` 相同  
      `patch`不同  
    否则  
      转到步骤2  

2. sync from end  
  从尾部开始同步  
    `type` 和 `key` 相同  
      `patch`  
    不同  
      `e1` < `i` <= `e2`  
        转到步骤3  
      `e2` < `i` <= `e1`  
        转到步骤4  
      如果都不满足  
        转到步骤5  

3. common sequence + mount
  经过上面的同步之后, 
  对剩余的节点进行挂载

4. common sequence + unmount
  经过上面的同步后，对剩余的节点进行卸载

5. unknown sequence  
> 总共两点
> 1. 首先是对节点进行 `patch`
>   (能在老的节点中找到对应的节点:`key`相同 或 (都没有`key`且`type`相同))
> 2. 对节点进行移动或挂载
>   (如果没能在老节点中找到对应的节点,则进行挂载)
>   (如果找到了则看是否在最长递增子序列中，如果不在，则移动节点)

对未 `patch` 的 新的节点的下标进行映射  
遍历 旧的节点  
  如果 `patched` 超过 `toBePatched`  
    把剩下所有的所有节点卸载  
  如果 旧的节点 `key` 存在  
    在新的节点中找key相同的节点  
  如果 `key` 不存在  
    遍历新的节点，找第一个`type` 和 `key` 相同且没有对应新节点的节点  
  
  如果没有在新的节点中找到和老节点相同的节点  
    卸载老节点  
  否则  
    新老节点对应中记录对应的下标(对应下标+1, 因为0有表示没有找到对应的节点)   
  
    如果新的下标比之前的下标大  
      更新最新最大的下标  
    否则  
      moved 变更为 true  

    更新节点  
    `patched++`  

如果有移动  
  生成最长稳定子序列(对应的下标)  
`j` 稳定序列的下标，初始值为最后一个  

遍历需要 `patch` 的所有节点,包含已经patch过的  
  如果没有 `patch` 过  
    `patch` (实际就是挂载)  
  如果 节点移动过  
    如果不在最长稳定子序列中  
      移动节点  
    `j` 往前移  
