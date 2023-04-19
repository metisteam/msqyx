<?php

use yii\db\Migration;

class m170205_093908_category extends Migration
{
    const TBL_NAME = '{{%category}}';

     /**
     * 创建表选项
     * @var string
     */
    public $tableOptions = null;

    /**
     * 是否创建为事务表
     * @var bool
     */
    public $useTransaction = true;
    
    public function safeUp()
    {
        if ($this->db->driverName === 'mysql') {
            $engine = $this->useTransaction ? 'InnoDB' : 'MyISAM';
            $this->tableOptions = 'CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci ENGINE=' . $engine;
        }

        $this->execute($this->delTable());
        $this->createTable(self::TBL_NAME, [
            'id' => $this->primaryKey()->unsigned()->comment('ID'),
            'type' => $this->smallInteger()->notNull()->comment('类型'),
            'pid' => $this->integer()->notNull()->defaultValue(0)->comment('父类'),
            'name' => $this->string(20)->notNull()->comment('名称'),
            'level' => $this->smallInteger()->notNull()->defaultValue(0)->comment('等级'),
            'color' => $this->string(20)->comment('颜色'),
            'priority' => $this->integer()->notNull()->defaultValue(0)->comment('优先级'),

            'created_at' => $this->integer()->notNull()->comment('创建时间'),
            'updated_at' => $this->integer()->notNull()->comment('更新时间'),
            'status' => $this->smallInteger()->notNull()->defaultValue(10)->comment('状态'),
        ], $this->tableOptions);
        $this->execute($this->getCategorySql());
    }

    private function delTable()
    {
        return "DROP TABLE IF EXISTS ".self::TBL_NAME.";";
    }

    public function safeDown()
    {
        $this->dropTable(self::TBL_NAME);
    }

    private function getCategorySql()
    {
        return "INSERT INTO `category` (`id`, `type`, `pid`, `name`, `level`, `color`, `priority`, `created_at`, `updated_at`, `status`) VALUES
        (1, 10, 0, '素描', 0, '#00ac4d', 1, 1463987935, 1463987935, 10),
        (2, 10, 0, '色彩', 0, '#ff0000', 2, 1463987935, 1463987935, 10),
        (3, 10, 0, '速写', 0, '#00b4ff', 3, 1463987935, 1463987935, 10),
        (4, 10, 0, '设计', 0, '#ffc700', 4, 1463987935, 1463987935, 10),

        (5, 20, 0, '素描', 0, NULL, 1, 1463987935, 1463987935, 10),
        (6, 20, 0, '色彩', 0, NULL, 2, 1463987935, 1463987935, 10),
        (7, 20, 0, '速写', 0, NULL, 3, 1463987935, 1463987935, 10),
        (8, 20, 0, '设计', 0, NULL, 4, 1463987935, 1463987935, 10),

        (9, 10, 1, '素描头像', 1, NULL, 1, 1463987935, 1463987935, 10),
        (10, 10, 1, '素描静物', 1, NULL, 2, 1463987935, 1463987935, 10),
        (11, 10, 1, '半身像', 1, NULL, 3, 1463987935, 1463987935, 10),
        (12, 10, 1, '石膏像', 1, NULL, 4, 1463987935, 1463987935, 10),
        (13, 10, 1, '几何形体', 1, NULL, 5, 1463987935, 1463987935, 10),
        (14, 10, 1, '头像照片', 1, NULL, 6, 1463987935, 1463987935, 10),

        (15, 10, 2, '色彩静物', 1, NULL, 1, 1463987935, 1463987935, 10),
        (16, 10, 2, '色彩头像', 1, NULL, 2, 1463987935, 1463987935, 10),
        (17, 10, 2, '色彩风景', 1, NULL, 3, 1463987935, 1463987935, 10),
        (18, 10, 2, '静物照片', 1, NULL, 4, 1463987935, 1463987935, 10),
        (19, 10, 2, '色彩场景', 1, NULL, 5, 1463987935, 1463987935, 10),

        (20, 10, 3, '人物速写', 1, NULL, 1, 1463987935, 1463987935, 10),
        (21, 10, 3, '命题场景', 1, NULL, 2, 1463987935, 1463987935, 10),
        (22, 10, 3, '生活场景速写', 1, NULL, 3, 1463987935, 1463987935, 10),
        (23, 10, 3, '生活人物速写', 1, NULL, 4, 1463987935, 1463987935, 10),
        (24, 10, 3, '速写照片', 1, NULL, 5, 1463987935, 1463987935, 10),

        (25, 10, 4, '设计素描', 1, NULL, 1, 1463987935, 1463987935, 10),
        (26, 10, 4, '设计色彩', 1, NULL, 2, 1463987935, 1463987935, 10),
        (27, 10, 4, '创意速写', 1, NULL, 3, 1463987935, 1463987935, 10),
        /******************* 分割线 ****************************/
        (28, 20, 5, '素描头像', 1, NULL, 1, 1463987935, 1463987935, 10),
        (29, 20, 5, '素描静物', 1, NULL, 2, 1463987935, 1463987935, 10),
        (30, 20, 5, '半身像', 1, NULL, 3, 1463987935, 1463987935, 10),
        (31, 20, 5, '石膏像', 1, NULL, 4, 1463987935, 1463987935, 10),
        (32, 20, 5, '几何形体', 1, NULL, 5, 1463987935, 1463987935, 10),
        (33, 20, 5, '头像照片', 1, NULL, 6, 1463987935, 1463987935, 10),

        (34, 20, 6, '色彩静物', 1, NULL, 1, 1463987935, 1463987935, 10),
        (35, 20, 6, '色彩头像', 1, NULL, 2, 1463987935, 1463987935, 10),
        (36, 20, 6, '色彩风景', 1, NULL, 3, 1463987935, 1463987935, 10),
        (37, 20, 6, '静物照片', 1, NULL, 4, 1463987935, 1463987935, 10),
        /*
        (38, 20, 7, '线描速写', 1, NULL, 1, 1463987935, 1463987935, 10),
        (39, 20, 7, '线面速写', 1, NULL, 2, 1463987935, 1463987935, 10),
        */
        (38, 20, 7, '人物速写', 1, NULL, 1, 1463987935, 1463987935, 10),
        (40, 20, 7, '命题默写', 1, NULL, 3, 1463987935, 1463987935, 10),
        (41, 20, 7, '场景速写', 1, NULL, 4, 1463987935, 1463987935, 10),
        (42, 20, 7, '生活场景速写', 1, NULL, 5, 1463987935, 1463987935, 10),
        (43, 20, 7, '生活人物速写', 1, NULL, 6, 1463987935, 1463987935, 10),
        (44, 20, 7, '速写照片', 1, NULL, 7, 1463987935, 1463987935, 10),

        (45, 20, 8, '设计素描', 1, NULL, 1, 1463987935, 1463987935, 10),
        (46, 20, 8, '设计色彩', 1, NULL, 2, 1463987935, 1463987935, 10),
        (47, 20, 8, '创意速写', 1, NULL, 3, 1463987935, 1463987935, 10),
        /******************* 后期添加 ****************************/
        (48, 10, 0, '文化课', 0, '#fffff', 5, 1463987935, 1463987935, 10);";
    }
}