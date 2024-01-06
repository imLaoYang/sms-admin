<template>
  <div class="dialog-item">
    <el-dialog :title="title" :visible.sync="dialogShow" :before-close="closeDialog" :close-on-click-modal="false"
      :show-close="true" width="660px" top="22vh">
      <m-form :formData="diaFormData" :columns="formColumns" ref="mform" />
      <div slot="footer" style="text-align:center;">
        <el-button @click="closeDialog" style="margin-right:30px;padding: 10px 20px;font-weight: 300;">取消</el-button>
        <el-button type="primary" style="margin-bottom:20px;padding: 10px 20px;font-weight: 300;"
          @click="addOrUpdateUser">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="tsx">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class UserManageDialog extends Vue {
  static componentName = 'UserManageDialog'

  @Prop([Boolean]) dialogShow!: boolean
  @Prop([String]) title!: string
  @Prop([Object]) diaFormData!: object
  private confirmpaw!: string

  $refs!: {
    mform: any;
  }

  get formColumns() {
    return [
      
    {
        label: '用户类型：',
        prop: 'userType',
        el: 'radio-group',
        span: 22,
        list: [
          {
            label: '管理员',
            value: '1'
          },
          {
            label: '普通用户',
            value: '2'
          }
        ],
        rules: {
          required: true,
          trigger: 'change',
          message: '请勾选用户类型'
        }
      },
      {
        label: '用户名：',
        prop: 'userName',
        placeholder: '长度限制2-12个字符',
        el: 'input',
        span: 22,
        width: '100%',
        clearable: true,
        rules: {
          required: true,
          trigger: 'blur',
          validator: (rules: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('用户名不能为空'))
            } else {
              if (value.length > 12 || value.length < 2) {
                callback(new Error('用户名字符长度为2-12之间'))
              } else {
                callback()
              }
            }
          }
        }
      },
      {
        label: '昵称：',
        prop: 'nickName',
        placeholder: '长度限制2-12个字符',
        el: 'input',
        span: 22,
        width: '100%',
        clearable: true,
        rules: {
          required: true,
          trigger: 'blur',
          validator: (rules: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('昵称不能为空'))
            } else {
              if (value.length > 12 || value.length < 2) {
                callback(new Error('昵称长度为2-12之间'))
              } else {
                callback()
              }
            }
          }
        }
      },
      {
        label: '密码：',
        prop: 'password',
        placeholder: '长度限制3-12个字符',
        type: 'password',
        el: 'input',
        span: 22,
        width: '100%',
        clearable: true,
        rules: {
          required: true,
          trigger: 'blur',
          validator: (rules: any, value: string, callback: Function) => {
            this.confirmpaw = value
            if (!value) {
              callback(new Error('密码不能为空'))
            } else {
              if (value.length > 12 || value.length < 3) {
                callback(new Error('密码长度为3-12之间'))
              } else {
                callback()
              }
            }
          }
        }
      },
      {
        label: '确认密码：',
        prop: 'confirmPassword',
        placeholder: '长度限制3-12个字符',
        type: 'password',
        el: 'input',
        span: 22,
        width: '100%',
        clearable: true,
        rules: {
          required: true,
          trigger: 'blur',
          validator: (rules: any, value: string, callback: Function) => {
            if (!value) {
              callback(new Error('请确认密码'))
            } else {
              if (value.length > 12 || value.length < 3) {
                callback(new Error('密码长度为3-12之间'))
              }
              if (this.confirmpaw !== value) {
                callback(new Error('两次密码长度不一致'))
              }
              callback()
            }
          }
        }
      }
    ]
  }

  closeDialog() {
    this.resetForm()
    this.$emit('closeDialog')
  }

  resetForm() {
    this.$refs.mform.resetFields()
  }



  addOrUpdateUser() {
    this.$refs.mform.validate().then((value: boolean) => {
      const params = {
        ...this.diaFormData
      } as any
      if (value) {
        this.title === '添加用户' ? this.$api.addUser(params).then(res => {
          if (res === true || res !== null) {
            this.$message.success('添加用户成功')
            this.$emit('closeDialog')
          }
        }) : this.$api.alterUser(params).then(res => {
          if (res === true || res !== null) {
            this.$message.success('修改用户信息成功')
            this.$emit('closeDialog')
          }
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.dialog-item {
  /deep/ .el-dialog {
    border-radius: 10px;
  }

  /deep/ .el-dialog__title {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    text-align: left;
    color: #333333;
    line-height: 22px;
  }

  /deep/ .el-textarea__inner {
    height: 134px !important;
  }

  /deep/ .el-input__inner:focus {
    border-color: rgba(11, 178, 144, 1);
  }

  /deep/ .el-textarea__inner:focus {
    border-color: rgba(11, 178, 144, 1);
  }

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
</style>