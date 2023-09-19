<!-- Update Contact Page -->
<?php

    $inData = getRequestInfo();
      
    $id = 0;
    $userID = 0;
    $firstName = "";
    $lastName = "";
    $phone = "";
    $email = "";


    $conn = new mysqli("localhost", "Group19", "COP4331_g19", "COP4331"); 	

    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET UserID=?, FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=?");
        $stmt->bind_param("issssi", $inData["userID"], $inData["firstName"], $inData["lastName"], $inData["phone"], $inData["email"], $inData["id"]);

        if($stmt->execute())
        {
            returnWithInfo($inData["id"],$inData["userID"],$inData["firstName"],$inData["lastName"],$inData["phone"],$inData["email"]);
        }
        else
        {
            returnWithError("Contact was not found!");
        }

        $stmt->close();
        $conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $id, $userID, $firstName, $lastName, $phone, $email)
	{
		$retValue = '{"id":' . $id . ',"userID":' . $userID . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","phone":"' . $phone . '","email":"' . $email . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>