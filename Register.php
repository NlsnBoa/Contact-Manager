
<?php

	$inData = getRequestInfo();
	
	$firstName = "";
	$lastName = "";
    $username = "";
    $password = "";

	echo "Connecting...\n";
	$conn = new mysqli("localhost", "Group19", "COP4331_g19", "COP4331"); 	
	echo "Connected!";

	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT into Users (Firstname,Lastname,Login,Password) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["login"], $inData["password"]);
		$stmt->execute();
		$stmt->close();
        $conn->close();
		returnWithInfo($row['ID'], $row['firstName'], $row['lastName'], $row['login'], $row['password']);
		returnWithError("");
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","login":"","password":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $id, $firstName, $lastName, $login, $password )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","login":' . $login . ',"password":' . $password . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
