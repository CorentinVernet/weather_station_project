<?php
header('Content-Type: application/json');

$data = [
    'temperature' => '20°C',
    'humidity' => '50%',
    'pressure' => '1013 hPa',
    'windSpeed' => '15 km/h'
];

echo json_encode($data);
?>
