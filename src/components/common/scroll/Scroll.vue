<template>
<!--  ref明确某一个组件-->
<!--  ref如果是绑定在组件中，那么通过this.$refs.name获取到的是一个数组对象；ref如果绑定在普通元素中，那么通过
this.$refs.name获取到的是一个元素对象-->
    <div class="wrapper" ref="wrapper">
      <div class="content">
      <slot></slot>
      </div>
    </div>
</template>

<script>
  import BScroll from 'better-scroll'
    export default {
        name: "Scroll",
      props:{
          probeType:{
            type:Number,
            default:0
          },
        pullUpLoad:{
            type: Boolean,
          default: false
        }
      },
      data(){
          return{
            scroll:null
          }
      },
      mounted() {
          //1.创建BScroll对象
          this.scroll = new BScroll(this.$refs.wrapper,{
            click:true,
            probeType: this.probeType,
            pullUpLoad: this.pullUpLoad

          })
        //2.监听滚动的位置
        this.scroll.on('scroll',(position) =>{
          this.$emit('scroll',position)
        })

        //3.监听上拉事件
        this.scroll.on('pullingUp',()=>{
          this.$emit('pullingUp')
        })

      },
      methods:{
          //将scrollTop方法进行封装，默认时间500毫秒
          scrollTo(x,y,time=500){
            this.scroll && this.scroll.scrollTo(x,y,time)
          },
        refresh(){
            this.scroll && this.scroll.refresh()
        }
      }
    }
</script>
<!--scoped表明只作用于当前作用域-->
<style scoped>

</style>
