<template>
  <nav>
    <v-app-bar app clipped-left flat class="white">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link class="black--text" to="/">Vuetube</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        outlined
        rounded
        color="blue"
        router
        to="/signin"
        v-if="!GE_LOGIN_STATUS">
        <v-icon left size="26">mdi-account-circle</v-icon>
        로그인
      </v-btn>

      <v-menu offset-y v-else>
        <template v-slot:activator="{ on }">
          <v-btn
            depressed
            fab
            small
            color="red white--text"
            class="font-weight-bold"
            v-on="on">
            <!-- <v-avatar v-if="GE_USER_DATA.photoUrl !== 'no-photo.jpg'">
              <img
                :src="`${GE_URL}/uploads/avatar/${GE_USER_DATA.photoUrl}`"
                :alt="GE_USER_DATA.channelName" />>
            </v-avatar> -->

            <span>{{ channelAvatar }}</span>
          </v-btn>
        </template>

        <v-card>
          <v-list>
            <v-list-item>
              <v-list-item-avatar
                small
                color="red white--text"
                class="align-center d-flex font-weight-bold justify-center">
                <!-- <v-avatar v-if="GE_USER_DATA.photoUrl !== 'no-photo.jpg'">
                  <img
                    :src="`${GE_URL}/uploads/avatar/${GE_USER_DATA.photoUrl}`"
                    :alt="GE_USER_DATA.channelName" />
                </v-avatar> -->

                <span>{{ channelAvatar }}</span>
              </v-list-item-avatar>

              <v-list-item-content>
                <!-- <v-list-item-title>{{
                  GE_USER_DATA.channelName
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  GE_USER_DATA.email
                }}</v-list-item-subtitle> -->
              </v-list-item-content>
            </v-list-item>

            <v-divider class="mt-3"></v-divider>

            <v-list-item @click="openVideoModal">
              <v-list-item-icon>
                <v-icon>mdi-video-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>동영상 업로드</v-list-item-title>
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item @click="signOut">
              <v-list-item-icon>
                <v-icon>mdi-login-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-title>로그아웃</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer app clipped v-model="drawer">
      <v-list dense nav>
        <v-list-item router to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>홈</v-list-item-title>
        </v-list-item>

        <v-divider class="my-3"></v-divider>

        <v-list-item router to="/category">
          <v-list-item-icon>
            <v-icon>mdi-shape</v-icon>
          </v-list-item-icon>
          <v-list-item-title>카테고리</v-list-item-title>
        </v-list-item>

        <v-divider class="my-3"></v-divider>
      </v-list>
    </v-navigation-drawer>

    <VideoModal
      :openDialog="statusModal"
      v-on:closeDialog="closeVideoModal"></VideoModal>
  </nav>
</template>
<script>
import axios from 'axios';

import VideoModal from '@/components/Modal/VideoModal.vue';

export default {
  name: 'NavBar',

  data: () => ({
    drawer: true,

    GE_LOGIN_STATUS: localStorage.getItem('token') ? true : false,
    GE_USER_DATA: JSON.parse(localStorage.getItem('user')) || null,

    statusModal: false,
  }),

  components: {
    VideoModal,
  },

  computed: {
    GE_URL() {
      return process.env.VUE_APP_URI;
    },
    channelAvatar() {
      // const setChannelAvatar = this.GE_USER_DATA.channelName
      //   .split('')[0]
      //   .toUpperCase();
      // console.log('setChannelAvatar : ', setChannelAvatar);
      // return setChannelAvatar;
      return 'A'
    },
  },

  watch: {
    GE_LOGIN_STATUS() {
      const status = localStorage.getItem('token') ? true : false;
      this.GE_LOGIN_STATUS = status;
    },
    GE_USER_DATA() {
      const data = JSON.parse(localStorage.getItem('user')) || null;
      this.GE_USER_DATA = data;
    },
  },

  methods: {
    openVideoModal() {
      this.statusModal = true;
      console.log('-- open : ', this.statusModal);
    },
    closeVideoModal() {
      this.statusModal = false;
      console.log('-- close : ', this.statusModal);
    },

    async signOut() {
      await axios
        .post(
          process.env.VUE_APP_API + '/auth/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          console.log('signOut - response : ', response);
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          this.GE_LOGIN_STATUS = false;
          this.GE_USER_DATA = null;
        })
        .catch((error) => {
          console.log('signOut - error : ', error);
        });
    },
  },
};
</script>
<style>
.MenuStyle {
  width: 300px;
}
</style>
