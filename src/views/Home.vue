<template>
  <div id="Home">
    <VideoCard
      v-for="video in videos"
      :key="video.id"
      :video="video"
      :channel="video.userId"></VideoCard>
  </div>
</template>
<script>
import axios from 'axios';

import VideoCard from '@/components/VideoCard.vue';

export default {
  name: 'Home',
  data: () => ({
    videos: [],
  }),
  components: {
    VideoCard,
  },
  methods: {
    async getVideos() {
      await axios
        .get(process.env.VUE_APP_API + '/videos/public', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          console.log('getVideos - response : ', response, response.data.data);
          this.videos = response.data.data;
        })
        .catch((error) => {
          console.log('getVideos - error : ', error);
        });
    },
  },
  mounted() {
    this.getVideos();
  },
};
</script>
<style>
#Home {
  display: grid;
  column-gap: 30px;
  grid-template-columns: repeat(auto-fill, max(300px));
  justify-content: center;
  padding: 20px;
  row-gap: 30px;
}
</style>
