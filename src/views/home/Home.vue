<template>
  <div id="home">
  <nav-bar class="home-nav" >
    <div slot="center">购物街</div>
  </nav-bar>
    <tab-control class="tab-control"
                 :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 v-show="isTabFixed">
    </tab-control>
<!--    自定义监听事件-->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
    <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
    <recommend-view :recommends="recommends"></recommend-view>
    <feature-view></feature-view>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl2">
    </tab-control>
    <goods-list :goods="showGoods"></goods-list>
    </scroll>
<!--    在我们需要监听一个组件的原生事件时，必须给对应的事件加上.native修饰符，才能进行监听-->
    <back-top @click.native="backClick" v-show="isShowBackTop"> </back-top>
  </div>
</template>

<script>

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/scroll/Scroll'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getHomeMultidata,getHomeGoods} from "network/home";
  import {debounce} from "common/utils";
  import {backTopMixin} from '../../common/mixin'


  export default {
        name: "Home",
      components:{

          HomeSwiper,
        RecommendView,
        FeatureView,
        NavBar,
        Scroll,
        TabControl,
        GoodsList,

      },
    data(){
          return{
            banners:[],
            recommends:[],
            goods:{
              'pop':{page:0,list:[]},
              'new':{ page:0,list:[]},
              'sell':{page:0,list:[]}
            },
            currentType:'pop',
            tabOffsetTop:0,
            isTabFixed:false,
            saveY:0,
          }
    },
    mixins:[backTopMixin],
    computed:{
          showGoods(){
            return this.goods[this.currentType].list
          }

    },
    activated(){
          this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()

    },
    deactivated(){
          //1.保存Y值
          this.saveY=this.$refs.scroll.scroll.y

    },
    created() {
          //1.请求多个数据
      this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')


    },
    mounted(){
          const refresh = debounce(this.$refs.scroll.refresh,200)
      //3.监听item中的图片加载完成
      this.$bus.$on('itemImageLoad',()=>{
        refresh()

      })



    },
    methods:{

          //事件监听相关的方法


      tabClick(index){
        switch (index) {
          case 0:
            this.currentType = 'pop'
                break
          case 1:
            this.currentType = 'new'
                break
          case 2:
            this.currentType = 'sell'
                break

        }
        this.$refs.tabControl1.currentIndex=index
        this.$refs.tabControl2.currentIndex=index

      },
      //已被混入到minix里面了
      // backClick(){
      //   //可以通过scroll.scrollTop传入参数回到顶部，还可设置时间
      //   this.$refs.scroll.scrollTo(0,0)
      //
      // },
      contentScroll(position){
        //1.判断backTop是否显示
        this.isShowBackTop=(-position.y)>1000
        //2.决定tabControl是否吸顶
        this.isTabFixed =(-position.y)>this.tabOffsetTop


      },
      loadMore(){
        this.getHomeGoods(this.currentType)
        //在图片加载完重新刷新以获得准确的高度
        // this.$refs.scroll.scroll.refresh()
      },
      swiperImageLoad(){
        //获取tabControl的offsetTop
        //所有的组件都有一个属性$el,用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop

      },
          //网络请求相关方法
          getHomeMultidata(){
            getHomeMultidata().then(res =>{
              this.banners=res.data.banner.list;
              this.recommends=res.data.recommend.list;

            })
          },
      getHomeGoods(type){
            const page=this.goods[type].page+1
        getHomeGoods(type,page).then(res =>{
          //.push(...num1,...num2)可拼接不同数组并且对该数组进行遍历
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.scroll.finishPullUp()
        })
      }

    }
  }
</script>

<style scoped>
  #home{
    /*padding-top: 44px;*/
    /*视口高度*/
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color:var(--color-tint);
    color:#fff;

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  .tab-control{
    /*可设置容器滚动到一定位置就固定在页面中*/
    /*position: sticky;*/
    /*top:44px;*/
    /*z-index: 9;*/
    position: relative;
    z-index: 9;
  }

  .content{
    /*css3的计算函数*/
    position: absolute;
    top:44px;
    bottom: 40px;
    height:calc(100% - 93px);
    overflow: hidden;
  }

</style>
