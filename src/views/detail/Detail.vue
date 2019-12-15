<template>
    <div id="detail">
      <detail-nav-bar class="detail-nav" ref="nav" @titleClick="titleClick"></detail-nav-bar>
      <scroll class="content" 
              ref="scroll" 
              :probe-type="3" 
              @scroll="contentScroll">
        <detail-swiper :top-images="topImages"></detail-swiper>
        <detail-base-info :goods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
        <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
        <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
        <goods-list ref="recommends" :goods="recommends"></goods-list>
      </scroll>
      <back-top @click.native="backClick" v-show="isShowBackTop"> </back-top>
      <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>

    </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'
  import  GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'


  import {getDetail, Goods,Shop, GoodsParam,getRecommend} from 'network/detail'
  import {debounce} from "../../common/utils";
  import {backTopMixin} from '../../common/mixin'
  import {mapActions} from 'vuex'
  export default {
        name: "Detail",
      components:{
          DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        Scroll,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodsList,
        DetailBottomBar
      },
      data(){
          return{
            iid:null,
            topImages:[],
            goods:{},
            shop:{},
            detailInfo:{},
            paramInfo:{},
            commentInfo:{},
            recommends:[],
            themeTopYs:[],
            getThemeTopY:null,
            currentIndex:0,

          }
      },
    mixins:[backTopMixin],
      created() {
          //1.保存传入的iid
          this.iid = this.$route.params.iid

        //2.根据iid请求详情数据
        getDetail(this.iid).then(res =>{
          console.log(res)
          const data = res.result
          //1.获取顶部的图片轮播数据
          this.topImages = data.itemInfo.topImages
          //2.获取商品信息
          this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
          //3.创建店铺信息的对象
          this.shop = new Shop(data.shopInfo)
          //4.保存商品的详情数据
          this.detailInfo = data.detailInfo;
          //5.获取参数的信息
          this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
          //6.取出评论的信息
          if(data.rate.cRate !== 0){
            this.commentInfo = data.rate.list[0]
          }
          //$nextTick()表示下一帧函数，对应的DOM函数是已经被渲染出来，但是图片依然是没有加载完，获取到的offsetTop不包括图片
          // this.$nextTick(() =>{
          //
          // })
        })

        //3.请求推荐数据
        getRecommend().then(res =>{
          this.recommends = res.data.list
        })
        //4.给getThemTopY赋值(对赋值操作进行防抖）
        this.getThemeTopY =debounce(() =>{
          this.themeTopYs=[]
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop);
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
          this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
          this.themeTopYs.push(Number.MAX_VALUE);
        },100)
      },
    updated(){

    },
    methods:{
          ...mapActions(['addCart']),
          imageLoad(){
            this.$refs.scroll.refresh()
            this.getThemeTopY()

          },
      titleClick(index){
            this.$refs.scroll.scrollTo(0,-this.themeTopYs[index]+44,200)
      },
      contentScroll(position) {
        //1.获取Y值
        const positionY = -position.y+44
        //2.positionY和主题中值进行对比
        let length = this.themeTopYs.length
        for (let i = 0; i < length; i++) {
          // if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }

          //hack判断
          if(this.currentIndex !== i &&(positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
              this.currentIndex = i
              this.$refs.nav.currentIndex = this.currentIndex
          }
        }
        //3.判断backTop是否显示
        this.isShowBackTop=(-position.y)>1000


      },
      addToCart(){
            //1.获取购物车需要展示的信息
        const product ={};
        product.image =this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price =this.goods.realPrice;
        product.iid =this.iid;

        //2.将商品添加到购物车
        //this.$store.commit('addCart',product)
        // this.$store.dispatch('addCart',product).then (res =>{
        //
        // })

        this.addCart(product).then(res =>{
          this.$toast.show(res,1500)

        })
      }
    }
    }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .content{
    height: calc(100% - 93px);

  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }


</style>
