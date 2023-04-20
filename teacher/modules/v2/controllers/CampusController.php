<?php

namespace teacher\modules\v2\controllers;

use common\models\Format;
use teacher\modules\v2\models\Admin;
use teacher\modules\v2\models\User;
use Yii;


class CampusController extends MainController
{
    public  $modelClass = 'teacher\modules\v2\models\Campus';
    private $one;

    /**
     * [actionIndex 获取校区列表]
     * @copyright [Tian]
     * @version   [v2.0]
     * @date      2018-03-20
     */
    public function actionIndex($studio_id, $admin_id = '')
    {
        $modelClass = $this->modelClass;
        $campus_id  = array();
        $this->one  = Admin::findOne($admin_id);
        if ($admin_id) {
            if ($this->user_role == 10) {
                $campus_id = Format::explodeValue($this->one['campus_id']);
                $class_id  = Format::explodeValue($this->one['class_id']);
            } elseif ($this->user_role == 20) {
                $user      = User::findOne($admin_id);
                $campus_id = $user['campus_id'];
                $class_id  = $user['class_id'];
            }
            $modelClass::$list = $class_id;
        }

        $list = $modelClass::find()
            ->where(['studio_id' => $studio_id, 'status' => $modelClass::STATUS_ACTIVE])
            ->andfilterWhere(['id' => $campus_id])
            ->all();


        foreach ($list as $key => $value) {
            if (!$value->classes) {
                unset($list[$key]);
            }
        }
        $_GET['message'] = Yii::t('teacher', 'Sucessfully Get List');

        return array_values($list);
    }

    /**
     * [actionIndex 获取校区列表]
     * @copyright [Tian]
     * @version   [v2.0]
     * @date      2018-03-20
     */
    public function actionGetList()
    {
        $modelClass = $this->modelClass;
        $admin_id   = Yii::$app->request->post('admin_id');
        $studio_id  = Yii::$app->request->post('studio_id');

        $admin     = Admin::findOne($admin_id);
        $campus_id = Format::explodeValue($admin['campus_id']);

        $_GET['message'] = Yii::t('teacher', 'Sucessfully Get List');

        return \common\models\Campus::find()
            ->select("id,name")
            ->where(['studio_id' => $studio_id, 'status' => $modelClass::STATUS_ACTIVE])
            ->all();
    }

    //返回课件范围内的班级
    public function actionGetVisual()
    {
        $modelClass = $this->modelClass;

        $admin_id  = Yii::$app->request->post('admin_id');
        $studio_id = Yii::$app->request->post('studio_id');

        $admin     = Admin::findOne($admin_id);
        $campus_id = Format::explodeValue($admin['campus_id']);
        $class_id  = Format::explodeValue($admin['class_id']);

        $modelClass::$list = $class_id;

        $list = $modelClass::find()
            ->select("id,name")
            ->where(['studio_id' => $studio_id, 'status' => $modelClass::STATUS_ACTIVE, 'id' => $campus_id])
            ->all();
        foreach ($list as $key => $value) {
            if (!$value->classes) {
                unset($list[$key]);
            }
        }
        $_GET['message'] = Yii::t('teacher', 'Sucessfully Get List');

        return array_values($list);
    }


}