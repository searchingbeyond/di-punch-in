<?php

    $data = array(
        array("id" => 5, "item_name"=>"jogger", "start_date"=>"2015-06-09", "consist"=>5),
        array("id" => 7, "item_name"=>"swiming", "start_date"=>"2016-06-29",  "consist"=>5),
        array("id" => 9, "item_name"=>"climb", "start_date"=>"2015-08-09",  "consist"=>5),
        array("id" => 5, "item_name"=>"basketball", "start_date"=>"2018-06-09",  "consist"=>5)
    );
    echo json_encode($data);