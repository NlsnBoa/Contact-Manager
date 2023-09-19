<?php

    $inData = getRequestInfo();
    
    $firstname = $inData["firstname"];
    $lastname = $inData["lastname"];
    $phone = $inData["phone"];
    $email = $inData["email"];
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "Group19", "COP4331_g19", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("INSERT into Contacts (Firstname,Lastname,Phone,Email,UserId) VALUES(?,?,?,?,?)");
		$stmt->bind_param("ssssi", $firstname, $lastname, $phone, $email, $userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>