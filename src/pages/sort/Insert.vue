<template>
    <div class="container">
        <h2>插入排序</h2>
        <transition-group name="flip-list" tag="div" class="list">
            <div
                class="item"
                v-for="(item, _) in array"
                :key="item"
                :style="{height: item * 3 + 'px'}"
                :class="{
                    insertion: item === pointer.x,
                    included: _ <= pointer.i,
                    compared: pointer.l <= _ && _ <= pointer.r
                }"
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
            len: 15,
            duration: 1000,
            pointer: {l: -1, r: Infinity, x: -1, i: 0},
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
            
            for (let i = 1; i < len; ++i) {
                // 0..i-1 sorted
                
                const insertion = this.array[i]

                let l = 0
                let r = i - 1
                this.pointer = Object.assign(this.pointer, { l, r, x: this.array[i], i })

                do {
                    await delay(this.duration / 4)
                    let x = this.array[l + r >> 1]
                    if (x <= insertion) {
                        l = 1 + (l + r >> 1)
                    } else {
                        r = l + r >> 1
                    }

                    this.pointer = Object.assign(this.pointer, { l, r })
                } while (l < r)
                if (this.array[r] < insertion) {
                    await delay(this.duration / 4)
                    ++l
                    ++r
                    this.pointer = Object.assign(this.pointer, { l, r })

                    await delay(this.duration / 2)
                } else {
                    await delay(this.duration / 4)
                    for (let _ = i; _ > r; --_) {
                        this.$set(this.array, _, this.array[_ - 1])
                    }
                    this.$set(this.array, r, insertion)
                    await delay(this.duration)
                }

                await this.nextStep()
            }
            
            this.pointer = Object.assign(this.pointer, { l: -1, r: Infinity, x: -1, i: Infinity })
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
        width: 600px;
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
    .included {
        background: #caf1e0;
    }
    .insertion {
        background: #F56C6C;
    }
    .item:not(.compared) {
        border-bottom-color: #e4e4e4;
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
