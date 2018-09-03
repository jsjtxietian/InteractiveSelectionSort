<template>
    <div class="container">
        <h2>基数排序</h2>
        <transition-group name="flip-list" tag="div" class="items">
            <div class="item" v-for="item in array" :key="item">
                <div class="letter" v-for="(letter, _) in ('' + item)" :key='`${item}-${_}`' :style="{background: pointer.i === ('' + item).length - _ ? '#fbe59a' : '' }">{{letter}}</div>
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
            duration: 1200,
            pointer: {
            },
            step: 0,
            stepLock: 0
        }
    },
    mounted () {
        const s = new Set()
        while (s.size < this.len) {
            s.add(_.random(0, 1000) * _.random(0, 1000) * _.random(0, 1000) * _.random(0, 1000))
        }
        this.array = [...s]
    },
    methods: {
        getStyle(item) {
            return {
                // top: (item.group - (this.pointer.groupNum / 2)) * (600 / this.len) + 'px',
                // left: (item.index - (this.len / 2)) * 40 + 'px',
                // background: item.group === this.pointer.temp ? '#fbe59a' : ''
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

            // this.pointer = Object.assign(this.pointer, { group })
            const max = Math.max(...this.array.map(x => ('' + x).length))
            
            for (let i = 1; i <= max; ++i) {
                this.array.sort((a, b) => {
                    a = '' + a
                    b = '' + b

                    const na = (a.length < i) ? 0 : a.slice(-i, 1 - i || Infinity)
                    const nb = (b.length < i) ? 0 : b.slice(-i, 1 - i || Infinity)

                    return parseInt(na) - parseInt(nb)
                })
                this.pointer.i = i
                await delay(this.duration)
                await this.nextStep()
            }

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
        height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }
    .btns {
        margin-top: 20px;
    }
    .items {
        display: flex;
        margin: auto;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: flex-end;
    }
    .item {
        display: flex;
        flex-shrink: 0;
        box-shadow: 1px 1px 4px -3px black;
        transition: background-color .2s;
        margin: 4px;
        padding: 5px;
        border: 1px solid gray;
        border-radius: 8px;

    }
    .letter {
        margin: 1px;
        width: 20px;
        line-height: 30px;
        background: #caf1e0;

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
