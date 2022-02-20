<template>
  <div class="center">
    <header>header</header>
    <main>
      <n-card class="display-card" title="嘉然今天吃...">
        <div class="display-card-content">{{ target.name }}</div>
      </n-card>
      <div class="roll">
        <div></div>
        <n-button type="primary" @click="roll10">roll</n-button>
        <n-button class="reset" @click="reset">🗘</n-button>
      </div>
      <n-collapse class="setting-panel">
        <n-collapse-item
          v-for="(category, i) in data"
          :key="i"
          :title="category.name"
          :name="category.name"
        >
          <n-slider
            class="category-slider"
            v-model:value="category.weight"
            @update:value="onUpdateCategoryWeight($event, category.items)"
            :default-value="100"
          ></n-slider>
          <n-card
            v-for="(item, j) in category.items"
            :key="j"
            :title="item.name + ' @ ' + (item.location || category.name)"
            size="small"
          >
            <n-slider
              :value="item.weight"
              @update:value="onUpdateItemWeight($event, item)"
            ></n-slider>
          </n-card>
        </n-collapse-item>
      </n-collapse>
    </main>
  </div>
</template>

<script>
import {
  NButton,
  NCard,
  NCollapse,
  NCollapseItem,
  NIcon,
  NSlider,
} from 'naive-ui'
import { RefreshFilled } from '@vicons/material'
export default {
  name: 'Home',
  components: {
    NCard,
    NButton,
    NCollapse,
    NCollapseItem,
    NSlider,
    NIcon,
    RefreshFilled,
  },
  data() {
    return {
      list: [],
      data: [
        {
          name: '校内',
          items: [
            { name: '南食' },
            { name: '南苑' },
            { name: '旦苑' },
            { name: '北食' },
          ],
        },
        {
          name: '校外',
          items: [
            { name: '麦当劳', location: '三号湾' },
            { name: '萨莉亚', location: '三号湾' },
            { name: 'LaBamba', location: '三号湾' },
            { name: '吉祥馄饨', location: '政肃路' },
            { name: '羊肉汤', location: '政肃路' },
          ],
        },
      ],
      defaultTarget: { name: '什么' },
      target: { name: '什么' },
    }
  },
  methods: {
    onUpdateCategoryWeight(categoryWeight, items) {
      items.forEach((item) => {
        item.weight = Math.round((item._weight * categoryWeight) / 100)
      })
    },
    onUpdateItemWeight(value, item) {
      item._weight = item.weight = value
    },
    roll() {
      function binarySearch(array, target) {
        let low = 0,
          high = array.length - 1
        while (low < high) {
          const mid = Math.floor((high - low) / 2) + low
          if (pre[mid] < target) {
            low = mid + 1
          } else {
            high = mid
          }
        }
        return low
      }
      const weights = this.list.map((item) => item.weight)
      const pre = new Array(this.list.length).fill(0)
      pre[0] = weights[0]
      for (let i = 1; i < weights.length; i++) {
        pre[i] = pre[i - 1] + weights[i]
      }
      const total = weights.reduce((s, x) => s + x, 0)
      const random = Math.ceil(Math.random() * total)
      const result = this.list[binarySearch(pre, random)]
      if (result.name === this.target.name) {
        this.roll()
      } else {
        this.target = result
      }
    },
    async roll10() {
      for (let i = 0; i < 10; i++) {
        const start = Date.now()
        this.roll()
        const wait = Math.max(50 - (Date.now() - start), 0)
        await new Promise((r) => setTimeout(r, wait))
      }
    },
    reset() {
      this.data.forEach((category) => {
        category.weight = 100
        category.items.forEach((item) => {
          item.weight = item._weight = 100
        })
      })
      this.target = this.defaultTarget
    },
  },
  created() {
    this.data.forEach((category) => {
      category.weight = category.weight || 100
      category.items.forEach((item) => {
        item.weight = item.weight || 100
        item._weight = item._weight || 100
      })
      this.list.push(...category.items)
    })
  },
}
</script>

<style scoped></style>
