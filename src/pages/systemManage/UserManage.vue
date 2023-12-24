<template>
  <div class="user-manage">

    <div class="list">
      <el-button type="primary" @click="addUser('add')" style="margin-right: 26px;">
        <i class="el-icon-circle-plus-outline icon-sign"></i>
        添加用户
      </el-button>

      <el-button @click="deleteUserIds" :disabled="ids.length === 0" class="delete">
        <i class="el-icon-delete icon-sign"></i>
        批量删除
      </el-button>
    </div>



    <div class="data-list" v-if="userList.length > 0">
      <el-card class="box-card" v-for="(item, index) of userList" :key="index">
        <div class="card">
          <el-checkbox v-model="item.choseCheck" class="checkbox-style" @change="getUserIds(item, $event)"></el-checkbox>
          <div class="card-word">
            <span class="word-text">{{ item.userName }}</span>
            <span class="card-img edit" @click="addUser('edit', item)">
              <el-tooltip class="item" effect="dark" content="点击修改用户数据" placement="top">
                <img style="transform: scale(1.3);" src="@/assets/messageService/edit.png" alt="" />
              </el-tooltip>
            </span>
            <span class="card-img juli" @click="deleUser(item)">
              <el-tooltip class="item" effect="dark" content="点击删除当前用户" placement="top">
                <img style="transform: scale(1.3);" src="@/assets/messageService/delete.png" alt="" />
              </el-tooltip>
            </span>
          </div>

          <div class="name-date">
            <p>
              <span class="name-label">昵称：</span>
              <span class="name-label">{{ item.nickName }}</span>
            </p>
            <p>
              <span class="name-label">状态：</span>
              <span class="name-label">{{ item.status === '1' ? '正常' : "停用" }}</span>
            </p>
          </div>
        </div>
      </el-card>
      <div class="pick"></div>
    </div>


    <!-- 新增和修改 -->
    <UserManageDialog :dialogShow="dialogShow" @closeDialog="closeDialog" :title="DiaTile" :diaFormData="userList" />
    <!-- 删除动作 -->
    <el-dialog :visible.sync="centerDialogVisible" width="322px" center :show-close="false" top="22vh" class="dia-sign">
      <span class="diaLog-span" style="text-align:center;">确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" class="btn-sty">取 消</el-button>
        <el-button type="primary" @click="deteleUserDialog" style="padding: 10px 20px;">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
 
<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator'
import UserManageDialog from '@/components/systemManage/UserManageDialog.vue'

@Component({
  components: {
    UserManageDialog
  }
})

export default class UserManage extends Vue {

  private dialogShow = false
  private DiaTile = '添加用户'
  private userList = {} as any
  private ids: Array<number> = []
  private centerDialogVisible = false
  private pageInfo = {
    current: 1,
    total: 0,
    size: 16
  }



  // 创建时调用
  created() {
    this.getUser()
  }

  // 获取用户
  async getUser() {
    const { current, size } = this.pageInfo
    const params = {
      current,
      size
    }
    this.$api.userList(params).then(res => {
      if (res && res.records) {
        this.userList = res.records.map((obj: any) => ({ choseCheck: false, ...obj }))
        this.pageInfo.total = Number(res.total)
      }
    })
  }

 

  // 添加用户
  addUser(type: string, item?: any) {
    this.userList = {}
    this.DiaTile = type === 'add' ? '添加用户' : '修改用户'
    this.dialogShow = true
    this.userList = {
      ...(item || {})
    }
   this.getUser()
  }


  getUserIds() {
    this.ids = this.userList.filter((obj: any) => {
      return obj.choseCheck === true
    }).map((item: any) => (item.id))
  }

  // 删除用户
  deleUser(item: any) {
    this.ids = []
    this.centerDialogVisible = true
    this.ids.push(item.id)
    
  }

  // 批量删
  deleteUserIds() {
    if (this.ids.length === 0) {
      this.$message.error('请勾选要删除的用户')
    } else {
      this.centerDialogVisible = true
    } 
  }

  deteleUserDialog() {
    const params = [...this.ids]
    this.$api.delteUser(params).then(res => {

      if (res) {
        this.centerDialogVisible = false
        this.$message.success('删除成功')
        this.getUser()
        this.ids = []
      }
  
    })
  }


  closeDialog() {
    this.dialogShow = false;
    this.getUser()
  }





}
</script>
 
