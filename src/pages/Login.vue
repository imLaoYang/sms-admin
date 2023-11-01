<template>
	<div class="login-wrap">
		<div class="continer">
			<div class="ms-logo"></div>
			<div class="ms-login">
				<!-- 登录框 -->
				<div class="login-frame">
					<div class="ms-title">
						<img src="@/assets/Login/title.png" alt="" />
					</div>
					<m-form :formData="ruleForm" :columns="formColumns" ref="ruleForm" @keyup.enter.native="submitForm"
						size="medium" />
					<el-button slot="btn" class="login-btn" size="medium" type="danger" @click="submitForm"
						:disabled="ruleForm.userName !== '' && ruleForm.password !== '' ? false : true">登<span
							style="margin-left:10px;">录</span></el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang='tsx'>
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Login extends Vue {
	ruleForm = {
		userName: '',
		password: ''
	}

	$refs!: {
		ruleForm: any;
	}
	get formColumns() {
		return [
			{
				prop: 'userName',
				el: 'input',
				labelWidth: '0px',
				span: 22,
				offset: 1,
				placeholder: '请输入用户名',
				prefixIcon: 'iconfont icon-shouji',
				rules: {
					required: true,
					trigger: 'blur',
					validator: (rule: any, value: string, callback: Function) => {
						if (value === '') {
							callback(new Error('请输入用户名'))
						} else {
							callback()
						}
					}
				}
			},
			{
				prop: 'password',
				el: 'input',
				type: 'password',
				labelWidth: '0px',
				span: 22,
				offset: 1,
				placeholder: '请输入密码',
				prefixIcon: 'iconfont icon-suo',
				showPassword: true,
				rules: {
					required: true,
					message: '请输入密码',
					trigger: 'blur'
				}
			},
			{
				prop: 'btn',
				labelWidth: '0px',
				span: 24
			}
		]
	}

	submitForm() {
		this.$store.dispatch('login', this.ruleForm)
	}
}
</script>

<style lang="scss" scoped>
.login-wrap {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	background: url(~@/assets/Login/1.svg);
	background-size: cover;
	justify-content: center;
	align-items: center;
	

	.continer {
		width: 1600px;
		height: 773px;
		border-radius: 10px;
		box-shadow: 0px 2px 82px 0px #a8bab5;
		z-index: 1;
		display: flex;

		.ms-logo {
			width: 952px;
			height: 773px;
			background: url(~@/assets/Login/person.jpg);
			background-size: cover;
			justify-content: center;
		}

		.ms-login {
			border-radius: 6px;
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #fff;

			.login-frame {
				text-align: center;
				width: 450px;
				height: 384px;

				// border: 1px dashed #ccc;
				.ms-title {
					font-size: 50px;
					font-family:Verdana, Geneva, Tahoma, sans-serif;
					margin-top: 18px;
					margin-bottom: 37px;

					img {
						width: 170px;
						height: 55px;
					}
				}
			}
		}
	}

	/deep/ .el-input--medium .el-input__inner {
		height: 50px;
		line-height: 50px;
	}

	/deep/ .el-button {
		width: 90%;
		border-radius: 12px;
		padding: 20px 20px;
		box-sizing: border-box;
		font-size: 18px;
		background: #0887e0;
		border-color: #0887e0;
	}

	/deep/ .el-input--medium .el-input__icon {
		line-height: 50px;
	}
}
</style>