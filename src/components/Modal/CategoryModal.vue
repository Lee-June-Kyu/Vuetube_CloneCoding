<template>
  <v-dialog persistent max-width="1000" v-model="dialog">
    <v-card class="modal">
      <div class="modalHeader">
        <h2>카테고리 추가</h2>
        <v-btn icon text @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-divider class="divider"></v-divider>

      
      <form>
        <v-text-field
              label="New Category Title"
              outlined
              v-model= "newCategoryTitle"
        ></v-text-field>
        <v-text-field
              label="New Category Description"
              outlined
              v-model= "newCategoryDescription"
        ></v-text-field>
        <v-btn type="submit" @click="addCategory" >추가하기</v-btn>
      </form>
      

      
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios'
  export default {
    props: {
    openDialog: Boolean,
  },
  data: () => ({
    newCategoryTitle : '',
    newCategoryDescription : ''
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
    async addCategory() {
      console.log('타이틀', this.newCategoryTitle);
      console.log('내용', this.newCategoryDescription);
      const categoryObject = {};
      categoryObject.title = this.newCategoryTitle;
      categoryObject.description = this.newCategoryDescription;
      console.log(categoryObject);
      await axios
      .post(process.env.VUE_APP_API + '/categories', categoryObject,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }).then((res)=>{
          console.log('saveNewCategory :', res);
        }).catch((err)=>{
          console.log('카테고리 생성에러 : ', err);
        })
    }
  }
  }
</script>

<style lang="scss" scoped>
  .divider {
    margin-top: 30px ;
    margin-bottom: 30px;
  }
</style>