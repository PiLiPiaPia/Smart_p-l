<template>
<div class="sub_borrow">
    <div class="leftpart" v-if="!submitActive">
        <div  class="info">
            <div class="info_part">
                <img class="info_pic" src="/static/business/public/info.png"/>
                <span class="info_text">请填写寻求担保信息，获得担保匹配企业推荐结果</span>
            </div>
            <img class="dividing" src="/static/business/public/dividingline_write.png"/>
            <div class="abstract">
                <input class="msg_item" id="input_city" type="text" v-model="message.city"></input>
                <span>市</span>
                <input class="msg_item" id="input_project" type="text" v-model="message.project"></input>
                <span>项目借款</span>
                <input class="msg_item" id="input_amount" type="number" v-model.number="message.amount"></input>
                <span>万人民币担保申请</span>
            </div>
            <div class="info_basic"><span>担保申请主体：&emsp;&emsp;{{basicInfo.comName}}</span></div>
            <div class="info_basic"><span>注册地址：&emsp;&emsp;&emsp;&emsp;{{basicInfo.comRegistAddresss}}</span></div>
            <div class="info_basic"><span>所属行业：&emsp;&emsp;&emsp;&emsp;{{basicInfo.comField}}</span></div>
            <div class="info_basic"><span>注册资本：&emsp;&emsp;&emsp;&emsp;{{basicInfo.comCapital}}万元</span></div>
            <div class="info_basic"><span>担保贷款项目简述</span></div>
            <div class="long_input"><textarea type="text" placeholder="（请填写项目简述，不超过100字）"  maxlength="100" v-model="message.project_brief"></textarea></div>
            <div class="info_item" :style="{margin: '15px auto 0px auto'}">
                <span>担保费用&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <input class="msg_item" type="number" :style="{width: '94px'}" v-model.number="message.cost"></input>
                <span>&emsp;万人民币</span>
            </div>
            <div class="info_item" :style="{margin: '15px auto 0px auto'}">
                <span>申请担保的贷款额度&emsp;&emsp;&emsp;</span>
                <input class="msg_item" type="number" :style="{width: '94px'}" v-model.number="message.amount_guarantee"></input>
                <span>&emsp;万人民币</span>
            </div>
            <div class="info_item" :style="{margin: '15px auto 0px auto'}">
                <span>申请担保的贷款利率&emsp;&emsp;&emsp;</span>
                <input class="msg_item" type="number" :style="{width: '94px'}" v-model.number="message.rate_guarantee"></input>
                <span>&emsp;%/年</span>
            </div>
            <div class="info_item" :style="{margin: '15px auto 0px auto'}">
                <span>申请担保的贷款期限&emsp;&emsp;&emsp;</span>
                <input class="msg_item" type="number" :style="{width: '94px'}" v-model.number="message.loan_ddl"></input>
                <span>&emsp;月内</span>
            </div>
            <div class="info_item" :style="{margin: '15px auto 0px auto'}">
                <span>抵押物类型&emsp;&emsp;&emsp;</span>
                <input id="fixed_wealth" type="checkbox" :style="{width: '18px', height: '18px'}" v-model="message.mortgage_fixed"/>
                <label for="fixed_wealth">固定资产&emsp;&emsp;&emsp;&emsp;</label>
                <input id="other_wealth" type="checkbox" :style="{width: '18px', height: '18px'}" v-model="message.mortgage_other"/>
                <label for="other_wealth">其他资产</label>
            </div>
            <div class="info_item" :style="{margin: '15px auto 0px auto'}">
                <span>抵押物市值&emsp;&emsp;&emsp;</span>
                <input class="msg_item" type="number" :style="{width: '94px'}" v-model.number="message.mortgage"></input>
                <span>&emsp;万元</span>
            </div>
            <div class="check" :style="{margin: '15px auto 0px auto'}">
                <span>寻求担保方式&emsp;&emsp;</span>
                <input id="single" type="radio" value="single" :style="{width: '18px', height: '18px', border: '2px solid #666'}" v-model="message.guarantee_way"/>
                <label for="single">单企业担保&emsp;&emsp;&emsp;</label>
                <input id="multi" type="radio" value="multi" :style="{width: '18px', height: '18px'}" v-model="message.guarantee_way"/>
                <label for="multi" >多企业担保&emsp;&emsp;&emsp;</label>
            </div>
            <div :style="{margin: '15px auto 0px auto'}"><span>企业目前贷款情况</span></div>
            <div class="long_input"><textarea type="text" v-model="message.situation.about_borrow" ></textarea></div>
            <div :style="{margin: '15px auto 0px auto'}"><span>还款资金来源</span></div>
            <div class="long_input"><textarea type="text" v-model="message.situation.about_repaySource"></textarea></div>
            <div :style="{margin: '15px auto 0px auto'}"><span>还款计划</span></div>
            <div class="long_input"><textarea type="text" v-model="message.situation.about_repayPlan"></textarea></div>
            <div :style="{margin: '15px auto 0px auto'}"><span>企业资产负债状况说明</span></div>
            <div class="long_input"><textarea type="text" v-model="message.situation.about_debt"></textarea></div>
            <img class="dividing" src="/static/business/public/dividingline_write.png"/>
            <div class="info_part" :style="{margin: '10px auto 0px auto'}">
                <img class="info_pic" src="/static/business/public/info.png"/>
                <span class="info_text">请上传项目附件</span>
            </div>
            <div class="submit_files">
                <img class="submit_pic" src="/static/business/public/icon_addfiles.png"/>
                <span class="submit_text">企业营业执照/组织机构代码证/个体工商户营业执照/税务登记证</span>
            </div>
            <div class="submit_files">
                <img class="submit_pic" src="/static/business/public/icon_addfiles.png"/>
                <span class="submit_text">企业名下资产证明</span>
            </div>
            <div class="submit_files">
                <img class="submit_pic" src="/static/business/public/icon_addfiles.png"/>
                <span class="submit_text">企业贷款卡和贷款卡回执单</span>
            </div>
            <div class="submit_files">
                <img class="submit_pic" src="/static/business/public/icon_addfiles.png"/>
                <span class="submit_text">近半年已签约的购销合同及提货单</span>
            </div>
            <div class="submit_files">
                <img class="submit_pic" src="/static/business/public/icon_addfiles.png"/>
                <span class="submit_text">近半年税务单</span>
            </div>
            <div class="submit_files">
                <img class="submit_pic" src="/static/business/public/icon_addfiles.png"/>
                <span class="submit_text">近三年的财务报表</span>
            </div>
            <div class="submit_files">
                <img class="submit_pic" src="/static/business/public/icon_addfiles.png"/>
                <span class="submit_text">经合法机构审核出具的审计表</span>
            </div>
            <div class="submit_part" :style="{margin: '40px auto 0px auto'}">
                <button class="eval_button" @click="evaluate">贷款额度评估</button>
                <a class="submit_directly"><span class="submit_text">直接提交</span></a>
            </div>
        </div>
        
    </div>
    
    <div class="rightpart" v-if="!submitActive">
        <div class="line"></div>
        <div class="assess">
            <div class="result_title"><span>贷款额度评估</span></div>
            <div class="result_item"><span>企业建议最高贷款额度：&emsp;{{result.amount}}</span></div>
            <div class="result_item"><span>单笔贷款金额风险系数：&emsp;{{result.risk_factor}}</span></div>
            <div class="ps" :style="{margin: '25px auto 0px auto'}">
                <span>注：</span><br/>
                <ul :style="{padding: '0px 0px 0px 20px'}">
                    <li><p>当单笔贷款风险系数>1.5时该笔贷款担保为高风险担保</p></li>
                    <li><p>当单笔贷款风险系数≤1.0>0.8时该笔贷款担保为中风险担保</p></li>
                    <li><p>当单笔贷款风险系数<0.5时该笔贷款担保为低风险担保</p></li>
                </ul>
            </div>
            <div class="modify">
                <img class="modify_pic" src="/static/business/public/icon_evaluate_back.png"/>
                <span class="modify_text">&emsp;在左侧修改信息，重新评估</span>
            </div>
            <button class="submit_button" @click="submit">直接提交</button>
        </div>
    </div>

    <result :Id="seekId" :type="seekType" v-if="submitActive" @changeValue="goToDetail"></result>

    <div>
      <mu-dialog :open="dialog" title="错误提示">
        {{wrongMes}}
        <mu-flat-button label="确定" slot="actions" primary @click="close"/>
      </mu-dialog>
    </div>
