<!--  Source Code From LAMP Zip File-->
<?php
	// retrieves input data from client request

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	// establishes the connection
	$conn = new mysqli("localhost", "username", "password", "database"); 	
	
	// the connection was not successful
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	// the connection was sucessful
	else
	{
		// $stmt will query the database for the information given from input
		$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();

		// the return if the users exist or not
		$result = $stmt->get_result();

		// the user exists 
		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
		}
		// the user does not exists
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}
	
	// function reads the JSON input from client's request
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	// function sets response type to JSON and echoes the provided object
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	// function returns error 
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	// function returns user information
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
