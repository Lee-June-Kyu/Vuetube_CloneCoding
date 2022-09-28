<template>
  <v-container fluid class="fill-height white">
    <v-row>
      <v-col cols="12" xs="12" sm="6" md="5" lg="4" class="ma-auto">
        <v-card outlined class="pa-10">
          <v-card-title>Vuetube</v-card-title>
          <v-card-subtitle>로그인</v-card-subtitle>
          <v-card-text>
            <ValidationObserver
              ref="signInForm"
              v-slot="{ handleSubmit, invalid, validate }">
              <form @submit.prevent="handleSubmit(signIn)">
                <ValidationProvider
                  name="이메일"
                  rules="required|email"
                  v-slot="{ errors }">
                  <div class="mx-auto my-5">
                    <input
                      type="email"
                      class="inputStyle"
                      placeholder="이메일"
                      v-model="email" />
                    <span class="errorText">{{ errors[0] }}</span>
                  </div>
                </ValidationProvider>
                <ValidationProvider
                  name="비밀번호"
                  rules="required"
                  v-slot="{ errors }">
                  <div class="mx-auto my-5">
                    <input
                      type="password"
                      class="inputStyle"
                      placeholder="비밀번호"
                      v-model="password" />
                    <span class="errorText">{{ errors[0] }}</span>
                  </div>
                </ValidationProvider>

                <div class="d-flex justify-space-between">
                  <v-btn text color="primary" class="pl-0" router to="signup"
                    >계정 만들기</v-btn
                  >
                  <v-btn
                    depressed
                    color="primary"
                    class="blue"
                    type="submit"
                    :disabled="invalid || !validate"
                    >로그인</v-btn
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
  name: 'SignIn',
  mixins: [Validate],

  data: () => ({
    email: '',
    password: '',
    loading: false,
  }),

  methods: {
    // 로그인
    async signIn() {
      if (this.loading) return;
      this.loading = true;

      const axiosBody = {
        email: this.email,
        password: this.password,
      };
      console.log('auth/login - axiosBody : ', axiosBody);

      await axios
        .post(process.env.VUE_APP_API + '/auth/login', axiosBody)
        .then(async (response) => {
          console.log('auth/login - response : ', response);
          localStorage.setItem('token', response.data.token);

          // 로컬 스토리지에 유저 정보 저장
          await axios
            .post(
              process.env.VUE_APP_API + '/auth/me',
              {},
              {
                headers: {
                  Authorization: `Bearer ${response.data.token}`,
                },
              }
            )
            .then((_response) => {
              localStorage.setItem('user', JSON.stringify(_response.data.data));
              this.$router.push({ name: 'Home' });
            })
            .catch((_error) => {
              console.log('/auth/me - _error : ', _error);

              // 에러문구 표시
              this.$refs.signInForm.setErrors({
                이메일: ['이메일을 확인해주세요.'],
                비밀번호: ['비밀번호를 확인해주세요.'],
              });

              this.loading = false;
            });
        })
        .catch((error) => {
          console.log('auth/login - error : ', error);

          // 에러문구 표시
          this.$refs.signInForm.setErrors({
            이메일: ['이메일을 확인해주세요.'],
            비밀번호: ['비밀번호를 확인해주세요.'],
          });

          this.loading = false;
        });
    },
  },
};
</script>
<style>
.inputStyle {
  box-sizing: border-box;
  border: 1px solid #aaa;
  border-radius: 5px;
  display: block;
  font-size: 16px;
  padding: 15px 20px;
  margin: 5px auto;
  width: 100%;
}

span.errorText {
  display: block;
  color: #f00;
  font-size: 12px;
  text-align: right;
  width: 100%;
}
</style>
