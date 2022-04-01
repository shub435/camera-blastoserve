<?php
  
        // servername => localhost
        // username => root
        // password => empty
        // database name => staff
        $conn = mysqli_connect("localhost", "root", "", "staff");
          
        // Check connection
        if($conn === false){
            die("ERROR: Could not connect. " 
                . mysqli_connect_error());
        }
          
        // Taking all 4 values from the form data(input)
        $first_name =  $_REQUEST['fname'];
        $last_name = $_REQUEST['lname'];
        $number =$_REQUEST['number'];
        $pictures =$_REQUEST['canvas'];
          
        // Performing insert query execution
        // here our table name is college
        $sql = "INSERT INTO employee  VALUES ('$first_name', 
            '$last_name','$number')";
          
        if(mysqli_query($conn, $sql)){
            echo "<h3>data stored in a database successfully." 
                . " Please browse your localhost php my admin" 
                . " to view the updated data</h3>"; 
  
            echo nl2br("\n$first_name\n $last_name\n "
                . "$number \n $picture");
        } else{
            echo "ERROR: Hush! Sorry $sql. " 
                . mysqli_error($conn);
        }
          
        // Close connection
        mysqli_close($conn);
        ?>