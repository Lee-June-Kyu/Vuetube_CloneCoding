<template>
  <v-container id="Watch" class="fill-height" fluid>
    <div class="watchSection fill-height">
      <div class="watchContainer">
        <v-skeleton-loader large tile :loading="videoLoading">
          <v-responsive>
            <!-- video에 @play를 넣어주면 비디오가 실행 될 때마다 함수가 실행됨 -->
            <video controls style="height: 100%; width: 100%" @play="playVideo">
              <source :src="videoUrl !== null && videoUrl" type="video/mp4" />
            </video>
          </v-responsive>
        </v-skeleton-loader>
        <div class="videoInfo">
            <h5>#여기는 해쉬태그 공간입니다. #해쉬태그 #즐거운vue</h5>
            <h1 class="videoTitle">{{ watchVideo.title }}</h1>
            <div class="video__Info__content">
              <div class="video__Info__content--left">
                <v-avatar color="#00897B" size="40" class="info__avatar">사</v-avatar>
                <div class="leftcontent__name">
                  <h3 v-if="watchVideo.userId"> {{watchVideo.userId.channelName}}</h3>
                  <h6> 구독자 0명</h6>
                </div>
                <v-btn rounded dark >구독</v-btn>
              </div>
              <div class="video__Info__content--right">
                <span><v-btn @click="likeContent" :color="goodClickColor" > <v-icon>mdi-thumb-up-outline</v-icon>좋아요 {{watchVideo.likes}}</v-btn></span>
                <span><v-btn @click="unlikeContent" :color="badClickColor"><v-icon>mdi-thumb-down-outline</v-icon>싫어요 {{watchVideo.dislikes}}</v-btn></span>
              </div>
          </div>
        </div>
      </div>
      <!-- <v-divider class="under__video"></v-divider> -->
      <div class="videoInfo__box">
        <p> 조회수 {{countViews}}회 3시간 전</p>
        <p>{{videoDescription}}</p>
      </div>
      <v-divider class="under__video"></v-divider>
      <span>댓글 {{commentLength}}개</span>
      <v-text-field  placeholder="댓글추가..."  v-model= "content"></v-text-field>
      <div class="underText">
        <v-btn rounded @click="createComment" class="gocomment">댓글</v-btn>
      </div>
      <ul>
        <li v-for="(item,i) in commentList" :key="i">
          <div class="commentArea" >
            <div v-if='item.goflag' >
              <div class="commentArea__info">
                <v-avatar color="#00897B" size="40" class="info__avatar">사</v-avatar>
                <div>
                  <div> {{item.userId.channelName}} <span style="color: #9a9a9a; font-size: 13px">3시간 전</span></div>
                  <div style="font-size: 17px"> {{item.text}}</div>
                </div>
              </div>
              <div style="padding-left: 50px">
                <v-btn @click="changeFlag(i)">수정</v-btn>
                <v-btn @click="removeComment(item._id)" >삭제</v-btn>
                <v-btn v-if="!item.subAddFlag" @click="changesubAddFlag(i)">답글</v-btn>
                <div ><button class="changeSubBtn" @click="changeSubFlag(i,item._id)">
                  <v-icon v-if="subFlagIconFlag" color="blue">mdi-menu-down</v-icon>
                  <v-icon v-else color="blue">mdi-menu-up</v-icon>
                  답글</button></div>
              </div>
              <div style="display:flex ; flex-direction: column-reverse">
            <div v-for="(subitem,j) in item.replies" :key="j" style="margin-left: 50px">
              <div v-if="item.subFlag">
                <div v-if="subInputFlag"> 
                  <span style="font-size: 10px">{{subitem.userId.channelName}}</span><br>
                  {{subitem.text}}
                  <div style="display: flex">
                    <v-btn small @click="changeSubCommentUpdateFlag">수정</v-btn>
                    <v-btn small @click="deleteSubComment(subitem.id)">삭제</v-btn>
                  </div>
                </div>
                <div v-else>
                  <v-text-field  placeholder="대댓글수정"  v-model= "subUpdateContent"></v-text-field>
                  <v-btn @click="updateSubComment(subitem.id)">수정</v-btn>
                </div>
              </div>
            </div>
            </div>
            <v-text-field v-if="item.subAddFlag" placeholder="대댓글추가..."  v-model= "subContent" style="margin-left: 50px"></v-text-field>
            <v-btn v-if="item.subAddFlag" @click="addSubComment(item._id,i)" style="margin-left: 50px">대댓글 내용 추가</v-btn>
          </div>
          <div v-else class="underText">
            <v-text-field  placeholder="댓글수정"  v-model= "updateContent"></v-text-field>
            <v-btn @click="updateComment(item._id,i)">수정</v-btn>
          </div>

        </div> 
        </li>
    </ul>
    </div>

    <div class="listSection fill-height">
      <div class="listContainer">
        <VideoListCard
          v-for="video in videos"
          :key="video.id"
          :video="video"
          :channel="video.userId"></VideoListCard>
      </div>
    </div>
    
  </v-container>
