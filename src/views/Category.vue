<template>
  <!-- <div id="Category">
    <h1> 카테고리 리스트 </h1> 
    <v-btn @click="openCategoryModal">카테고리 추가</v-btn>
    <v-divider></v-divider>
    <ul>
        <li v-for="(item,i) in categoryList" :key="i">
        <span>{{item.title}} : {{item.description}}</span>
        <v-btn >수정</v-btn> 
        </li>
    </ul>
    <CategoryModal
      :openDialog="statusModal"
      v-on:closeDialog="closeCategoryModal"></CategoryModal>

  </div> -->
  <div id="Category">
    <div class= "category__header">
      <h1> 카테고리 리스트 </h1>
      <button class="w-btn-outline w-btn-green-outline" @click="openCategoryModal">카테고리 추가</button>
    </div> 
    <v-divider></v-divider>
  <table >
          <thead>
            <tr>
              <th>타이틀</th>
              <th>내용</th>
              <th>수정</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categoryList" :key="category.id">
              <td>{{ category.title }}</td>
              <td>{{ category.description }}</td>
              <!-- <td><template><v-btn @click="openUpdateCategoryModal(category._id)">수정</v-btn></template></td> -->
              <td class="td__btn"><div class="td__btn__cover"><button class="w-btn-outline w-btn-green-outline"  @click="openUpdateCategoryModal(category)">수정</button></div></td>
            </tr>
          </tbody>
        </table>
        <CategoryModal
      :openDialog="statusModal"
      v-on:closeDialog="closeCategoryModal"></CategoryModal>
      <UpdateModal
      :openDialog="updateStatusModal"
      :updateId="updateID"
      v-on:closeDialog="closeUpdateCategoryModal"></UpdateModal>
            <!-- <UpdateModal
      :openDialog="updateStatusModal"
      v-on:closeDialog="closeUpdateCategoryModal"></UpdateModal> -->
        </div>
</template>
<script>
import axios from 'axios';
import CategoryModal from '@/components/Modal/CategoryModal.vue'
import UpdateModal from '@/components/Modal/UpdateModal.vue'

export default {
  name: 'Category',
  data: () => ({
    categoryList : [],
    statusModal : false,
    updateStatusModal : false,
    updateID : ''
  }),
  
  components: {
    CategoryModal,
    UpdateModal
  },

  mounted() {
    this.getCategories()
  },
  methods : {
    async getCategories() {
      await axios
        .get(process.env.VUE_APP_API + '/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(res => {
          res.data.data.forEach(element => {
            // this.categoryList.push(element.title)
            this.categoryList.push(element)
          })
        })
        .catch(res => {
          console.log('error다 :', res)
        })
      console.log(this.categoryList)
    },
    openCategoryModal() {
      this.statusModal = true;
      console.log('-- open : ', this.statusModal);
    },
    closeCategoryModal() {
      this.statusModal = false;
      this.getCategories();
      console.log('-- close : ', this.statusModal);
    },
    // openUpdateCategoryModal(e) {
    //   this.updateStatusModal = true;
    //   console.log('id',e);
    //   // console.log(e.target);
    //   // console.log('--btn_id:' , e.target.getAttribute('id'));
    //   // console.log('--btn_id2:' , e.target.id);
    //   // this.updateID = e.target.getAttribute('id');
    //   console.log('-- open : ', this.updateStatusModal);
    // },
    openUpdateCategoryModal(tempCategory) {
      this.updateStatusModal = true;
      console.log(tempCategory);
      console.log('--btn_id:' , tempCategory._id);
      this.updateID = tempCategory._id
      console.log('-- open : ', this.updateStatusModal);
    },
    closeUpdateCategoryModal() {
      this.updateStatusModal = false;
      console.log('-- close : ', this.updateStatusModal);
    }
  }
};
</script>
<style>

  h1{
    display: inline-block;
    font-size: 45px;
  }

  .category__header {
    box-sizing: border-box;
    padding : 30px 50px;
    display: flex;
    justify-content: space-between;
  }
  table {
    width: 94%;
    margin: 3%;
    box-sizing: border-box;
    table-layout: fixed;
  }
  table, td, th {
    border : 1px solid black;
    border-collapse : collapse;
    box-sizing: border-box;
  }
  thead{
    height: 70px;
    box-sizing: border-box;
    color : white;
    font-size: 30px;
    background: #0cebeb;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #29ffc6, #20e3b2, #0cebeb);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #29ffc6, #20e3b2, #0cebeb); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
  tbody{
    font-size: 23px;
  }
  td {
    padding: 10px;
  }
  .td__btn {
    text-align: center;
    box-sizing: border-box;
  }
  button {
    margin: 20px;
  }

  .w-btn-outline {
    position: relative;
    padding: 15px 30px;
    border-radius: 15px;
    font-family: "paybooc-Light", sans-serif;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    font-weight: 600;
    transition: 0.25s;
  }
  .w-btn-green-outline {
    border: 3px solid #77af9c;
    color: darkgray;
  }
  .w-btn-green-outline:hover {
    background-color: #77af9c;
    color: #d7fff1;
  }
  .w-btn-outline:hover {
    letter-spacing: 2px;
    transform: scale(1.2);
    cursor: pointer;
  }
  .td__btn__cover{

    box-sizing: border-box;
  }
</style>
