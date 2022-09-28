<template>
  <v-dialog persistent max-width="1000" v-model="dialog">
    <v-card class="modal">
      <div class="modalHeader">
        <h2>카테고리 수정</h2>
        <v-btn icon text @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-divider class="divider"></v-divider>

      
      <form>
        <v-text-field
              label="Update Category Title"
              outlined
              v-model= "updatedCategoryTitle"
        ></v-text-field>
        <v-text-field
              label="Update Category Description"
              outlined
              v-model= "updatedCategoryDescription"
        ></v-text-field>
        <!-- <v-btn @click="updateCategory" >test</v-btn> -->
        <v-btn  @click="updateCategory" >수정하기</v-btn>
      </form>
      

      
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from 'axios'
  export default {
    props: {
    openDialog: Boolean,
    updateId: String
  },
  data: () => ({
    updatedCategoryTitle : '',
    updatedCategoryDescription : ''
  }),
  computed: {
    dialog(props) {
      console.log(props.openDialog);
      return props.openDialog;
    },
    updatedId(props) {
      console.log(props.updateId);
      return props.updateId;
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeDialog');
    },
    async updateCategory() {
      const ID = this.updatedId
      console.log('타이틀', this.updatedCategoryTitle);
      console.log('내용', this.updatedCategoryDescription);
      console.log('id: ', ID)
      const categoryObject = {};
      categoryObject.title = this.updatedCategoryTitle;
      categoryObject.description = this.updatedCategoryDescription;
      console.log(categoryObject);
      await axios
      .put(process.env.VUE_APP_API + `/categories/${ID}`, categoryObject,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }).then((res)=>{
          console.log('updateCategory :', res);
          this.closeModal();
        }).catch((err)=>{
          console.log('카테고리 수정에러 : ', err);
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