</template>
<script>
import axios from 'axios';

import VideoListCard from '@/components/VideoListCard.vue';

export default {
  name: 'Watch',
  data: () => ({
    videos: [],
    commentList: [],
    subCommentList : [],
    watchVideo: {
      userId: {},
    },
    videoUrl: null,
    videoLoading: false,
    content: '',
    subContent: '',
    updateContent: '',
    subUpdateContent: '',
    updateFlag: true,
    subAddFlag : false,
    commentLength : 0,
    goodClickColor: '',
    badClickColor: '',
    videoDescription: '',
    countViews: 0,
    subFlagIconFlag: true,
    subInputFlag : true,
  }),
  components: {
    VideoListCard,
  },
  computed: {

  },
  watch: {
    $route(to, from) {
      if (to.path != from.path) {
        this.getWatchData(this.$route.params.id);
        this.getComments(this.$route.params.id);
        this.getfeeling();
      }
    },
    watchVideo() {
      this.videoUrl = `${process.env.VUE_APP_URL}/uploads/videos/${this.watchVideo.url}`;
    },
  },
  methods: {
    changeFlag(i) {
      console.log(this.commentList[i].goflag)
      this.commentList[i].goflag = !this.commentList[i].goflag;
    },
    changeSubFlag(i,ID) {
      console.log(this.commentList[i].subFlag)
      this.commentList[i].subFlag = !this.commentList[i].subFlag;
      this.selectGetSubComment(ID);
      this.subFlagIconFlag = !this.subFlagIconFlag
    },
    changesubAddFlag(index){
      for(let i = 0 ; i < this.commentList.length ; i++){
        if(i != index){
          this.commentList[i].subAddFlag = false
        }
      }
      this.commentList[index].subAddFlag = !this.commentList[index].subAddFlag
    },
    changeSubCommentUpdateFlag(){
      this.subInputFlag = !this.subInputFlag
    },
    // Watch데이터 받기
    async getWatchData(id) {
      console.log(this.$route.params.id);
      this.videoLoading = true;
      this.watchVideo = {};

      await axios
        .get(process.env.VUE_APP_API + `/videos/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          console.log(
            'getWatchData - response : ',
            response,
            response.data.data
          );
          this.watchVideo = response.data.data;
          this.videoDescription = response.data.data.description;
          this.countViews = response.data.data.views
          this.videoLoading = false;
        })
        .catch((error) => {
          console.log('getWatchData - error : ', error);
        });
    },
    // 비디오 받기
    async getVideos() {
      await axios
        .get(process.env.VUE_APP_API + '/videos/public', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          console.log('getVideos - response asd: ', response.data.data);
          this.videos = response.data.data;
          
        })
        .catch((error) => {
          console.log('getVideos - error : ', error);
        });
    },
    // 댓글 읽기
    async getComments(id) {
      console.log('댓글부분 : ',this.$route.params.id);
      // this.videoLoading = true;
      // this.watchVideo = {};

      await axios
        .get(process.env.VUE_APP_API + `/comments/${id}/videos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          console.log(
            'getCommentData - response : ',
            response,
            response.data.data
          );
          for(let i = 0 ; i < response.data.data.length ; i++){
            response.data.data[i].goflag = true;
            response.data.data[i].subFlag = false;
            response.data.data[i].subAddFlag = false;
          }
          this.commentList = response.data.data;
          this.commentLength = response.data.data.length;
          console.log('코멘트 목록: ', this.commentList)
          console.log('유저아이디', this.commentList['userId'])
          // this.videoLoading = false;
          // 대댓글 데이터 추가
          // this.subCommentList = response.data.data.replies;
          // console.log('##########################');
          // console.log('대댓글이다!!!!!', this.subCommentList);
        })
        .catch((error) => {
          console.log('getWatchData - error : ', error);
        });
    },
    // 댓글 생성
    async createComment() {
      console.log('댓글생성 router : ',this.$route.params.id);
      const commentObject = {};
      commentObject.text = this.content;
      commentObject.videoId = this.$route.params.id;
      commentObject.userId = localStorage.getItem('user')['_id'];

      console.log('코멘트만들기:', commentObject)

      await axios
        .post(process.env.VUE_APP_API + `/comments`, commentObject ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res)=>{
          this.getComments(this.$route.params.id);
          this.content = '';
          console.log('res : ',res);
        }).catch((err)=>{
          console.log('err : ', err);
        })
    },
    // 댓글 삭제
    async removeComment(comment_id) {
      console.log(comment_id)

      await axios
        .delete(process.env.VUE_APP_API + `/comments/${comment_id}` ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res)=>{
          console.log('removeComment res : ',res);
          this.getComments(this.$route.params.id);
        }).catch((err)=>{
          console.log('removeComment err : ', err);
        })
    },
    // 댓글 수정
    async updateComment(comment_id, index){
      const newBody = {
        "text" : this.updateContent
      }
      await axios
        .put(process.env.VUE_APP_API + `/comments/${comment_id}` , newBody ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res)=>{
          console.log('updateComment res :' ,res);
          this.getComments(this.$route.params.id);
        }).catch((err)=> {
          console.log('updateComment Error : ', err)
        }).finally(
          this.changeFlag(index)
        )
    },
    // 좋아요 하기
    async likeContent(){
      const likeBody = {
        'type' : 'like',
        'videoId': this.$route.params.id,
        'userId' : localStorage.getItem('user')['_id']
      };
      await axios
        .post(process.env.VUE_APP_API + '/feelings' , likeBody ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res)=>{
          console.log('post like :' , res);
          console.log('성공하나?');
          if(this.badClickColor != ''){
            this.badClickColor = '';
          }
          this.goodClickColor = 'primary';
          this.getWatchData(this.$route.params.id);
        }).catch((err)=>{
          console.log('post like error : ', err);
        })
    },
    // 싫어요 하기
    async unlikeContent(){
      const likeBody = {
        'type' : 'dislike',
        'videoId': this.$route.params.id,
        'userId' : localStorage.getItem('user')['_id']
      };
      console.log('videoId' ,this.$route.params.id )
      await axios
        .post(process.env.VUE_APP_API + '/feelings' , likeBody ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res)=>{
          console.log('post like :' , res);
          console.log('성공하나?');
          if(this.goodClickColor != ''){
            this.goodClickColor = '';
          }
          this.badClickColor = 'blue-grey';
          this.getWatchData(this.$route.params.id);
        }).catch((err)=>{
          console.log('post like error : ', err);
        })
    },
    // 좋아요 불러오는건 의문이 생겨서 내일 질문 후 작성하자. (다 불러와서 좋아요 개수 뽑아보고 싶음)
    // 좋아요 취소가 불가능함 api에 없음
    // 대댓글 만들기
    async addSubComment(comment_id,index) {
      console.log('클릭');
      const subBody = {
        'text' : this.subContent,
        'commentId' : comment_id,
        'userId' : localStorage.getItem('user')['_id'],
      }
      console.log('서브바디' , subBody);
      await axios
        .post(process.env.VUE_APP_API + '/replies' , subBody ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res)=>{
          this.changesubAddFlag(index)
          console.log('res 서브바디 :',  res);
        }).catch((err)=>{
          console.log('err 서브바디 : ', err)
        })
    },
    // 대댓글 조회하기
    async getSubComment(){
      await axios
        .get(process.env.VUE_APP_API + '/replies'  ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res)=>{
          console.log('get subComment res : ', res.data.data);
          this.subCommentList = res.data.data
        })
    },
    selectSubitem(comment_id , item_id) {
      console.log(comment_id);
      console.log(item_id)
      if(comment_id === item_id){
        this.subFlag = true;
        return ;
      }
      this.subFlag = false;
      return ;
    },
    // 특정 대댓글 불러오기
    async selectGetSubComment(comment_id){
      this.subCommentList=[];
      await axios
        .get(process.env.VUE_APP_API + '/replies'  ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res)=>{
          console.log('get subComment res : ', res.data.data);
          res.data.data.forEach(element => {
            if(element.commentId === comment_id){
              this.subCommentList.push(element)
            }
          });
        })
    },
    // 대댓글 삭제하기
    async deleteSubComment(subComment_id){
      await axios
        .delete(process.env.VUE_APP_API + `/replies/${subComment_id}`  ,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res)=>{
          console.log('delete subComment res : ', res);
        }).catch((err)=>{
          console.log('delete subComment error : ', err)
        })
    },
    // 대댓글 수정하기
    async updateSubComment(subComment_id){
      const subCommentText = {};
      subCommentText.text=this.subUpdateContent;
      await axios
        .put(process.env.VUE_APP_API + `/replies/${subComment_id}`,subCommentText,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res)=>{
          console.log('delete subComment res : ', res);
          this.changeSubCommentUpdateFlag()
        }).catch((err)=>{
          console.log('delete subComment error : ', err)
        })
    },

    // 비디오에 대한 나의 좋아요 정보 가지고 오기
    // 좋아요 싫어요 버튼 색을 위해서
    async getfeeling(){
      const video_id = this.$route.params.id;
      const user_id = localStorage.getItem('user')['_id'];
      const feelingBody = {
        'videoId' : video_id,
        'userId' : user_id,
      }
      await axios
        .post(process.env.VUE_APP_API + '/feelings/check'  , feelingBody, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res)=>{
          console.log('######################################');
          console.log('getFeeling res : ' , res);
          console.log(res.data.data.feeling);
          this.goodClickColor = ''
          this.badClickColor = ''
          if(res.data.data.feeling == 'dislike'){
            this.badClickColor = 'blue-grey'
          }
          else if (res.data.data.feeling == 'like'){
            this.goodClickColor = 'primary'
          }
        }).catch((err)=>{
          console.log('getFeeling error :', err);
        })
    },
    async playVideo() {
      await axios
        .put(process.env.VUE_APP_API + `/videos/${this.$route.params.id}/views`,{}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }).then((res)=>{
          console.log('Video Play res :' , res);
          this.countViews = res.data.data.views

        }).catch((err)=>{
          console.log('Video Play error :', err);
        })
    }
  },
  mounted() {
    this.getVideos();
    this.getWatchData(this.$route.params.id);
    this.getComments(this.$route.params.id);
    // this.createComment(this.$route.params.id);
    // this.createComment();
    // this.likeContent();
    // this.getSubComment();
    this.getfeeling();
  },
};
</script>
<style>
#Watch {
  display: grid;
  grid-template-columns: 70% 30%;
}

