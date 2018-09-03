<template>
    <div class="container">
        <h2>猴子排序</h2>
        <!-- <div>{{step}} - {{stepLock}}</div> -->
        <!-- <div>{{pointer}}</div> -->
        <transition-group name="flip-list" tag="div" class="list">
            <div class="item" v-for="item in array" :key="item" :style="{
                height: item * 3 + 'px'
            }">
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
            duration: 300,
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
    computed: {
        inOrder () {
            for (let i = 0; i < this.array.length - 1; ++i) {
                if (this.array[i] > this.array[i + 1]) {
                    return false
                }
            }
            return true
        }
    },
    methods: {
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
            while (!this.inOrder) {
                this.array = _.shuffle(this.array)
                await delay(this.duration)
                await this.nextStep()
            }
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
    .flip-list-move {
        transition: transform .3s;
    }
    .list {
        display: flex;
        width: 400px;
        margin: auto;
        justify-content: space-evenly;
        align-items: flex-end;
    }
    .item {
        background: #47e09b;
        width: 15px;
        border-bottom: 40px solid #fbe59a;
        position: relative;
    }
    .value {
        position: absolute;
        bottom: -30px;
        text-align: center;
        width: 35px;
        left: -10px;
    }

</style>