</div>
</template>


<script>
  import result from '../result/matchResult.vue';
  import func from '../function';
  export default{
    data () {
      return {
        wrongMes: '',
        dialog: false,
        seekId: '',
        seekType: '',
        submitActive: false,
        basicInfo: {
          comName: '',
          comRegistAddresss: '',
          comField: '',
          comCreditScore: '',
          comCapital: ''
        },
        message: {
          city: '',
          project: '',
          amount: 0,
          project_brief: '',
          cost: 0,
          amount_guarantee: 0,
          rate_guarantee: 0,
          loan_ddl: 0,
          guarantee_way: '',
          mortgage: 0,
          mortgage_fixed: false,
          mortgage_other: false,
          situation: {
            about_borrow: '',
            about_repaySource: '',
            about_repayPlan: '',
            about_debt: ''
          }
        },
        result: {
          amount: '',
          risk_factor: ''
        }
      };
    },
    async created () {
      this.initData();
    },
    methods: {
      close () {
        this.dialog = false;
      },
      async initData () {
        let res;
        try {
          res = await this.$http.get('/api/user/self');
          for (var key in this.basicInfo) {
            this.basicInfo[key] = res.data[key];
          }
        } catch (e) {
          this.$store.commit('info', '用户未登录');
        }
      },
      evaluate () {
        let res = func.validateSeek(this.message);
        if (res !== 'true') {
          this.wrongMes = res;
          this.dialog = true;
          return;
        }
        this.result.amount = this.basicInfo.comCreditScore * this.basicInfo.comCapital * 1.5 / 100;
        this.result.risk_factor = ((this.message.amount_guarantee - 0.5 * this.message.mortgage) / this.result.amount).toFixed(4);
        this.result.amount += '万元';
        this.$store.commit('info', '评估成功，请查看右侧评估结果');
      },
      async submit () {
        if (this.result.risk_factor === '') {
          this.$store.commit('info', '请先进行评估再发布');
          return;
        }
        let messageSubmit = {
          city: this.message.city,
          project: this.message.project,
          cost: this.message.cost,
          amount_gurantee: this.message.amount_guarantee,
          rate_gurantee: this.message.rate_guarantee,
          loan_ddl: this.message.loan_ddl,
          other_detail: this.message.project_brief,
          guarantee_way: this.message.guarantee_way,
          mortgage: this.message.mortgage,
          mortgage_fixed: this.message.mortgage_fixed,
          mortgage_other: this.message.mortgage_other
        };
        console.log(messageSubmit);
        let res;
        try {
          res = await this.$http.post('/api/gurantee/seek', messageSubmit);
          this.$store.commit('info', '发布成功');
          this.seekId = res.data;
          this.seekType = this.message.guarantee_way;
          this.submitActive = true;
          console.log(res);
        } catch (e) {

        }
      },
      goToDetail () {
        this.$emit('goToDetail');
      }
    },
    components: {
      result
    }
  };
