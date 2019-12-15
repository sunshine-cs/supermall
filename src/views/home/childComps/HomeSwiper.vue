<template>
    <div>
      <swiper>
        <swiper-item v-for="item in banners">
          <a :href="item.link">
            <img :src="item.image" alt="" @load="imageLoad"/>
          </a>
        </swiper-item>
      </swiper>
    </div>
</template>

<script>
  import {Swiper,SwiperItem} from 'components/common/swiper/index'
    export default {
        name: "HomeSwiper",
      props:{
          banners:{
            type:Array,
            default(){
              return []
            }

          }
      },
      data(){
          return{
          isLoad:false

        }


      },
      components:{
        Swiper,
        SwiperItem
      },
      methods: {
        //发出监听图片加载完成的事件
        imageLoad() {
          //让图片只加载一次，也可在事件后加.once
          if (!this.isLoad) {
            this.$emit('swiperImageLoad')
            this.isLoad=true
          }
        }
        }


    }
</script>

<style scoped>

</style>
