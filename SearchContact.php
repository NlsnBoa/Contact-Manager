 <!-- Search Contact -->
<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "Group19", "COP4331_g19", "COP4331"); 	

	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT FirstName, LastName, Phone, Email, UserID FROM Contacts WHERE FirstName LIKE ? AND UserID=?");
		$firstName = "%" . $inData["firstName"] . "%";
		$stmt->bind_param("ss", $firstName, $inData["userID"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"' . $row["FirstName"] . '",';
			$searchResults .= '"' . $row["LastName"] . '",';
			$searchResults .= '"' . $row["Phone"] . '",';
			$searchResults .= '"' . $row["Email"] . '",';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Contacts Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>