</script>

<style lang="scss" scoped>
input{
  outline: none;
}
input[type="radio"], input[type="checkbox"]{
  display: none;
}
input[type="radio"]+label, input[type="checkbox"]+label{
  display: inline-block;
}
label::before{
  content: "";
  display: inline-block;
  width: 18px;
  height: 18px;
  background: url("/static/business/public/rec_select.png");
  background-size: 100% 100%;
  vertical-align: middle;
  margin-right: 5px;
  -webkit-box-sizing:border-box;
}
input[type="radio"]:checked+label::before, input[type="checkbox"]:checked+label::before{
  background: url("/static/business/public/rec_selected.png");
  background-size: 100% 100%;
}
.sub_borrow{
    width: 100%;
    height: auto;
    color: #4b4b4b;
    font-size: 15px;
    padding-top: 30px;
    padding-bottom: 100px;
    .leftpart{
        width: 72%;
        height: auto;
        display: inline-block;
        .msg_item{
            height: 25px;
            border-radius: 5px;
            font-size: 15px;
            border: 1px solid #4b4b4b;
            text-align: center;
        }
        .info{
            width: 600px;
            height: auto;
            margin-left: auto;
            margin-right: auto;
            position: relative;
            left:40px;
            .info_part{
                width: 100%;
                height: 30px;
                .info_pic{
                    size: 30px 30px;
                    display: inline-block;
                    float: left;
                }
                .info_text{
                    display: inline-block;
                    float: left;
                    font-size: 15px;
                    margin-left: 18px;
                    margin-top: 4px;
                }
            }
            .dividing{
                width: 100%;
                height: 7px;
                margin-top: 30px;
            }
            .abstract{
                width: 100%;
                height: 27px;
                margin-top: 24px;
                span{
                    padding-left: 16px;
                    padding-right: 16px;
                }
                #input_city{
                    width: 75px;
                    height: 100%;
                }
                #input_project{
                    width: 120px;
                    height: 100%;
                }
                #input_amount{
                    width: 90px;
                    height: 100%;
                }
            }
            .info_basic{
                width: 100%;
                height: auto;
                margin-top: 16px;
            }
            .long_input{
                width: 100%;
                height: 82px;
                margin-top: 12px; 
                textarea{
                    width: 100%;
                    height: 80px;
                    border-radius: 5px;
                    font-size: 15px;
                    border: 1px solid #4b4b4b;
                    resize: none;
                    color: #cccccc;
                }
                textarea:focus{
                    outline: 1px solid #ffffff;
                    border: 0px;
                    box-shadow: 0 0 0px 1px #d6a12c;
                }
            }
            .submit_files {
              width: 530px;
              height: 92px;
              text-align: center;
              float: left;
              margin-top: 15px;
              border: 1px solid #4b4b4b;
              border-radius: 5px;
              padding-top: 20px;
              .submit_pic{
                width: 26px;
                height: 26px;
                size: 26px 26px;
                display: block;
                margin: 5px auto auto auto;
              }
              .submit_text{
                display: block;
              }
            }
            .submit_part{
              .eval_button{
                border-radius: 20px;
                color: #ffffff;
                height: 42px;
                width: 147px;
                border: 0px;
                display: inline-block;
                float: left;
                margin-left: 190px;
                margin-top: 20px;
                cursor: pointer;
                background: #D6A12C;
              }
              .submit_directly{
                display: inline-block;
                float: left;
                position: relative;
                top: 32px;
                left: 135px;
                .submit_text{
                  text-decoration: underline;
                  font-size: 15px;
                  color: #D6A12C;
                }
              }
            }
        }
    }
    .rightpart{
        width: 28%;
        height: auto;
        display: inline-block;
        float: right;
        .line{
            display: inline-block;
            float: left;
            width: 3px;
            height: 1800px;
            margin-top: 50px;
            background: url("/static/business/public/line_straight.png");
            background-size: 100% 100%;
        }
        .assess{
            width: 270px;
            height: auto;
            display: inline-block;
            float: left;
            margin-left: 40px;
            .result_title{
              font-size: 25px;
              color: #D6A12C;
              margin-bottom: 25px;
            }
            .result_item{
              margin-top: 5px;
            }
            .modify{
              margin-top: 40px;
              .modify_pic{
                float: left;
              }
              .modify_text{
                float: left;
                font-size: 15px;
                color: #D6A12C;
                position: relative;
                top: -3px;
              }
            }
            .submit_button{
              height: 40px;
              width: 146px;
              border-radius: 20px;
              color: #D6A12C;
              background-color: #ffffff;
              margin-top: 20px;
              cursor: pointer;
              border: 1px solid #D6A12C;
            }
        }
    }
}
</style>

<style lang="scss">
.mu-dialog-title, .mu-flat-button-label{
    color: #d6a12c;
  }
  .mu-dialog-title{
    font-size: 20px;
  }
  .mu-dialog-body {
    font-size: 16px;
  }
  .mu-dialog{
    width: 50%;
  }
</style>
