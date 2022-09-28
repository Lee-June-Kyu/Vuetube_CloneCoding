<template>
  <v-dialog persistent max-width="1000" v-model="dialog">
    <v-card class="modal">
      <div class="modalHeader">
        <h2>동영상 업로드</h2>
        <v-btn icon text @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>

      <v-card-text v-if="!uploaded">
        <div class="fileInputStyle">
          <ValidationProvider
            ref="providerFileInput"
            name="동영상"
            rules="required-select|size:5000000"
            v-slot="{ errors }">
            <v-file-input
              accept="video/mp4"
              prepend-icon="mdi-video"
              :error-messages="errors"
              v-model="selectedFile"
              @change="selectedUploadFile"></v-file-input>
          </ValidationProvider>
        </div>
      </v-card-text>

      <v-card-text v-else>
        <ValidationObserver v-slot="{ handleSubmit, invalid, validate }">
          <form class="formStyle" @submit.prevent="handleSubmit(saveVideo)">
            <ValidationProvider
              name="썸네일"
              rules="required-select"
              v-slot="{ errors }">
              <v-file-input
                dense
                filled
                accept="image/*"
                prepend-icon="mdi-image"
                label="썸네일"
                :error-messages="errors"
                v-model="selectedImgFile"
                @change="imgToBase64"></v-file-input>
            </ValidationProvider>

            <div class="thumbnailBox mb-5">
              <img
                v-if="imgDataUrl !== ''"
                :src="imgDataUrl"
                class="thumbnailView" />
            </div>

            <ValidationProvider
              name="제목"
              rules="required|min:3|max:100"
              v-slot="{ errors }">
              <v-text-field
                dense
                filled
                label="제목(필수 항목)"
                :error-messages="errors"
                v-model="formData.title"></v-text-field>
            </ValidationProvider>

            <ValidationProvider
              name="설명"
              rules="required|min:3|max:5000"
              v-slot="{ errors }">
              <v-text-field
                dense
                filled
                label="설명"
                :error-messages="errors"
                v-model="formData.description"></v-text-field>
            </ValidationProvider>

            <ValidationProvider
              name="공개 상태"
              rules="required-select"
              v-slot="{ errors }">
              <v-select
                filled
                label="공개 상태"
                :error-messages="errors"
                :items="visibilty"
                v-model="formData.visibilty"></v-select>
            </ValidationProvider>

            <ValidationProvider
              name="카테고리"
              rules="required-select"
              v-slot="{ errors }">
              <v-select
                filled
                label="카테고리"
                :error-messages="errors"
                :loading="categoryLoading"
                :items="categoryTitles"
                v-model="formData.category"></v-select>
            </ValidationProvider>

            <v-btn
              depressed
              block
              color="blue"
              class="white--text"
              :disabled="invalid || !validate"
              type="submit"
              >저장</v-btn
            >
          </form>
        </ValidationObserver>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from 'axios';
import Vaildate from '@/mixins/Validate.vue';