<style lang="scss" scoped>
.user-manage {
  width: 100%;
  height: 100%;
  position: relative;

  .list {
    .icon-sign {
      margin-right: 6px;

      /deep/ .el-button--small,
      .el-button--small.is-round {
        padding: 8px 20px !important;
      }
    }
  }

  .data-list {
    margin-top: 6px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    .box-card {
      width: 24.3%;
      margin-top: 14px;
      border-radius: 10px;

      .card {
        width: 100%;
        height: 138px;
        background-color: #fff;
        border-radius: 10px;
        overflow: hidden;
        box-sizing: border-box;

        .checkbox-style {
          margin-top: 10px;
          margin-left: 10px;

          /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
          .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: #0887e0;
            border-color: #0887e0;
          }
        }

        .card-word {
          margin-left: 20px;
          overflow: hidden;
          position: relative;

          .word-text {
            font-size: 18px;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 700;
            text-align: left;
            color: #20232a;
            line-height: 25px;
            margin-right: 80px;
          }

          .card-img {
            cursor: pointer;
            display: inline-block;
            text-align: right;

            img {
              width: 18px;
              height: 18px;
              vertical-align: middle;
            }
          }

          .edit {
            position: absolute;
            right: 40px;
          }

          .juli {

            position: absolute;
            right: 14px;
          }
        }

        .name-date {
          margin-left: 20px;
          margin-top: 18px;

          p {
            margin: 0;
            margin-top: 6px;

            .name-label {
              font-size: 14px;
              font-family: PingFangSC, PingFangSC-Light;
              font-weight: 300;
              text-align: left;
              color: #777777;
              line-height: 20px;
            }
          }
        }
      }
    }

    @media (max-width:1630px) {
      .box-card {
        float: left;
        width: 32.6%;
        box-sizing: border-box;
        padding: 10px;
        min-width: 150px;
      }
    }

    @media (max-width:1366px) {
      .box-card {
        float: left;
        width: 32.6%;
        box-sizing: border-box;
        padding: 10px;
        min-width: 150px;
      }
    }

    @media (max-width:1200px) {
      .box-card {
        float: left;
        width: 32.6%;
        box-sizing: border-box;
        padding: 10px;
        min-width: 150px;
      }
    }

    .pick {
      width: 24.3%;
      overflow: hidden;
    }

    .card {
      width: 100%;
    }

  }

  .data-list:after {
    content: '';
    width: 24.3%;
  }

  // no-data
  .no-data {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      img {
        display: block;
        width: 200px;
        height: 168px;
        border: 1px dashed #ccc;
      }

      p {
        margin: 0;
        margin-top: 32px;
        font-size: 16px;
        font-family: SourceHanSansCN, SourceHanSansCN-Normal;
        font-weight: Normal;
        text-align: center;
        color: #20232a;
        line-height: 24px;
      }
    }
  }

  .paging {
    margin-top: 40px;
    margin-bottom: 50px;
    text-align: right;
    right: 20px;
  }

  // js内部面板样式
  .dia-htitle {
    width: 100px;
    height: 28px;
    font-size: 20px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    text-align: left;
    color: #333333;
    line-height: 28px;
  }

  /deep/ .el-dialog {
    border-radius: 10px;
  }

  .diaLog-span {
    display: block;
    width: 100%;
    font-size: 20px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    text-align: center;
    color: #333333;
    line-height: 28px;
  }

  .dialog-footer {
    .btn-sty {
      margin-right: 20px;
      margin-bottom: 30px;
      padding: 10px 20px;
    }
  }

  // 按钮样式修改
  .el-button–primary {
    color: rgba(11, 178, 144, 1);
    background-color: #8B83D2;
    border-color: #8B83D2;
  }

  .el-button–primary:hover {
    background-color: rgba(11, 178, 144, 1);
    border-color: rgba(11, 178, 144, 1);
  }

  .el-button–primary:focus {
    background-color: rgba(11, 178, 144, 1);
    border-color: rgba(11, 178, 144, 1);
  }

  .delete {
    /deep/ .el-button {
      background: #FFF;
      border: 1px solid #DCDFE6;
      color: rgba(11, 178, 144, 1);
    }
  }

  /deep/ .el-checkbox__inner:hover {
    border-color: rgba(11, 178, 144, 1);
  }



  .dia-sign {

    // 弹框按钮样式迭代
    // 朴素按钮样式迭代
    // hover
    /deep/ .el-button:first-child:hover {
      color: rgba(11, 178, 144, 1);
      border-color: rgba(11, 178, 144, 1);
    }

    /deep/ .el-button:first-child:focus {
      color: rgba(11, 178, 144, 1);
      border-color: rgba(11, 178, 144, 1);
    }
  }


  /deep/ .el-card__body {
    padding: 0px;
  }


}
</style>