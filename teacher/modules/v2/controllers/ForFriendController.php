<?php

namespace teacher\modules\v2\controllers;

use teacher\modules\v2\models\SendMessage;
use Yii;

error_reporting(0);

class ForFriendController extends MainController
{
    public $modelClass = 'teacher\modules\v2\models\NewStudio';

    /**
     * [actionIndex 获取画室基本信息]
     * @param string $name [画室名]
     *
     * @version
     * @date
     * @copyright
     */
    public function actionList()
    {
        $modelClass = $this->modelClass;

        $name = Yii::$app->request->post('name');

        $list = $modelClass::find()
            ->where(['status' => $modelClass::STATUS_ACTIVE])
            ->andFilterWhere(['like', 'name', $name])
            ->all();

        $NewList = array();

        foreach ($list as $key => $value) {

            $new = $value->toArray();

            $NewList[] = array(
                'id' => $value->id,
                'name' => $value->name,
                'teacherList' => array(
                    array(
                        'id' => 1,
                        'title' => '老师总数',
                        'number' => $value->teacher_num,
                        'param' => 'teacher_add_num',
                        'otherArray' => array(
                            array(
                                'id' => 1,
                                'title' => '已生成',
                                'number' => $new['teacher_sc']
                            ),
                            array(
                                'id' => 2,
                                'title' => '未使用',
                                'number' => $new['not_teacher_num']
                            ),
                            array(
                                'id' => 3,
                                'title' => '已激活',
                                'number' => $new['teacher_jh']
                            ),
                            array(
                                'id' => 4,
                                'title' => '未激活',
                                'number' => $new['teacher_wjh']
                            )
                        ),
                    ),
                ),
                'studentList' => array(
                    array(
                        'id' => 2,
                        'title' => '1年总数',
                        'number' => $value->one_year_num,
                        'param' => 'one',
                        'otherArray' => array(
                            array(
                                'id' => 1,
                                'title' => '已生成',
                                'number' => $new['one_sc']
                            ),
                            array(
                                'id' => 2,
                                'title' => '未使用',
                                'number' => $new['not_one_num']
                            ),
                            array(
                                'id' => 3,
                                'title' => '已激活',
                                'number' => $new['one_jh']
                            ),
                            array(
                                'id' => 4,
                                'title' => '未激活',
                                'number' => $new['one_wjh']
                            )
                        ),
                    ),
                    array(
                        'id' => 3,
                        'title' => '2年总数',
                        'number' => $value->two_years_num,
                        'param' => 'two',
                        'otherArray' => array(
                            array(
                                'id' => 1,
                                'title' => '已生成',
                                'number' => $new['two_sc']
                            ),
                            array(
                                'id' => 2,
                                'title' => '未使用',
                                'number' => $new['not_two_num']
                            ),
                            array(
                                'id' => 3,
                                'title' => '已激活',
                                'number' => $new['two_jh']
                            ),
                            array(
                                'id' => 4,
                                'title' => '未激活',
                                'number' => $new['two_wjh']
                            )
                        ),
                    ),
                    array(
                        'id' => 4,
                        'title' => '3年总数',
                        'number' => $value->three_years_num,
                        'param' => 'three',
                        'otherArray' => array(
                            array(
                                'id' => 1,
                                'title' => '已生成',
                                'number' => $new['three_sc']
                            ),
                            array(
                                'id' => 2,
                                'title' => '未使用',
                                'number' => $new['not_three_num']
                            ),
                            array(
                                'id' => 3,
                                'title' => '已激活',
                                'number' => $new['three_jh']
                            ),
                            array(
                                'id' => 4,
                                'title' => '未激活',
                                'number' => $new['three_wjh']
                            )
                        ),
                    ),
                ),
            );
        }


        $_GET['message'] = Yii::t('api', 'Sucessfully Get List');

        return $NewList;
    }


    //画室增加数量
    public function actionAddNum()
    {

        $modelClass = $this->modelClass;

        $id = Yii::$app->request->post('id');
        $type = Yii::$app->request->post('type');
        $number = Yii::$app->request->post('number');
        $text = Yii::$app->request->post('text');
        $sign = Yii::$app->request->post('sign');

        if ($text != '234249') {
            return SendMessage::sendErrorMsg("没有权限");
        }
        switch ($type) {
            case 'teacher_add_num':
                $key = 'teacher_num';
                break;
            case 'one':
                $key = 'one_year_num';
                break;
            case 'two':
                $key = 'two_years_num';
                break;
            case 'three':
                $key = 'three_years_num';
                break;
            case 'three_yue':
                $key = 'three_month_num';
                break;
            case 'one_yue':
                $key = 'one_month_num';
                break;

            default:
                return SendMessage::sendErrorMsg("参数错误");
                break;
        }

        $Studio = $modelClass::findOne($id);
     
        if ($sign == "add") {
            $number = $number ? $number : 0;
            $msg = "增加";
        } elseif ($sign == "reduce") {
            if ($number >= $Studio->$key) {
                $number = $Studio->$key;
            }
            $number = $number ? -$number : 0;
            $msg = "减少";
        }

        if ($type == 'teacher_add_num') {
            $array = array($key => $number);

        } else {
            $array = array($key => $number, 'review_num' => $number);
        }

        if ($Studio::updateAllCounters($array, ['id' => $id])) {

            return SendMessage::sendSuccessMsg($msg . "成功");
        } else {
            return SendMessage::sendErrorMsg($msg . "失败");
        }
    }

    //查询校长账号
    public function actionGetMaster()
    {
        $modelClass = $this->modelClass;

        $studio_id = Yii::$app->request->post('studio_id');

        $studio = $modelClass::findOne($studio_id);

        $master = $studio->getMaster($studio_id);
        if ($master) {
            $_GET['message'] = "获取成功";
            return $master;
        } else {
            return SendMessage::sendErrorMsg("获取失败");
        }
    }

    //账号延期
    public function actionSetMaster()
    {
        $modelClass = $this->modelClass;
        $studio_id = Yii::$app->request->post('studio_id');
        $studio = $modelClass::findOne($studio_id);

        if ($studio->setMaster($studio_id)) {
            return SendMessage::sendSuccessMsg("延期成功");
        } else {
            return SendMessage::sendErrorMsg("延期失败");
        }
    }

    //重置后台密码
    public function actionSetPassword()
    {
        $modelClass = $this->modelClass;
        $studio_id = Yii::$app->request->post('studio_id');
        $studio = $modelClass::findOne($studio_id);

        if ($studio->setPassword($studio_id)) {
            return SendMessage::sendSuccessMsg("重置密码成功");
        } else {
            return SendMessage::sendErrorMsg("重置密码失败");
        }
    }


}