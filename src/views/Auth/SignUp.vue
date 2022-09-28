<template>
  <v-container fluid class="fill-height white">
    <v-row>
      <v-col cols="12" xs="12" sm="8" md="8" lg="7" class="ma-auto">
        <v-card outlined class="pa-10">
          <v-card-title>Vuetube</v-card-title>
          <v-card-subtitle>회원가입</v-card-subtitle>
          <v-card-text>
            <ValidationObserver
              ref="signUpForm"
              v-slot="{ handleSubmit, invalid, validate }">
              <form @submit.prevent="handleSubmit(signUp)">
                <ValidationProvider
                  name="이메일"
                  rules="required|email"
                  v-slot="{ errors }">
                  <v-text-field
                    outlined
                    type="email"
                    label="이메일"
                    :error-messages="errors"
                    v-model="email"></v-text-field>
                </ValidationProvider>
                <ValidationProvider
                  name="채널 이름"
                  rules="required"
                  v-slot="{ errors }">
                  <v-text-field
                    outlined
                    label="채널 이름"
                    :error-messages="errors"
                    v-model="channelName"></v-text-field>
                </ValidationProvider>

                <ValidationProvider
                  name="비밀번호"
                  rules="required|min:6"
                  v-slot="{ errors }">
                  <v-text-field
                    outlined
                    type="password"
                    label="비밀번호"
                    :error-messages="errors"
                    v-model="password"></v-text-field>
                </ValidationProvider>
                <ValidationProvider
                  name="비밀번호 확인"
                  rules="required|confirmed:비밀번호"
                  v-slot="{ errors }">
                  <v-text-field
                    outlined
                    type="password"
                    label="비밀번호 확인"
                    :error-messages="errors"
                    v-model="confirmPassword"></v-text-field>
                </ValidationProvider>

                <div class="d-flex justify-end">
                  <v-btn
                    depressed
                    right
                    color="primary"
                    class="blue"
                    type="submit"
                    :loading="loading"
                    :disabled="invalid || !validate"
                    >가입하기</v-btn
                  >
                </div>
              </form>
            </ValidationObserver>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from 'axios';

import Validate from '@/mixins/Validate.vue';

export default {
  name: 'SignUp',

  mixins: [Validate],

  data: () => ({
    channelName: '',
    confirmPassword: '',
    email: '',
    password: '',
    loading: false,
  }),
  methods: {
    // 회원가입
    async signUp() {
      if (this.loading) return;
      this.loading = true;

      const axiosBody = {
        email: this.email,
        channelName: this.channelName,
        password: this.password,
      };
      console.log('auth/register - axiosBody : ', axiosBody);

      await axios
        .post(process.env.VUE_APP_API + '/auth/register', axiosBody)
        .then(async (response) => {
          console.log('auth/login - response : ', response);
          localStorage.setItem('token', response.data.token);

          this.$router.push({ name: 'SignIn' });
        })
        .catch((error) => {
          console.log('auth/login - error : ', error);

          // 에러문구 표시
          this.$refs.signUpForm.setErrors({
            이메일: ['이미 가입된 이메일입니다.'],
            '채널 이름': ['이미 존재하는 채널 이름입니다.'],
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style></style>
