<template>
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
        <div class="item" v-for="(item, j) in category.items" :key="j">
          <div class="text">
            {{ item.name + ' @ ' + (item.location || category.name) }}
          </div>
          <n-slider
            :value="item.weight"
            @update:value="onUpdateItemWeight($event, item)"
          ></n-slider>
        </div>
      </n-collapse-item>
    </n-collapse>
  </main>
</template>

<script>
import {
  NButton,
  NCard,
  NCollapse,
  NCollapseItem,
  NDivider,
  NSlider,
} from 'naive-ui'
export default {
  name: 'Home',
  components: {
    NCard,
    NButton,
    NCollapse,
    NCollapseItem,
    NSlider,
    NDivider,
  },
  data() {
    return {
      data: [],
      defaultTarget: { name: '什么' },
      target: { name: '什么' },
    }
  },
  computed: {
    list() {
      const list = []
      this.data.forEach((category) => {
        list.push(...category.items)
      })
      return list
    },
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
    async updateData() {
      const r = await fetch('/data.json')
      const data = await r.json()
      const oldData = this.getData()
      data.forEach((category) => {
        const oldCategory = oldData.find((c) => c.name === category.name)
        if (oldCategory) {
          category.weight = oldCategory.weight
          category.items.forEach((item) => {
            const oldItem = oldCategory.items.find((i) => i.name === item.name)
            if (oldItem) {
              item.weight = oldItem.weight
              item._weight = oldItem._weight
            }
          })
        }
      })
      console.log(data)
      data.forEach((category) => {
        if (category.weight === undefined) {
          category.weight = 100
        }
        category.items.forEach((item) => {
          if (item.weight === undefined) {
            item.weight = 100
          }
          if (item._weight === undefined) {
            item._weight = 100
          }
        })
      })
      this.data = data
      this.setData(this.data)
    },
    setData(data) {
      localStorage.setItem('csm-data', JSON.stringify(data))
    },
    getData() {
      return JSON.parse(localStorage.getItem('csm-data')) || []
    },
  },
  created() {
    this.updateData()
    setInterval(() => {
      if (this.data.length > 0) {
        this.setData(this.data)
      }
    }, 1000)
  },
}
</script>

<style scoped></style>
