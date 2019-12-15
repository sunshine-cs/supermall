<template>
    <div class="tab-bar-item" @click="itemClick">
      <div v-if="!isActive"><slot  name="item-icon"></slot></div>
      <div v-else><slot name="item-icon-active"></slot></div>
      <div :style="activeStyle"><slot name="item-text"></slot></div>

    </div>
</template>

<script>
    export default {
        name: "TabBarItem",
      props:{
          path:String,
        activeColor:{
            type:String,
          default:'pink'
        }
      },
      data(){
          return{
            //isActive:true
          }
      },
      computed:{
          isActive(){
            //动态决定isActive为true还是false
            return this.$route.path.indexOf(this.path) !== -1
          },
        activeStyle(){
            //可以通过activeColor直接在代码中改颜色，也可不添加用默认的
            return this.isActive ? {color:this.activeColor} : {}
        }
      },
      methods:{
          itemClick(){
            this.$router.replace(this.path)
          }
      }
    }
</script>

<style scoped>
  .tab-bar-item{
    flex:1;
    text-align: center;
    height: 49px;
    background-color: #f6f6f6;
    font-size: 14px;
  }
  .tab-bar-item img{
    width:24px;
    height:24px;
    margin-top: 3px;
    margin-bottom: 2px;
    vertical-align: middle;/*解决图片下方默认3px的距离*/
  }
  /*.active{*/
  /*  color: pink;*/
  /*}*/

</style>
