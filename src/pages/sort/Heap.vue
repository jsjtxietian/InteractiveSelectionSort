<template>
    <div class="container">
        <h2>堆排序</h2>
        <transition-group name="flip-list" tag="div" class="list">
            <div
                class="item"
                v-for="(item, _) in array"
                :key="item"
                :class="{
                    selected: pointer.selected === _,
                    sorted: _ >= pointer.len
                }"
                :style="getStyle(_)"
            >
                <div class="value">{{ item }}</div>
                <i :style="getOuterStyle(_)"></i>
                <i :style="getInnerStyle(_)"></i>
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
            len: 15,
            duration: 750,
            pointer: {
                selected: -1,
                len: Infinity
            },
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
        getStyle (index) {
            const y = parseInt(Math.log2(index + 1))
            const n = y && ((1 << (y - 1)) - 0.5)
            const x = index + 1 - (1 << y)
            const top = y - (parseInt(Math.log2(this.len + 1)) >> 1)
            const dis = 40 * 1 << (parseInt(Math.log2(this.len + 1)) - y)
            return {
                left: (x - n) * dis + 'px',
                top: top * 80 + 'px'
            }
        },
        getOuterStyle (index) {
            const y = parseInt(Math.log2(index + 1))
            const x = index + 1 - (1 << y)
            const dis = 40 * 1 << (parseInt(Math.log2(this.len + 1)) - y - 2)
            return {
                borderWidth: `80px ${dis}px`,
                top: '-80px',
                left: `-${dis}px`
            }
        },
        getInnerStyle (index) {
            const y = parseInt(Math.log2(index + 1))
            const x = index + 1 - (1 << y)
            const dis = 40 * 1 << (parseInt(Math.log2(this.len + 1)) - y - 2)
            return {
                borderWidth: `78px ${dis && dis - 2}px`,
                top: '-76px',
                left: `-${dis - 2}px`,
                borderBottomColor: 'white',
                opacity: 1
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

            let len = this.len
            
            const heapify = async (index) => {
                this.pointer = Object.assign(this.pointer, { selected: index })
                await delay(this.duration / 4)
                
                const left = 2 * index + 1
                const right = left + 1
                
                let t = index
                let max = this.array[t]

                if (left < len && this.array[left] > max) {
                    max = this.array[left]
                    t = left
                }
                if (right < len && this.array[right] > max) {
                    max = this.array[right]
                    t = right
                }
                if (t !== index) {
                    await this.swap(index, t)
                    await heapify(t)
                } else {
                    await delay(this.duration / 4)
                }
            }
            const buildHeap = async () => {
                for (let i = (len >> 1) - 1; i >= 0; i--) {
                    console.log(i)
                    await heapify(i)
                }
            }
            
            await buildHeap()
            this.pointer = Object.assign(this.pointer, { selected: -1 })
            await this.nextStep()

            while (len > 0) {
                len--
                this.pointer = Object.assign(this.pointer, { len })
                await this.swap(0, len)

                await delay(this.duration / 4)
                
                await heapify(0)
                this.pointer = Object.assign(this.pointer, { selected: -1 })
                await this.nextStep()
            }

            this.pointer = Object.assign(this.pointer, { selected: -1, len: Infinity })
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
        /* width: 600px; */
        width: 0;
        position: relative;
        margin: auto;
        justify-content: space-evenly;
        align-items: flex-end;
    }
    .item {
        position: absolute;
    }
    .flip-list-move {
        transition: transform .6s, background-color .2s;
    }
    .value {    
        background: #caf1e0;
        width: 40px;
        height: 40px;
        margin: -20px;
        border-radius: 40px;
        border: 2px solid #47e09b;
        /* border-bottom: 40px solid #fbe59a; */
        position: absolute;
        box-shadow: 1px 1px 4px -3px black;
        transition: background-color .2s;
        text-align: center;
        line-height: 40px;
    }
    i {
        position: absolute;
        border: transparent solid;
        border-bottom-color: gray;
        opacity: 1;
        z-index: -10;
    }

    .selected .value {
        border-color: #F56C6C;
        background: #fffdc0;
    }
    .sorted .value {
        background: lightgray;
        border-color: gray;
    }
    .flip-list-move i {
        opacity: 0;
    }
</style>
