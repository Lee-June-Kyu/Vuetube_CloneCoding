<template>
  <v-card flat tile class="videoListCard" router :to="`/watch/${video.id}`">
    <v-img
      v-if="video.thumbnailUrl !== 'no-photo.jpg'"
      :src="`${url}/uploads/thumbnails/${video.thumbnailUrl}`"></v-img>
    <div v-else class="thumbnailBox">
      <div class="thumbnailView">x</div>
    </div>

    <div class="videoRight">
      <p>{{ video.title }}</p>
      <p>{{ channel.channelName }}</p>
      <p>{{ video.views }} 회 • {{ setCalDate(video.createdAt) }}</p>
    </div>
  </v-card>
</template>
<script>
import SetFormat from '@/mixins/SetFormat.vue';

export default {
  name: 'VideoListCard',
  mixins: [SetFormat],
  props: {
    video: {
      type: Object,
      required: true,
    },
    channel: {
      type: Object,
      required: true,
    },
  },

  computed: {
    url() {
      console.log(this.channel.photoUrl);
      return process.env.VUE_APP_URL;
    },
  },
};
</script>
<style>
.videoListCard {
  background-color: white;
  display: grid;
  grid-template-columns: 150px calc(100% - 150px);
  max-height: 85px;
  overflow: hidden;
  width: 100%;
}
.videoRight {
  align-items: flex-start;
  box-sizing: border-box;
  column-gap: 2px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10px;
  width: 100%;
}
.videoRight p {
  font-size: 0.8em;
  margin: 0px;
}
</style>
