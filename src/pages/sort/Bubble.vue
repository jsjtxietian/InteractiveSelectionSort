<template>
    <div class="container">
        <h2>冒泡排序</h2>
        <transition-group name="flip-list" tag="div" class="list">
            <div
                class="item"
                v-for="(item, _) in array"
                :key="item"
                :style="{height: item * 3 + 'px'}"
                :class="{selected: _ === pointer.i || _ === pointer.j}"
            >
                <div class="value">{{ item }}</div>
            </div>
        </transition-group>

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
            len: 10,
            duration: 1000,
            pointer: {i: -1, j: -1},
            step: 0,
            stepLock: 0
        }
    },
    mounted () {
        const s = new Set()
        while (s.size < this.len) {
            s.add(_.random(0, this.len * 10))
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
            let unsorted = false
            do {
                unsorted = false
                for (let i = 0; i < len - 1; ++i) {
                    const j = i + 1
                    this.pointer = Object.assign(this.pointer, { i, j })
                    if (this.array[i] > this.array[j]) {
                        await this.swap(i, j)
                        unsorted = true
                    } else {
                        await delay(this.duration / 4)
                    }
                    await this.nextStep()
                }
                len --
            } while (unsorted)
            this.pointer.i = this.pointer.j = this.len
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
    .list {
        display: flex;
        width: 400px;
        margin: auto;
        justify-content: space-evenly;
        align-items: flex-end;
    }
    .item {
        background: #caf1e0;
        width: 15px;
        border-bottom: 40px solid #fbe59a;
        position: relative;
        box-shadow: 1px 1px 4px -3px black;
        transition: background-color .2s;
    }
    .flip-list-move {
        transition: transform .6s, background-color .2s;
    }
    .selected {
        background: #47e09b;
    }
    .value {
        position: absolute;
        bottom: -30px;
        text-align: center;
        width: 35px;
        left: -10px;
    }
</style>