export default {
  name: 'VideoModal',
  mixins: [Vaildate],
  props: {
    openDialog: Boolean,
  },
  data: () => ({
    categories: [], // 카테고리 데이터
    categoryTitles: [], // 카테고리 타이틀만

    selectedFile: [], // 영상 선택
    selectedImgFile: [], // 썸네일 선택

    visibilty: ['공개', '비공개'], // 공개 여부

    formData: {
      id: '',
      title: '',
      description: '',
      category: '',
      visibilty: '',
    }, // axiosBody

    url: '', // 영상 상세정보, 썸네일 업로드 url

    imgDataUrl: '', // 썸네일 base64

    // 로딩
    categoryLoading: false,
    uploading: false,
    uploaded: false,
    saveLoading: false,
  }),
  computed: {
    dialog(props) {
      console.log(props.openDialog);
      return props.openDialog;
    },
  },
  methods: {
    closeModal() {
      this.$emit('closeDialog');
    },

    async imgToBase64(file) {
      console.log(file);
      const actImgToBase64 = () => {
        return new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.onload = function () {
            resolve(reader.result);
            reader.onerror = reject;
          };

          if (file) {
            reader.readAsDataURL(file);
          }
        });
      };

      const thisBase64 = await actImgToBase64(this.selectedImgFile);
      console.log('thisBase64 : ', thisBase64);
      this.imgDataUrl = thisBase64;
    },

    async getCategories() {
      this.categoryLoading = true;
      await axios
        .get(process.env.VUE_APP_API + '/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          console.log('getCategories - response : ', response);
          this.categories = response.data.data;
          this.categoryTitles = response.data.data.map(
            (category) => category.title
          );
        })
        .catch((error) => {
          console.log('getCategories - error : ', error);
        })
        .finally(() => {
          this.categoryLoading = false;
        });
    },

    async selectedUploadFile(e) {
      console.log('---- selectedUploadFile : ', this.selectedFile);

      // 유효성 검사
      const { valid } = await this.$refs.providerFileInput.validate(e);
      console.log('selectedUploadFile - valid : ', valid);

      if (!valid) return;

      // 업로딩 중...
      this.uploading = true;

      // 폼 데이터 생성
      const videoFormData = new FormData();
      videoFormData.append('video', this.selectedFile, this.selectedFile.name);
      // append(name, value, filename);

      // 폼 데이터 확인
      for (let item of videoFormData.entries()) {
        console.log(item);
      }

      // draft 비디오 업로드
      await axios
        .post(process.env.VUE_APP_API + '/videos', videoFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          console.log('selectedUploadFile - response : ', response);

          // 폼 데이터 설정
          this.formData.id = response.data.data.id;
          this.formData.title = response.data.data.title;
          this.formData.description = response.data.data.description;
          this.formData.category = response.data.data.category;
          this.formData.visibilty = response.data.data.visibilty;
          this.url = `${process.env.VUE_APP_API}/videos/${response.data.data.id}`;
        })
        .catch((error) => {
          console.log('selectedUploadFile - error : ', error);
        })
        .finally(() => {
          // 업로딩 완료 상태
          this.uploaded = true;
          this.uploading = false;
        });
    },

    async saveVideo() {
      this.saveLoading = true;

      // 썸네일 수정
      const imgFormData = new FormData();
      imgFormData.append('thumbnail', this.selectedImgFile);

      for (let item of imgFormData.entries()) {
        console.log(item);
      }

      await axios
        .put(this.url + '/thumbnails', imgFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          console.log('saveThumbnail - response : ', response);
        })
        .catch((error) => {
          console.log('saveThumbnail - error : ', error);
        });

      // 비디오 수정
      const categoryId = this.categories.find((category) => {
        if (category.title === this.formData.category) return true;
      })._id;

      const visibility =
        this.formData.visibilty === '비공개' ? 'private' : 'public';

      const axiosBody = {
        title: this.formData.title,
        description: this.formData.description,
        categoryId: categoryId,
        status: visibility.toLowerCase(),
      };
      console.log('saveVideo - axiosBody : ', axiosBody);

      const videoFormData = new FormData();
      videoFormData.append('title', this.formData.title);
      videoFormData.append('description', this.formData.description);
      videoFormData.append('categoryId', categoryId);
      videoFormData.append('status', visibility.toLowerCase());
      for (let item of videoFormData.entries()) {
        console.log(item);
      }

      await axios
        .put(this.url, videoFormData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
          console.log('saveVideo - response : ', response);
        })
        .catch((error) => {
          console.log('saveVideo - error : ', error);
        })
        .finally(() => {
          this.closeModal();
        });
    },
  },
  mounted() {
    this.getCategories();
  },
};
</script>
<style>
.modal {
  box-sizing: border-box;
  padding: 20px 30px;
}
.modalHeader {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}
.fileInputStyle {
  margin: 20px auto 0px auto;
  width: 80%;
}
.formStyle {
  margin: 20px auto 0px auto;
}
</style>