.videoInfo {
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
}

.listSection {
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-left: 10px;
  width: 100%;
}
.listContainer {
  align-items: center;
  box-sizing: border-box;
  row-gap: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-left: 10px;
  width: 100%;
}
.underText{
  display: flex;
  justify-content: flex-end;
}
ul {
  list-style:none;
}
.commentArea{
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
.commentArea__info{
  display: flex;
}
.commentArea__info > div{
  margin : 5px;
}
.gocomment {
  margin-bottom: 10px;
}
.under__video{
  margin : 50px 0;
}
.video__Info__content{
  display: flex;
  justify-content: space-between;
}
.video__Info__content--left {
  display: flex;
  align-items: center;
}
.video__Info__content--left>div  {
  margin-right: 10px;
}
.info__avatar{
  color: white;
}
.video__Info__content--left> .leftcontent__name{
  margin-right: 20px;
}
.videoInfo__box {
  margin-top : 30px;
  border-radius: 15px;
  padding: 10px;
  background-color: #EEEEEE;
}
.videoInfo__box:hover {
  background-color: #E0E0E0;
}
.changeSubBtn{
  margin-top:5px;
  width : 120px;
  height: 40px;
  border-radius: 60px;
  color: blue;
}
.changeSubBtn:hover {
  background-color: #cce6ff;
}
</style>
