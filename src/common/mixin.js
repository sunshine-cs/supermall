import BackTop from 'components/content/backtop/BackTop'
export  const backTopMixin ={
  components:{
    BackTop

  },
  data(){
    return{
      isShowBackTop:false
    }
  },
  methods:{
    backClick(){
      //可以通过scroll.scrollTop传入参数回到顶部，还可设置时间
      this.$refs.scroll.scrollTo(0,0)

    }
  }
}
