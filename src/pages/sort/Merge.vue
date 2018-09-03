<template>
    <div class="container">
        <h2>归并排序</h2>
        <transition-group name="flip-list" tag="div" class="items">
            <div class="item" v-for="item in array" :key="item.value" :style="getStyle(item)">{{ item.value }}</div>
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
            len: 13,
            duration: 1000,
            pointer: {
                temp: -1,
                groupNum: 13
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
        this.array = [...s].map((x, i) => ({
            group: i,
            value: x,
            index: 0
        }))
    },
    methods: {
        getStyle(item) {
            return {
                top: (item.group - (this.pointer.groupNum / 2)) * (600 / this.len) + 'px',
                left: (item.index - (this.len / 2)) * 40 + 'px',
                background: item.group === this.pointer.temp ? '#fbe59a' : ''
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
            
            while (1) {
                const groups = []
                this.array.forEach(x => {
                    if (!groups[x.group]) {
                        groups[x.group] = []
                    }
                    groups[x.group].push(x)
                })
                groups.forEach(g => g.sort((a, b) => a.index - b.index))
                
                const sync = () => {
                    this.array = []
                    groups.forEach((group, index) => {
                        group.forEach(item => {
                            item.group = index
                            this.array.push(item)
                        })
                    })
                    groups[-1].forEach(item => {
                        item.group = -1
                        this.array.push(item)
                    })
                }

                const merge = async (a, b, l) => {
                    while (a.length + b.length) {
                        if (!b[0] || (a[0] && a[0].value <= b[0].value)) {
                            a[0].index = l.length
                            l.push(a.splice(0, 1)[0])
                        } else {
                            b[0].index = l.length
                            l.push(b.splice(0, 1)[0])
                        }
                        sync()

                        await delay(this.duration / 2)
                    }
                }

                const size = groups.length
                for (let i = 0; i < (size + 1) >> 1; ++i) {
                    if (groups[i * 2 + 1]) {
                        groups[i * 2 - 1] = []
                        this.pointer = Object.assign(this.pointer, { temp: i * 2 - 1 })
                
                        await merge(groups[i * 2], groups[i * 2 + 1], groups[i * 2 - 1])

                        await delay(this.duration / 4)
                        groups[i * 2].push(...groups[i * 2 - 1].splice(0))
                        sync()

                        await this.nextStep()
                    }
                }
                this.pointer = Object.assign(this.pointer, { temp: -1 })
                
                for (let i = 0; i < (size + 1) >> 1; ++i) {
                    groups[i] = [...groups[i * 2].splice(0)]
                }
                sync()
                this.pointer.groupNum = groups.filter(g => g.length).length

                await delay(this.duration)
                await this.nextStep()


                if (groups.size === 1) {
                    break
                }
                
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
    /* .lists {
        display: flex;
        margin: auto;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: flex-end;
    } */
    /* .list {
        display: flex;
        flex-shrink: 0;
        box-shadow: 1px 1px 4px -3px black;
        transition: background-color .2s;
        margin: 4px;
        padding: 1px;
        border: 1px solid gray;
        border-radius: 30px;

    } */
    .items {
        /* display: flex; */
        /* width: 600px; */
        width: 0;
        position: relative;
        margin: auto;
        justify-content: space-evenly;
        align-items: flex-end;
    }
    .item {
        position: absolute;
        padding: 2px;
        margin: 3px;
        width: 30px;
        line-height: 30px;
        border-radius: 30px;
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
