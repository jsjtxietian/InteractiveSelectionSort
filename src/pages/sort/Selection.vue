<template>
    <div class="parent">
        <div class="array">
            <div class="type">
                <el-button icon="el-icon-sort-up" @click="sortUp" round>Ascend</el-button>
                <el-button icon="el-icon-refresh" @click="sortRand" round>Shuffle</el-button>
                <el-button icon="el-icon-sort-down" @click="sortDown" round>Descend</el-button>
            </div>
            <div class="numbers">
                <el-button
                    @click="toggleArray(i)"
                    round
                    size="mini"
                    v-for="i in 20"
                    :key="`number-${i}`"
                    :style="getStyle(i)"
                    :type="array.indexOf(i) >= 0 ? 'primary' : ''"
                >{{ i }}</el-button>
            </div>
        </div>
        <div class="container">
            <h2>Selection Sort</h2>
            <div class="list" v-if="!step">
                <div
                    class="item"
                    v-for="(item, _) in array"
                    :key="item"
                    :style="{height: item * 10 + 'px'}"
                    :class="{selected: _ === pointer.i || _ === pointer.j}"
                >
                    <div class="value">{{ item }}</div>
                </div>
            </div>
            <transition-group name="flip-list" tag="div" class="list" v-else>
                <div
                    class="item"
                    v-for="(item, _) in array"
                    :key="item"
                    :style="{height: item * 10 + 'px'}"
                    :class="{selected: _ === pointer.i || _ === pointer.j}"
                >
                    <div class="value">{{ item }}</div>
                </div>
            </transition-group>

            <div class="btns">
                <el-button icon="el-icon-d-arrow-right" @click="rush" round>Sort</el-button>
                <el-button icon="el-icon-close" @click="pause" round>Pause</el-button>
                <el-button icon="el-icon-arrow-right" @click="next" round>Next</el-button>
            </div>
        </div>
        <div class="code" v-html="formattedCode">
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import _ from 'lodash'
import hljs from 'highlight.js'
import 'highlight.js/styles/tomorrow.css'

window.hljs = hljs

function delay(duration) {
    return new Promise(r => setTimeout(r, duration))
}

export default {
    data () {
        return {
            array: [],
            len: 10,
            duration: 1000,
            pointer: {i: -1, j: -1},
            step: 0,
            stepLock: 0,
            code: `def selection_sort(list2):
      for i in range(0, len (list2)-1):
        min_ = i
        for j in range(i + 1, len(list2)):
            if list2[j] < list2[min_]:
            min_ = j
        list2[i], list2[min_] = list2[min_], list2[i]  # swap`
        }
    },
    mounted () {
        // const s = new Set()
        // while (s.size < this.len) {
        //     s.add(_.random(0, this.len * 10))
        // }
        // this.array = [...s]
        // this.array = new Array(10).fill(0)
    },
    computed: {
        formattedCode () {
            return `<div>${
                hljs.highlightAuto(this.code).value
                    .replace(/\n/g, '</div><div>')
                    .replace(/\s{4}/g, '<i style="display: inline-block;width: 20px;"></i>')
            }</div>`
        }
    },
    methods: {
        getStyle (i) {
            let top = i * 35 - 30 + 'px'
            let left = 0

            const index = this.array.indexOf(i)
            if (index >= 0) {
                top = index * 35 + 5 + 'px'
                left = 100 + 'px'
            }
            return {
                top,
                left
            }
        },
        toggleArray(i) {
            const index = this.array.indexOf(i)
            if (index >= 0) {
                this.array.splice(index, 1)
            } else {
                if (this.array.length >= 10) {
                    this.array.splice(0, 1)
                }
                this.array.push(i)
            }
        },
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
            const len = this.len
            for (let i = 0; i < len - 1; ++i) {
                this.pointer = Object.assign(this.pointer, { i })
                for (let j = i + 1; j < len; ++j) {

                    this.pointer = Object.assign(this.pointer, { j })
                    if (this.array[i] > this.array[j]) {
                        await this.swap(i, j)
                    } else {
                        await delay(this.duration / 4)
                    }
                    await this.nextStep()
                }
            }
            this.pointer.i = this.pointer.j = this.len
        },
        sortUp () {
            this.array.sort((a, b) => a - b)
            this.step = this.stepLock = 0
        },
        sortDown () {
            this.array.sort((a, b) => b - a)
            this.step = this.stepLock = 0
        },
        sortRand () {
            this.array = _.shuffle(this.array)
            this.step = this.stepLock = 0
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
        },
        pause () {
            this.stepLock = this.step
        }
    }
}
</script>

<style scoped>
    .parent {
        height: 75vh;
        display: flex;
        justify-content: space-between;
    }
    .code {
        text-align: left;
        justify-content: center;
    }

    .array, .code, .numbers {
        flex: 1;
    }
    .code, .array {
        display: flex;
        flex-direction: column;
    }
    .numbers {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        margin-top: 20px;
        position: relative;
        margin-left: 114px;
    }
    .numbers .el-button {
        margin: 0;
        position: absolute;
        transition: .3s;
    }
    .container {
        height: 75vh;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        margin: 0 10px;
    }
    .list {
        display: flex;
        width: 400px;
        height: 200px;
        margin: auto;
        justify-content: space-evenly;
        align-items: flex-end;
    }
    .item {
        background: #caf1e0;
        width: 15px;
        border-bottom: 40px solid #65bf96;
        color: #fff2c6;
        font-weight: bolder;
        text-shadow: 0 0 2px black;
        position: relative;
        box-shadow: 1px 1px 4px -3px black;
        transition: background-color .2s;
    }
    .flip-list-move {
        transition: transform .6s, background-color .2s;
    }
    .selected {
        background: #fbe59a;
    }
    .value {
        position: absolute;
        bottom: -30px;
        text-align: center;
        width: 35px;
        left: -10px;
    }
</style>