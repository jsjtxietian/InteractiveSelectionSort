<template>
    <div class="container">
        <h2>快速排序</h2>
        <div class="box">
            <div class="stack">
                <div v-for="(level, _) in stack" :key="_">{{level}}</div>
            </div>
            <transition-group name="flip-list" tag="div" class="list">
                <div
                    class="item"
                    v-for="(item, _) in array"
                    :key="item"
                    :style="{
                        height: item * 3 + 'px'
                    }"
                    :class="{
                        compared: item === pointer.x,
                        selectI: _ === pointer.i,
                        selectJ: _ === pointer.j,
                        included: pointer.l <= _ && _ <= pointer.r
                    }"
                >
                    <div class="value">{{ item }}</div>
                </div>
            </transition-group>
        </div>

        <div class="btns">
            <el-button icon="el-icon-d-arrow-right" @click="rush" round>Sort</el-button>
            <el-button icon="el-icon-arrow-right" @click="next" round>Next</el-button>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import _ from 'lodash'

function delay(duration) {
    return new Promise(r => setTimeout(r, duration))
}

export default {
    data () {
        return {
            array: [],
            len: 15,
            duration: 1000,
            pointer: {i: -1, j: -1, x: -1, l: -1, r: Infinity},
            step: 0,
            stepLock: 0,
            stack: []
        }
    },
    mounted () {
        const s = new Set()
        while (s.size < this.len) {
            s.add(_.random(this.len, this.len * 10))
        }
        this.array = [...s]
    },
    methods: {
        async swap (i, j) {
            const t = this.array[i]
            this.$set(this.array, i, this.array[j])
            this.$set(this.array, j, t)
            await delay(this.duration)
        },
        nextStep () {
            return new Promise(resolve => {
                const check = () => {
                    if (this.step < this.stepLock) {
                        this.step += 1
                        resolve()
                    } else {
                        requestAnimationFrame(check)
                    }
                }
                check()
            })
        },
        async sort () {
            let len = this.len
            
            const qs = async (l, r) => {
                this.stack.push([l, r])

                let i = l
                let j = r
                const x = this.array[parseInt((l + r) / 2)]

                this.pointer = Object.assign(this.pointer, { i, j, x, l, r })

                while (i <= j) {
                    while (this.array[i] < x) {
                        ++i
                        this.pointer = Object.assign(this.pointer, { i })
                        await delay(this.duration / 8)
                    }
                    while (this.array[j] > x) {
                        --j
                        this.pointer = Object.assign(this.pointer, { j })
                        await delay(this.duration / 8)
                    }
                    await delay(this.duration / 6)
                    if (i <= j) {
                        await this.swap(i, j)
                        ++i
                        --j
                        this.pointer = Object.assign(this.pointer, { i, j })
                    }
                    await delay(this.duration / 6)
                }

                if (i < r && l < j) {
                    for (let _ = 0; _ < 3; ++_) {
                        this.pointer = Object.assign(this.pointer, { l: i, r })
                        await delay(this.duration / 8)
                        this.pointer = Object.assign(this.pointer, { l, r })
                        await delay(this.duration / 8)
                    }
                    for (let _ = 0; _ < 3; ++_) {
                        this.pointer = Object.assign(this.pointer, { l, r: j })
                        await delay(this.duration / 8)
                        this.pointer = Object.assign(this.pointer, { l, r })
                        await delay(this.duration / 8)
                    }
                }

                await this.nextStep()
                if (l < j) await qs(l, j)
                if (i < r) await qs(i, r)

                this.stack.pop()
                await delay(this.duration / 8)
            }

            await qs(0, len - 1)
            
            this.pointer = Object.assign(this.pointer, {
                i: -1,
                j: -1,
                l: -1,
                r: Infinity,
                x: -1
            })
        },
        next () {
            if (!this.stepLock) {
                this.step += 1
                this.sort()
            }
            this.stepLock += 1
        },
        rush () {
            if (!this.stepLock) {
                this.sort()
            }
            this.stepLock = Infinity
        }
    }
}
</script>

<style scoped>
    .container {
        height: 75vh;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }
    .box {
        display: flex;
        justify-content: center;
    }
    .stack {
        border: 1px solid gray;
        width: 80px;
        padding: 10px;
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-start;
    }
    .stack > div {
        flex: 0;
    }
    .list {
        display: flex;
        width: 600px;
        justify-content: space-evenly;
        align-items: flex-end;
    }
    .item {
        background: #caf1e0;
        width: 15px;
        border-bottom: 40px solid #fbe59a;
        position: relative;
        box-shadow: 1px 1px 4px -3px black;
        transition: border-color .6s, background-color .2s, filter .2s;
    }
    .flip-list-move {
        transition: transform .6s, background-color .2s, filter .2s;
    }
    .item {
        background: lightgray;
        filter: grayscale(0)
    }
    .included {
        background: #caf1e0;
    }
    .compared {
        border-bottom-color: #F56C6C;
    }
    .selectI {
        background: #47e09b;
    }
    .selectJ {
        background: #409EFF;
    }
    .item:not(.included) {
        filter: grayscale(1)
    }
    .value {
        position: absolute;
        bottom: -30px;
        text-align: center;
        width: 35px;
        left: -10px;
    }
</style>
